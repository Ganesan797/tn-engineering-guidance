/** Educational wording approval is independent of synthetic listing/link approval.
 * No loader or real-data adapter. The default registry is deliberately empty.
 * Owner preview is an offline review artifact, never a query-string permission.
 */
export interface ReviewedBranchCopy {
  readonly id: string;
  readonly version: string;
  readonly disposition: "HOLD" | "FIX" | "APPROVED";
  readonly copy: { readonly ta: string; readonly en: string };
  readonly evidence: { readonly url: string; readonly locator: string; readonly scope: string };
  readonly approval: null | {
    readonly version: string;
    readonly approved_copy: { readonly ta: string; readonly en: string };
    readonly approved_evidence: { readonly url: string; readonly locator: string; readonly scope: string };
    readonly owner: string;
    readonly factual: string;
    readonly ta: string;
    readonly en: string;
    readonly reference: string;
  };
}
export const APPROVED_BRANCH_COPY: readonly ReviewedBranchCopy[] = [];
const present = (s: string) => s.trim().length > 0;
export function isReleasedBranchCopy(profile: ReviewedBranchCopy): boolean {
  const a = profile.approval;
  if (profile.disposition !== "APPROVED" || !a || a.version !== profile.version
    || a.approved_copy.ta !== profile.copy.ta || a.approved_copy.en !== profile.copy.en
    || !a.approved_evidence || a.approved_evidence.url !== profile.evidence.url || a.approved_evidence.locator !== profile.evidence.locator || a.approved_evidence.scope !== profile.evidence.scope
    || [profile.copy.ta, profile.copy.en].some(copy => copy.split("\n").length !== 3 || copy.split("\n").some(line => !present(line)))
    || ![profile.id, profile.version, profile.copy.ta, profile.copy.en, a.owner, a.factual, a.ta, a.en, a.reference,
      profile.evidence.locator, profile.evidence.scope].every(present)) return false;
  try { const url = new URL(profile.evidence.url); return url.protocol === "https:" && !url.username && !url.password && !url.hostname.endsWith(".test"); }
  catch { return false; }
}
export function selectBranchCopy(id: string, illustrative: { readonly ta: string; readonly en: string }, registry: readonly ReviewedBranchCopy[] = APPROVED_BRANCH_COPY) {
  const matches = registry.filter(p => p.id === id);
  const profile = matches.length === 1 && isReleasedBranchCopy(matches[0]) ? matches[0] : null;
  return profile ? { kind: "REVIEWED_EDUCATIONAL" as const, copy: profile.copy, evidence: profile.evidence }
    : { kind: "SYNTHETIC_ILLUSTRATION" as const, copy: illustrative, evidence: null };
}
