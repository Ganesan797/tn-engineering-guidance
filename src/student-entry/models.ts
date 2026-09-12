import type { StudentLanguage } from "../student-semantics/models.ts";

export const ENTRY_ROUTES = ["home", "beginner", "personal", "counselling"] as const;
export type EntryRoute = (typeof ENTRY_ROUTES)[number];
export type EntryIntent = Exclude<EntryRoute, "home"> | null;

// Intentionally contains no student profile, marks, or admission request.
export interface StudentEntryState {
  readonly route: EntryRoute;
  readonly language: StudentLanguage;
}
