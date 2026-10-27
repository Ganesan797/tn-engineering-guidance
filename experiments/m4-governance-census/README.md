# M4 census and bounded governance pilot — research evidence

Status: RESEARCH ONLY. No production ingestion, approved mapping/profile, student publication, threshold approval or M4/M5 implementation. The approved planning contract and M4's comprehensive branch-coverage completion goal remain in force.

`research-report.md` is the preserved statewide feasibility report. `pilot-review.md` contains the seven-college, twelve-pair governance pilot and owner queue. CSV/JSON files are research extracts, not governed production data; original source text, page references, code distinctions, holds and conflicts remain. `original-manifest.csv` records hashes of the previous temporary artifacts. The three Python scripts are now portable: their hashes differ from that historical manifest only because hard-coded paths were replaced by the environment variables below. `booklet-fields.csv` retains selected extracted fields from 21 sample pages; the original full-text sample is deliberately excluded because it includes unrelated bank/contact details. The official PDFs and rendered page images are also excluded from Git; their original hashes and source metadata are in the historical manifest and report. No source PDF is committed; the repository had no tracked PDFs.

## Reproduce

1. Use the official source URLs in `research-report.md`, retrieve the two 2026 PDFs separately, and verify their SHA-256 hashes against `original-manifest.csv`. Place them outside the repository as `seat-matrix-2026.pdf` and `college-booklet-2026.pdf`. If a source changes, stop and record a new source version; do not treat results as equivalent.
2. Use Python with `pdfplumber` and `pypdf`. Set `M4_CENSUS_SOURCE_DIR` to the PDF folder and `M4_CENSUS_WORK_DIR` to a new writable temporary directory. Optionally set `M4_CENSUS_REPO` to the checkout root; otherwise the scripts use the repository containing this README. Run:

   ```text
   python experiments/m4-governance-census/census.py --extract
   python experiments/m4-governance-census/booklet_sample.py
   python experiments/m4-governance-census/cohort_analysis.py
   python experiments/m4-governance-census/pilot_selection.py
   ```

3. Compare output hashes with `original-manifest.csv`; the scripts also support copying `raw-tables.json` to the temporary work directory and running `census.py` without `--extract` to reproduce counts without extracting again. The booklet script writes full source-page text to the temporary work directory: do not commit that file. Compare `booklet-fields.csv` to its selected fields, not as a byte-identical copy. `pilot-programme-pairs.csv` is a bounded selection from `pairs.csv` and the existing crosswalk, and is not an approval.

Use `artifact-manifest.csv` for checksums of files actually preserved here. The folder's `.gitattributes` preserves their exact bytes across checkouts so checksums remain meaningful. PDFs, rendered images, the unredacted booklet sample, production data and unrelated files are excluded. Source-page references are one-based. The material is a snapshot and needs fresh review before any student use.
