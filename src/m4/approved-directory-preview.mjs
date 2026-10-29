import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// These bytes are the owner-approved review artifact and its immutable inputs.
const expected = Object.freeze({
  "batch-supported.csv": "114cfb51bd6463282efcfab3a821847953c9dc7445d10a9507a438378d5412ff",
  "batch-exceptions.csv": "a848606d097f4b720e0910d4c36ca585d3824ec424cb4db8a67b73a6e4d9a150",
  "college-candidates.csv": "1bdf9eeb96e0bfca3149ce95ddcc1c8f83df53fcf32af909a477196f9c5219b9",
  "offering-candidates.csv": "0430a7f2fef2be286d502d85fac6f19ade4398f7c9d149cb2a5c69ccf7b3b01d",
  "field-provenance.csv": "86bcb43bb1ecb0e7cffbe1365412373a08fd487f5692dff39214f083bfbc5336",
  "exceptions.csv": "7091e2a8a6c4f259e007167e1c3a195d18a77f99385e0961badb72a400f8a801",
});
const root = new URL("../../experiments/m4-governance-census/directory-candidates-2026/", import.meta.url);
const stage = "BEFORE_SPECIAL_RESERVATION_COUNSELLING";
const matrixUrl = "https://static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf";
const heldIdentity = new Set(["1133", "1301", "1424", "2345", "2776", "3815"]);
const heldScope = new Set(["AE", "AO", "BP", "DA", "CQ", "IF", "ID", "CJ"]);
// The seven exact, earlier approved identity snapshots support only their
// separately approved attributes; no code-only join authorizes enrichment.
const identitySnapshots = new Map([
  ["1", "University Departments of Anna University, Chennai - CEG Campus"],
  ["4", "University Departments of Anna University, Chennai - MIT Campus"],
  ["1303", "Anand Institute of Higher Technology (Autonomous)"],
  ["1304", "Easwari Engineering College (Autonomous)"],
  ["2603", "Government College of Engineering (Autonomous), Bargur"],
  ["3018", "University College of Engineering, Thirukkuvalai"],
  ["4967", "S Veerasamy Chettiar College of Engineering and Technology"],
]);
const typeMap = new Map([["GOVERNMENT COLLEGES", "GOVERNMENT"], ["GOVERNMENT AIDED COLLEGES", "AIDED"], ["SELF FINANCING ENGINEERING COLLEGES", "PRIVATE"], ["UNIVERSITY DEPARTMENTS", "UNIVERSITY"], ["CONSTITUENT COLLEGES", "UNIVERSITY"]]);

// CSV records can contain embedded newlines and escaped quotation marks.
function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (quoted || row.length || cell) throw new Error("Invalid directory CSV termination");
  const headers = rows.shift();
  if (!headers || new Set(headers).size !== headers.length) throw new Error("Invalid directory CSV headers");
  return rows.map(values => {
    if (values.length !== headers.length) throw new Error("Invalid directory CSV row");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

/** Load only the exact approved bytes. A failed check closes the owner preview. */
export function loadApprovedDirectory(read = name => readFileSync(new URL(name, root))) {
  const data = {};
  for (const [name, hash] of Object.entries(expected)) {
    const bytes = read(name);
    if (createHash("sha256").update(bytes).digest("hex") !== hash) throw new Error(`Directory approval hash mismatch: ${name}`);
    data[name] = parseCsv(bytes.toString("utf8"));
  }
  const manifest = data["batch-supported.csv"], exceptions = data["batch-exceptions.csv"];
  const allowed = new Set(manifest.map(r => r.record_id));
  const held = new Set(exceptions.map(r => r.record_id));
  if (allowed.size !== 8622 || manifest.length !== 8622 || held.size !== 191 || exceptions.length !== 191 || [...allowed].some(x => held.has(x))) throw new Error("Invalid directory approval sets");
  const fields = new Map();
  for (const f of data["field-provenance.csv"]) {
    const key = `F|${f.college_code}|${f.field}`;
    if (fields.has(key)) throw new Error("Duplicate directory field");
    fields.set(key, f);
  }
  const districtHolds = new Set(exceptions.filter(x => x.kind === "DISTRICT_HEADER" || x.field_or_programme === "district" && x.kind === "FIELD" && x.source_field_status === "CONFLICTING").map(x => x.college_code));
  const colleges = new Map();
  for (const c of data["college-candidates.csv"]) {
    if (colleges.has(c.college_code)) throw new Error("Duplicate college code");
    colleges.set(c.college_code, c);
  }
  const getField = (code, field) => {
    const key = `F|${code}|${field}`, f = fields.get(key);
    return allowed.has(key) && !held.has(key) && f?.status === "OFFICIAL_SUPPORTED" ? f.value : null;
  };
  const items = [], seen = new Set(); let excluded = 0;
  for (const o of data["offering-candidates.csv"]) {
    const key = `${o.college_code}~${o.programme_code}`;
    if (seen.has(key)) throw new Error("Duplicate offering code");
    seen.add(key);
    const id = `O|${o.college_code}|${o.programme_code}|${o.source_year}|${o.stream}|${o.stage}`;
    const college = colleges.get(o.college_code), name = getField(o.college_code, "matrix_college_name_and_address_printed");
    const safeIdentity = identitySnapshots.get(o.college_code);
    if (!allowed.has(id) || held.has(id) || heldIdentity.has(o.college_code) || heldScope.has(o.programme_code) || !college || !name || (!safeIdentity && districtHolds.has(o.college_code)) || o.source_year !== "2026" || o.stream !== "GENERAL_ACADEMIC" || o.stage !== stage || o.source_url !== matrixUrl || !/^[1-9]\d*$/.test(o.pdf_page) || !/^[1-9]\d*$/.test(o.printed_page)) { excluded++; continue; }
    const district = safeIdentity && !districtHolds.has(o.college_code) ? getField(o.college_code, "district") : null;
    const type = safeIdentity ? typeMap.get(getField(o.college_code, "institution_type")) ?? null : null;
    const fieldEvidence = [];
    for (const [field, value] of [["district",district],["institution_type",type]]) {
      if (value) { const f=fields.get(`F|${o.college_code}|${field}`); fieldEvidence.push({field,url:f.source_url,year:f.source_year,printedPage:f.printed_page,pdfPage:f.pdf_page}); }
    }
    items.push({key, college:o.college_code, collegeName:safeIdentity ?? name, programme:o.programme_code, programmeName:o.programme_name_printed,
      district, type, fieldEvidence, source:{document:"TNEA 2026 General Academic seat matrix before special reservation counselling",url:matrixUrl,year:2026,stream:o.stream,stage:o.stage,printed_page:Number(o.printed_page),pdf_page:Number(o.pdf_page),location_status:"RECORDED"}, profileId:null, profile:null});
  }
  return {classification:"GOVERNED_OWNER_REVIEW",coverage:"BOUNDED_PARTIAL",items,excluded};
}
