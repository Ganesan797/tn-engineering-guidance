import hashlib
import json
import os
import re
import shutil
import tempfile
import time
import urllib.request
import pypdf

# 66 Verified Autonomous Private Colleges (Exact accounting: 19 Chennai + 25 Kongu + 13 Southern + 9 Central = 66)
COHORT_65 = {
    # Chennai & Northern Cluster (19)
    "1216", "1112", "1128", "1210", "1114", "1309", "1311", "1307", "1118", "1122",
    "1401", "1408", "1504", "1301", "1303", "1123", "1116", "1322", "1452",
    # Coimbatore & Kongu Cluster (24)
    "2764", "2739", "2710", "2706", "2708", "2740", "2726", "2736", "2727", "2750",
    "2725", "2707", "2715", "2723", "2747", "2611", "2610", "2613", "2608", "2622",
    "2653", "2601", "2621", "2634", "2617",
    # Madurai & Southern Cluster (13)
    "5910", "5904", "4917", "4959", "4678", "4955", "4964", "5907", "4967", "5911",
    "4970", "4672", "4962",
    # Trichy & Central Cluster (9)
    "3819", "3830", "3701", "3813", "3841", "3905", "3908", "3926", "3760"
}

CATEGORIES = {"OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"}

SOURCES_SPEC = [
    {
        "source_id": "GA-2026-R1",
        "title": "ROUND 1 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-1-GENERAL-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GENERAL ACADEMIC",
        "round": "ROUND 1",
        "quota": "GENERAL_ACADEMIC",
        "type": "GA"
    },
    {
        "source_id": "GA-2026-R2",
        "title": "ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-2-GENERAL-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GENERAL ACADEMIC",
        "round": "ROUND 2",
        "quota": "GENERAL_ACADEMIC",
        "type": "GA"
    },
    {
        "source_id": "GA-2026-R3",
        "title": "ROUND 3 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-3-GENERAL-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GENERAL ACADEMIC",
        "round": "ROUND 3",
        "quota": "GENERAL_ACADEMIC",
        "type": "GA"
    },
    {
        "source_id": "GS75-2026-R1",
        "title": "GOVERNMRNT SCHOOL STUDIED (7.5% ) -  ACADEMIC - PROVISIONAL ALLOTMENT LIST - ROUND 1",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-1-GOVT-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC",
        "round": "ROUND 1",
        "quota": "GOVT_SCHOOL_7_5",
        "type": "GS75"
    },
    {
        "source_id": "GS75-2026-R2",
        "title": "ROUND 2 - GOVERNMRNT SCHOOL STUDIED (7.5% ) -  ACADEMIC - PROVISIONAL ALLOTMENT LIST",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-2-GOVT-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC",
        "round": "ROUND 2",
        "quota": "GOVT_SCHOOL_7_5",
        "type": "GS75"
    },
    {
        "source_id": "GS75-2026-R3",
        "title": "ROUND 3 - GOVERNMRNT SCHOOL STUDIED (7.5% ) -  ACADEMIC - PROVISIONAL ALLOTMENT LIST",
        "url": "https://static.tneaonline.org/docs/TNEA-2026-ROUND-3-GOVT-ACADEMIC-PROVISIONAL-ALLOTMENT-LIST.pdf",
        "year": "2026",
        "route": "GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC",
        "round": "ROUND 3",
        "quota": "GOVT_SCHOOL_7_5",
        "type": "GS75"
    }
]

RE_GA = re.compile(
    r"^\s*(\d+)\s+(\d+)\s+([A-Za-z]+)\s+(\d+(?:\.\d+)?)\s+(\d+)\s+(\d+)\s+([A-Za-z0-9]+)\s+([A-Za-z]+)\s*$"
)

RE_GS75 = re.compile(
    r"^\s*(\d+)\s+(\d+)\s+([A-Za-z]+)\s+(\d+(?:\.\d+)?)\s+(\d+)\s+(\d+)\s+(\d+)\s+([A-Za-z0-9]+)\s+([A-Za-z]+)\s*$"
)

def format_page_range(pages_set):
    pages = sorted(pages_set)
    if not pages:
        return ""
    if len(pages) == 1:
        return f"p. {pages[0]}"
    return f"pp. {pages[0]}-{pages[-1]}"

def process_source(spec, temp_dir):
    source_id = spec["source_id"]
    url = spec["url"]
    pdf_filename = f"{source_id}.pdf"
    pdf_path = os.path.join(temp_dir, pdf_filename)

    print(f"\n==========================================")
    print(f"[{source_id}] Downloading {url}...")
    t0 = time.time()
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    urllib.request.install_opener(opener)
    try:
        urllib.request.urlretrieve(url, pdf_path)
        file_size = os.path.getsize(pdf_path)

        # Compute SHA-256
        hasher = hashlib.sha256()
        with open(pdf_path, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        sha256 = hasher.hexdigest()
        print(f"[{source_id}] Downloaded: {file_size} bytes, sha256: {sha256} in {time.time()-t0:.1f}s")

        # Read pages
        reader = pypdf.PdfReader(pdf_path)
        total_pages = len(reader.pages)
        print(f"[{source_id}] Total pages: {total_pages}. Processing pages for 66 colleges...")

        is_ga = spec["type"] == "GA"
        pattern = RE_GA if is_ga else RE_GS75

        matched_rows = 0
        pages_with_matches = set()
        buckets = {} # (col_code, prog_code, allotted_cat) -> {min_mark, count, pages}

        t1 = time.time()
        for pno in range(total_pages):
            page_num = pno + 1
            text = reader.pages[pno].extract_text()
            if not text:
                continue
            page_has_match = False
            for line in text.split("\n"):
                m = pattern.match(line)
                if not m:
                    # Fallback token split if formatting had slightly irregular spacing
                    tokens = line.strip().split()
                    if is_ga and len(tokens) == 8:
                        s_no, appln_no, comm, mark_str, rank_str, col_code, prog_code, allotted_cat = tokens
                    elif not is_ga and len(tokens) == 9:
                        s_no, appln_no, comm, mark_str, g_rank, gov_rank, col_code, prog_code, allotted_cat = tokens
                    else:
                        continue
                else:
                    if is_ga:
                        s_no, appln_no, comm, mark_str, rank_str, col_code, prog_code, allotted_cat = m.groups()
                    else:
                        s_no, appln_no, comm, mark_str, g_rank, gov_rank, col_code, prog_code, allotted_cat = m.groups()

                if col_code in COHORT_65 and allotted_cat in CATEGORIES:
                    try:
                        mark = float(mark_str)
                    except ValueError:
                        continue

                    matched_rows += 1
                    page_has_match = True
                    key = (col_code, prog_code.upper(), allotted_cat)
                    if key not in buckets:
                        buckets[key] = {
                            "min_mark": mark,
                            "count": 1,
                            "pages": {page_num}
                        }
                    else:
                        b = buckets[key]
                        b["min_mark"] = min(b["min_mark"], mark)
                        b["count"] += 1
                        b["pages"].add(page_num)

            if page_has_match:
                pages_with_matches.add(page_num)

            if page_num % 200 == 0 or page_num == total_pages:
                print(f"  [{source_id}] Page {page_num}/{total_pages} ({len(pages_with_matches)} matched, {matched_rows} rows)...")

        print(f"[{source_id}] Completed in {time.time()-t1:.1f}s. Matched rows: {matched_rows}, Buckets: {len(buckets)}")
    finally:
        # Clean up PDF immediately on success, exception, or cancellation
        if os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
                print(f"[{source_id}] Scrubbed raw PDF from temp.")
            except Exception:
                pass

    source_meta = {
        "source_id": source_id,
        "title": spec["title"],
        "url": url,
        "sha256": sha256,
        "file_size": file_size,
        "total_pages": total_pages,
        "matched_rows": matched_rows,
        "pages_with_matches": len(pages_with_matches),
        "status": "PASS_CLEAN"
    }

    return source_meta, buckets

def main():
    temp_dir = tempfile.mkdtemp(prefix="clean_c65_2026_")
    print(f"Process scratch directory: {temp_dir}")

    all_sources = []
    candidates = []
    candidate_counter = 1

    try:
        for spec in SOURCES_SPEC:
            meta, buckets = process_source(spec, temp_dir)
            all_sources.append(meta)

            sorted_keys = sorted(buckets.keys(), key=lambda k: (k[0], k[1], k[2]))
            for k in sorted_keys:
                col_code, prog_code, allotted_cat = k
                b = buckets[k]
                cid = f"D5-2026-C65-{candidate_counter:04d}"
                candidate_counter += 1

                extraction_status = "COMPLETE_BUCKET_EXTRACTED"
                page_str = format_page_range(b["pages"])
                locator = f"Document '{spec['title']}', {page_str}"

                rec = {
                    "research_candidate_id": cid,
                    "method_version": "D5-PROVISIONAL-ALLOTMENT-MIN-V2",
                    "source_url": spec["url"],
                    "source_sha256": meta["sha256"],
                    "source_title_literal": spec["title"],
                    "source_year_literal": spec["year"],
                    "source_route_literal": spec["route"],
                    "source_stage_literal": "PROVISIONAL ALLOTMENT",
                    "source_round_literal": spec["round"],
                    "source_college_code_literal": col_code,
                    "source_programme_code_literal": prog_code,
                    "source_allotted_category_literal": allotted_cat,
                    "source_mark_heading_literal": "AGGREGATE MARK",
                    "derived_metric_type": "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
                    "derived_minimum_mark": round(b["min_mark"], 3),
                    "allotment_count_in_bucket": b["count"],
                    "official_closing_value": None,
                    "official_closing_value_status": "NOT_ESTABLISHED_BY_D5",
                    "observation_basis": "DERIVED",
                    "publication_status": "PROVISIONAL",
                    "source_scope_status": "OFFICIAL_PROVISIONAL_PUBLICATION",
                    "extraction_status": extraction_status,
                    "category_semantics_status": "ALLOTTED_COMMUNITY_QUOTA_LITERAL",
                    "nonpersonal_source_locator": locator,
                    "research_status": "CANDIDATE"
                }
                candidates.append(rec)

        out_dir = os.path.abspath("experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions")
        os.makedirs(out_dir, exist_ok=True)

        cand_file = os.path.join(out_dir, "candidates.json")
        with open(cand_file, "w", encoding="utf-8") as f:
            json.dump(candidates, f, indent=2)

        src_file = os.path.join(out_dir, "sources.json")
        with open(src_file, "w", encoding="utf-8") as f:
            json.dump(all_sources, f, indent=2)

        print("\n==========================================")
        print(f"Extraction successful!")
        print(f"Total verified buckets extracted: {len(candidates)}")
        print(f"Saved candidates to {cand_file}")
        print(f"Saved sources to {src_file}")

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
            print(f"Scrubbed temporary process directory: {temp_dir}")

if __name__ == "__main__":
    main()
