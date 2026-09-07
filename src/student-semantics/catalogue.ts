import type {
  StudentLanguage,
  StudentSemanticKey,
  StudentSemanticMessage,
} from "./models.ts";

type MessageTemplate = (parameters: Readonly<Record<string, string | number>>) => string;

export class MissingStudentPresentationError extends Error {
  constructor(language: string, key: string) {
    super(`student presentation is unavailable for ${language}:${key}`);
    this.name = "MissingStudentPresentationError";
  }
}

const ENGLISH_CATALOGUE: Readonly<Record<StudentSemanticKey, MessageTemplate>> = {
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
};

export function resolveStudentMessage(
  message: StudentSemanticMessage,
  language: StudentLanguage,
): string {
  const template = PRESENTATIONS[language]?.[message.key];
  if (template === undefined) {
    throw new MissingStudentPresentationError(language, message.key);
  }
  return template(message.parameters ?? {});
}
