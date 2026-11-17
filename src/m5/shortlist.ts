import type { ShortlistItem, ShortlistState } from "./types.ts";

/**
 * Pure, privacy-preserving shortlist engine for Milestone M5 (Tasks T08 & T09).
 *
 * Invariants:
 * 1. Zero login: operates entirely client-side.
 * 2. Marks-free: shortlist items NEVER store student cutoff, community, or application details.
 * 3. Manual reordering: user has total control over choice order (move up, move down, remove).
 * 4. Zero recommendation bias: does NOT automatically sort by "probability" or "dream/safe".
 */

export const EMPTY_SHORTLIST: ShortlistState = {
  items: [],
};

export function createShortlistItem(
  collegeCode: string,
  collegeName: string,
  programmeCode: string,
  programmeName: string,
  order: number
): ShortlistItem {
  return {
    id: `${collegeCode}~${programmeCode}`,
    collegeCode,
    collegeName,
    programmeCode,
    programmeName,
    order,
    addedAt: new Date().toISOString(),
  };
}

export function addToShortlist(
  state: ShortlistState,
  collegeCode: string,
  collegeName: string,
  programmeCode: string,
  programmeName: string
): ShortlistState {
  const id = `${collegeCode}~${programmeCode}`;
  if (state.items.some((item) => item.id === id)) {
    return state; // Duplicate, no-op
  }

  const nextOrder = state.items.length + 1;
  const newItem = createShortlistItem(
    collegeCode,
    collegeName,
    programmeCode,
    programmeName,
    nextOrder
  );

  return {
    items: [...state.items, newItem],
  };
}

export function removeFromShortlist(state: ShortlistState, itemId: string): ShortlistState {
  const filtered = state.items.filter((item) => item.id !== itemId);
  // Re-index order 1..N
  const reindexed = filtered.map((item, idx) => ({
    ...item,
    order: idx + 1,
  }));

  return {
    items: reindexed,
  };
}

export function moveUp(state: ShortlistState, itemId: string): ShortlistState {
  const idx = state.items.findIndex((item) => item.id === itemId);
  if (idx <= 0) return state; // Already at top or not found

  const items = [...state.items];
  const temp = items[idx - 1];
  items[idx - 1] = items[idx];
  items[idx] = temp;

  // Re-index orders
  return {
    items: items.map((item, i) => ({ ...item, order: i + 1 })),
  };
}

export function moveDown(state: ShortlistState, itemId: string): ShortlistState {
  const idx = state.items.findIndex((item) => item.id === itemId);
  if (idx < 0 || idx >= state.items.length - 1) return state; // Already at bottom or not found

  const items = [...state.items];
  const temp = items[idx + 1];
  items[idx + 1] = items[idx];
  items[idx] = temp;

  // Re-index orders
  return {
    items: items.map((item, i) => ({ ...item, order: i + 1 })),
  };
}

export function clearShortlist(): ShortlistState {
  return EMPTY_SHORTLIST;
}

/**
 * Format shortlist for export / choice-filling reference (e.g. text/CSV).
 * Strictly contains only College Code, College Name, Branch Code, Branch Name, Choice Order.
 */
export function formatShortlistSummary(state: ShortlistState): string {
  if (state.items.length === 0) return "Shortlist is empty.";

  const header = "Choice Order | College Code | Branch Code | College Name | Programme Name";
  const divider = "---|---|---|---|---";
  const rows = state.items.map(
    (item) =>
      `${item.order} | ${item.collegeCode} | ${item.programmeCode} | ${item.collegeName} | ${item.programmeName}`
  );

  return [header, divider, ...rows].join("\n");
}

/**
 * Format shortlist as ink-friendly plain text for official TNEA portal reference.
 * Zero private student marks, ranks, or community categories.
 */
export function formatShortlistPlainText(state: ShortlistState): string {
  if (state.items.length === 0) return "Shortlist is empty.";

  const lines: string[] = [
    "Tamil Nadu Engineering Admissions (TNEA) — Student Choice Preference Worksheet",
    "================================================================================",
    "",
  ];
  for (const item of state.items) {
    lines.push(`Choice #${item.order}: [College ${item.collegeCode}] ${item.collegeName}`);
    lines.push(`           Branch: [${item.programmeCode}] ${item.programmeName}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

/**
 * Format shortlist as CSV for spreadsheet import or TNEA bulk copy.
 * Zero private student marks, ranks, or community categories.
 */
export function formatShortlistCsv(state: ShortlistState): string {
  if (state.items.length === 0) return "Choice,College Code,College Name,Branch Code,Branch Name";

  const header = "Choice,College Code,College Name,Branch Code,Branch Name";
  const rows = state.items.map((item) => {
    const safeCol = item.collegeName.replace(/"/g, '""');
    const safeProg = item.programmeName.replace(/"/g, '""');
    return `${item.order},"${item.collegeCode}","${safeCol}","${item.programmeCode}","${safeProg}"`;
  });
  return [header, ...rows].join("\n");
}
