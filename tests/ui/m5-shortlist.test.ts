import test from "node:test";
import assert from "node:assert/strict";
import {
  addToShortlist,
  removeFromShortlist,
  moveUp,
  moveDown,
  moveToTop,
  moveToBottom,
  moveToPosition,
  clearShortlist,
  formatShortlistSummary,
  formatShortlistPlainText,
  formatShortlistCsv,
  EMPTY_SHORTLIST,
  getCounsellingGuidance,
} from "../../src/m5/index.ts";

test("M5 Shortlist Management: Add, duplicate prevention, and order numbering", () => {
  let list = EMPTY_SHORTLIST;

  list = addToShortlist(list, "1", "CEG Campus", "CS", "Computer Science");
  list = addToShortlist(list, "2006", "PSG College of Technology", "CS", "Computer Science");
  list = addToShortlist(list, "2712", "Kumaraguru College of Tech", "EC", "Electronics and Comm");

  assert.equal(list.items.length, 3);
  assert.equal(list.items[0].collegeCode, "1");
  assert.equal(list.items[0].order, 1);
  assert.equal(list.items[1].collegeCode, "2006");
  assert.equal(list.items[1].order, 2);
  assert.equal(list.items[2].collegeCode, "2712");
  assert.equal(list.items[2].order, 3);

  // Duplicate add should be no-op
  const duplicate = addToShortlist(list, "1", "CEG Campus", "CS", "Computer Science");
  assert.equal(duplicate.items.length, 3);
});

test("M5 Shortlist Manual Reordering: moveUp, moveDown, and boundary safety", () => {
  let list = EMPTY_SHORTLIST;
  list = addToShortlist(list, "1", "CEG", "CS", "CSE"); // order 1
  list = addToShortlist(list, "2006", "PSG", "CS", "CSE"); // order 2
  list = addToShortlist(list, "4960", "Mepco", "CS", "CSE"); // order 3

  // Move PSG up to top
  list = moveUp(list, "2006~CS");
  assert.equal(list.items[0].collegeCode, "2006");
  assert.equal(list.items[0].order, 1);
  assert.equal(list.items[1].collegeCode, "1");
  assert.equal(list.items[1].order, 2);

  // Move PSG up again (already at top -> no-op)
  const atTop = moveUp(list, "2006~CS");
  assert.equal(atTop.items[0].collegeCode, "2006");

  // Move PSG down
  list = moveDown(list, "2006~CS");
  assert.equal(list.items[0].collegeCode, "1");
  assert.equal(list.items[1].collegeCode, "2006");

  // Move Mepco down (already at bottom -> no-op)
  const atBottom = moveDown(list, "4960~CS");
  assert.equal(atBottom.items[2].collegeCode, "4960");
});

test("M5 Shortlist Removal & Summary Export: Re-indexes remaining items cleanly", () => {
  let list = EMPTY_SHORTLIST;
  list = addToShortlist(list, "1", "CEG", "CS", "CSE");
  list = addToShortlist(list, "2006", "PSG", "CS", "CSE");
  list = addToShortlist(list, "4960", "Mepco", "CS", "CSE");

  // Remove middle item (PSG)
  list = removeFromShortlist(list, "2006~CS");
  assert.equal(list.items.length, 2);
  assert.equal(list.items[0].collegeCode, "1");
  assert.equal(list.items[0].order, 1);
  assert.equal(list.items[1].collegeCode, "4960");
  assert.equal(list.items[1].order, 2);

  // Verify export format
  const summary = formatShortlistSummary(list);
  assert.ok(summary.includes("Choice Order"));
  assert.ok(summary.includes("1 | 1 | CS | CEG | CSE"));
  assert.ok(summary.includes("2 | 4960 | CS | Mepco | CSE"));

  // Clear shortlist
  list = clearShortlist();
  assert.equal(list.items.length, 0);
  assert.equal(formatShortlistSummary(list), "Shortlist is empty.");
});

test("M6-T02 Choice List Print & Export Formats: Plain text & CSV export contain zero student marks", () => {
  let list = EMPTY_SHORTLIST;
  list = addToShortlist(list, "2006", "PSG College of Technology", "EC", "Electronics and Communication Engineering");
  list = addToShortlist(list, "1", "College of Engineering Guindy (CEG)", "CS", "Computer Science and Engineering");

  // 1. Plain text export
  const plainText = formatShortlistPlainText(list);
  assert.ok(plainText.includes("Tamil Nadu Engineering Admissions (TNEA) — Student Choice Preference Worksheet"));
  assert.ok(plainText.includes("Choice #1: [College 2006] PSG College of Technology"));
  assert.ok(plainText.includes("Branch: [EC] Electronics and Communication Engineering"));
  assert.ok(plainText.includes("Choice #2: [College 1] College of Engineering Guindy (CEG)"));
  assert.ok(plainText.includes("Branch: [CS] Computer Science and Engineering"));

  // Verify zero private marks/community/rank in plain text
  assert.ok(!plainText.includes("cutoff"));
  assert.ok(!plainText.includes("community"));
  assert.ok(!plainText.includes("rank"));

  // 2. CSV export
  const csv = formatShortlistCsv(list);
  assert.ok(csv.startsWith("Choice,College Code,College Name,Branch Code,Branch Name"));
  assert.ok(csv.includes('1,"2006","PSG College of Technology","EC","Electronics and Communication Engineering"'));
  assert.ok(csv.includes('2,"1","College of Engineering Guindy (CEG)","CS","Computer Science and Engineering"'));

  // Verify zero private marks/community/rank in CSV
  assert.ok(!csv.includes("cutoff"));
  assert.ok(!csv.includes("community"));
  assert.ok(!csv.includes("rank"));

  // 3. Empty list handling
  assert.equal(formatShortlistPlainText(EMPTY_SHORTLIST), "Shortlist is empty.");
  assert.equal(formatShortlistCsv(EMPTY_SHORTLIST), "Choice,College Code,College Name,Branch Code,Branch Name");
});

test("M5 Privacy Invariant: Shortlist contains zero applicant marks or private identifiers", () => {
  let list = EMPTY_SHORTLIST;
  list = addToShortlist(list, "1", "CEG", "CS", "CSE");

  const item = list.items[0] as any;
  assert.equal(item.studentCutoff, undefined);
  assert.equal(item.community, undefined);
  assert.equal(item.rank, undefined);
  assert.equal(item.name, undefined); // No applicant name
});

test("M5 Bilingual Counselling Guidance: Factual educational clarity on TNEA mechanics", () => {
  const en = getCounsellingGuidance("en");
  const ta = getCounsellingGuidance("ta");

  assert.equal(en.sections.length, 5);
  assert.equal(ta.sections.length, 5);

  // English section checks
  assert.ok(en.sections[1].title.includes("Upward Movement"));
  assert.ok(en.sections[1].content.some((c) => c.includes("movement toward Choice #1")));
  assert.ok(en.sections[2].title.includes("Ordering Choices by Genuine Preference"));
  assert.ok(en.sections[3].content.some((c) => c.includes("Tamil Nadu Act No. 14 of 2021")));
  assert.ok(en.sections[3].content.some((c) => c.includes("G.O. (Ms.) No. 221")));
  assert.ok(en.sections[3].content.some((c) => c.includes("tuition, hostel, and development fees")));
  assert.ok(en.sections[3].content.some((c) => c.includes("proof of Government-school study details from 6th through 12th standard")));
  assert.ok(en.sections[3].content.some((c) => c.includes("schools managed by Government departments")));
  assert.ok(!JSON.stringify(en).includes("approved institutional fees"));
  assert.ok(!JSON.stringify(en).includes("3-Tier Strategy"));
  assert.ok(!JSON.stringify(en).includes("Safe Anchors"));
  assert.ok(!JSON.stringify(en).includes("automatically locks"));
  assert.ok(!JSON.stringify(en).includes("auto-lock"));

  // Tamil section checks
  assert.ok(ta.sections[1].title.includes("மேல்நோக்கிய நகர்வு"));
  assert.ok(ta.sections[1].content.some((c) => c.includes("விருப்பம் #1-ஐ நோக்கிய")));
  assert.ok(ta.sections[2].title.includes("விருப்பங்களை உண்மையான முன்னுரிமைப்படி"));
  assert.ok(ta.sections[3].content.some((c) => c.includes("தமிழ்நாடு சட்டம் 14/2021-ன் படி")));
  assert.ok(ta.sections[3].content.some((c) => c.includes("G.O. (Ms.) No. 221")));
  assert.ok(ta.sections[3].content.some((c) => c.includes("அரசுத் துறைகளால் நிர்வகிக்கப்படும் பள்ளிகள்")));
  assert.ok(ta.sections[3].content.some((c) => c.includes("அரசுப் பள்ளிப் பயில் விவரங்களுக்கான சான்றை")));
  assert.ok(ta.sections[3].content.some((c) => c.includes("கல்விக் கட்டணம், விடுதிக் கட்டணம் மற்றும் மேம்பாட்டுக் கட்டணம்")));
  assert.ok(!JSON.stringify(ta).includes("3 அடுக்கு உத்தி"));
  assert.ok(!JSON.stringify(ta).includes("தானாகவே"));
});

test("FINAL_PRE_M7: Long shortlist (12+ choices) supports manual moveToTop, moveToBottom, and moveToPosition without auto-ranking", () => {
  let list = EMPTY_SHORTLIST;
  for (let i = 1; i <= 14; i++) {
    list = addToShortlist(list, String(1000 + i), `College ${i}`, "CS", "Computer Science");
  }
  assert.equal(list.items.length, 14);
  assert.equal(list.items[13].id, "1014~CS");
  assert.equal(list.items[13].order, 14);

  // Move Choice #14 directly to Top (#1) in a single manual action
  list = moveToTop(list, "1014~CS");
  assert.equal(list.items[0].id, "1014~CS");
  assert.equal(list.items[0].order, 1);
  assert.equal(list.items[1].id, "1001~CS");
  assert.equal(list.items[1].order, 2);
  assert.equal(list.items[13].id, "1013~CS");
  assert.equal(list.items[13].order, 14);

  // Move Choice #1 (1014~CS) directly to explicit student-selected position #7
  list = moveToPosition(list, "1014~CS", 7);
  assert.equal(list.items[6].id, "1014~CS");
  assert.equal(list.items[6].order, 7);
  assert.equal(list.items[0].id, "1001~CS");
  assert.equal(list.items[0].order, 1);

  // Move Choice #2 (1002~CS) directly to Bottom (#14)
  list = moveToBottom(list, "1002~CS");
  assert.equal(list.items[13].id, "1002~CS");
  assert.equal(list.items[13].order, 14);
  assert.ok(list.items.every((item, idx) => item.order === idx + 1), "Orders 1..14 must remain contiguous");
});
