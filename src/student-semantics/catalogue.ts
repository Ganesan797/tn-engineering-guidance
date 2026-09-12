import type {
  StudentLanguage,
  StudentSemanticKey,
  StudentSemanticMessage,
} from "./models.ts";
import { ENTRY_ENGLISH, ENTRY_TAMIL, type EntrySemanticKey } from "./entry-catalogue.ts";

type MessageTemplate = (parameters: Readonly<Record<string, string | number>>) => string;

export class MissingStudentPresentationError extends Error {
  constructor(language: string, key: string) {
    super(`student presentation is unavailable for ${language}:${key}`);
    this.name = "MissingStudentPresentationError";
  }
}

const ENGLISH_CATALOGUE: Readonly<Partial<Record<StudentSemanticKey, MessageTemplate>>> = {
  "guidance.eligibility.eligible": () =>
    "Based on the information provided, you meet the checked TNEA eligibility conditions.",
  "guidance.eligibility.ineligible": () =>
    "Based on the information provided, you do not meet one or more checked TNEA eligibility conditions.",
  "guidance.eligibility.needs_review": () =>
    "We need a little more information to confirm your eligibility.",
  "guidance.cutoff.value": ({ cutoff }) => `Your TNEA cutoff: ${cutoff} / 200`,
  "content.awareness.engineering_choices.title": () => "Understand your options first",
  "content.awareness.engineering_choices.body": () =>
    "Engineering includes different branches and fields. You can understand the options before choosing a college.",
};

const PRESENTATIONS: Partial<
  Record<StudentLanguage, Partial<Record<StudentSemanticKey, MessageTemplate>>>
> = {
  en: ENGLISH_CATALOGUE,
  ta: {
    // Translation proof of the accepted M0 awareness item; pending human review.
    "content.awareness.engineering_choices.title": () => "முதலில் உங்கள் வாய்ப்புகளைப் புரிந்துகொள்ளலாம்",
    "content.awareness.engineering_choices.body": () =>
      "பொறியியலில் வெவ்வேறு பாடப்பிரிவுகள் உள்ளன. கல்லூரியைத் தேர்ந்தெடுக்கும் முன், என்னென்ன வாய்ப்புகள் உள்ளன என்பதைப் புரிந்துகொள்ளலாம்.",
  },
};

export function resolveStudentMessage(
  message: StudentSemanticMessage,
  language: StudentLanguage,
): string {
  const entryCatalogue = language === "ta" ? ENTRY_TAMIL : ENTRY_ENGLISH;
  if (Object.hasOwn(entryCatalogue, message.key)) {
    return entryCatalogue[message.key as EntrySemanticKey];
  }
  const template = PRESENTATIONS[language]?.[message.key];
  if (template === undefined) {
    throw new MissingStudentPresentationError(language, message.key);
  }
  return template(message.parameters ?? {});
}
