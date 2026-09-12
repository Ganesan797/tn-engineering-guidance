import type { StudentLanguage } from "../student-semantics/models.ts";
import type { EntryIntent, EntryRoute, StudentEntryState } from "./models.ts";

const PATHS: Readonly<Record<EntryRoute, string>> = {
  home: "/", beginner: "/beginner", personal: "/personal", counselling: "/counselling",
};

export function routeForIntent(intent: EntryIntent): EntryRoute {
  return intent ?? "beginner";
}

export function entryHref(route: EntryRoute, language: StudentLanguage): string {
  return `${PATHS[route]}?lang=${language}`;
}

export function entryStateFromUrl(url: URL): StudentEntryState | null {
  const route = (Object.keys(PATHS) as EntryRoute[]).find((key) => PATHS[key] === url.pathname);
  if (route === undefined) return null;
  return { route, language: url.searchParams.get("lang") === "en" ? "en" : "ta" };
}

export function switchEntryLanguage(state: StudentEntryState, language: StudentLanguage): StudentEntryState {
  return { route: state.route, language };
}
