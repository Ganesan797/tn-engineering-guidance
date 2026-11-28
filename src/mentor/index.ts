import { resolveBoundedContext } from "./context-resolver.ts";
import { MockMentorProvider } from "./mock-provider.ts";
import {
  getAiIdentityDisclosure,
  getSourceProvenanceLabel,
  minimizeQuestionText,
  resolveMentorConfig,
} from "./policy.ts";
import { routeMentorRequest } from "./router.ts";
import { MAX_QUESTION_LENGTH, type MentorProvider, type MentorRequest, type MentorResponse } from "./types.ts";

export * from "./types.ts";
export * from "./policy.ts";
export * from "./context-resolver.ts";
export * from "./router.ts";
export * from "./mock-provider.ts";

export interface MentorOperationalEvent {
  readonly mentor_route: MentorResponse["route"];
  readonly mentor_status: MentorResponse["status"];
  readonly mentor_mode: "MOCK_ONLY";
}

export interface ExplainWithMentorOptions {
  readonly env?: Record<string, string | undefined>;
  readonly provider?: MentorProvider;
  readonly onEvent?: (event: MentorOperationalEvent) => void;
}

export function explainWithMentor(
  request: MentorRequest,
  options: ExplainWithMentorOptions = {}
): MentorResponse {
  const language = request.language === "en" ? "en" : "ta";
  const disclosure = getAiIdentityDisclosure(language);
  const provenance = getSourceProvenanceLabel(language);
  const config = resolveMentorConfig(options.env);

  if (config.configError) {
    const res: MentorResponse = {
      status: "blocked",
      mentorMode: "MOCK_ONLY",
      provider: "none",
      route: "BLOCKED_REQUEST",
      contextOutcome: "NO_CONTEXT",
      language,
      disclosure,
      provenance,
      reply:
        language === "ta"
          ? "தற்போது mock விளக்க முறை மட்டுமே அனுமதிக்கப்பட்டுள்ளது; வெளிப்புற AI வழங்குநர் முடக்கப்பட்டுள்ளது."
          : "Only mock explanation mode is authorized; external AI providers are disabled.",
      contextCount: 0,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  }

  if (!config.enabled) {
    const res: MentorResponse = {
      status: "disabled",
      mentorMode: "MOCK_ONLY",
      provider: "none",
      route: "INSUFFICIENT_EVIDENCE",
      contextOutcome: "NO_CONTEXT",
      language,
      disclosure,
      provenance,
      reply:
        language === "ta"
          ? "AI உதவி விளக்கம் தற்போது முடக்கப்பட்டுள்ளது (Offline mode). கீழே உள்ள அதிகாரப்பூர்வ கட்-ஆஃப் மற்றும் விருப்பப் பட்டியல் கருவிகளைப் பயன்படுத்தலாம்."
          : "AI-assisted explanation is currently disabled (offline mode). Please use the deterministic cutoff and choice planner tools.",
      contextCount: 0,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  }

  const rawQuestion = String(request.question ?? "");
  if (rawQuestion.length > MAX_QUESTION_LENGTH) {
    const res: MentorResponse = {
      status: "error",
      mentorMode: "MOCK_ONLY",
      provider: "none",
      route: "BLOCKED_REQUEST",
      contextOutcome: "NO_CONTEXT",
      language,
      disclosure,
      provenance,
      reply:
        language === "ta"
          ? `கேள்வி ${MAX_QUESTION_LENGTH} எழுத்துகளுக்குள் இருக்க வேண்டும்.`
          : `Question must be within ${MAX_QUESTION_LENGTH} characters.`,
      contextCount: 0,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  }

  const minimizedQuestion = minimizeQuestionText(rawQuestion);
  const context = resolveBoundedContext({ ...request, language });
  const routed = routeMentorRequest(request, minimizedQuestion, context);

  if (routed.route !== "AI_EXPLANATION_MOCK") {
    const isValidationError = routed.blockedReason === "CONTEXT_VALIDATION_ERROR";
    const status: MentorResponse["status"] = isValidationError
      ? "error"
      : routed.route === "BLOCKED_REQUEST"
      ? "blocked"
      : "ok";
    const res: MentorResponse = {
      status,
      mentorMode: "MOCK_ONLY",
      provider: "none",
      route: routed.route,
      contextOutcome: context.context_outcome,
      language,
      disclosure,
      provenance,
      reply: routed.canonicalAnswer ?? "",
      contextCount: context.selected_evidence.length,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  }

  const provider = options.provider ?? new MockMentorProvider();
  try {
    const reply = provider.explain(context, minimizedQuestion);
    const res: MentorResponse = {
      status: "ok",
      mentorMode: "MOCK_ONLY",
      provider: provider.name,
      route: "AI_EXPLANATION_MOCK",
      contextOutcome: context.context_outcome,
      language,
      disclosure,
      provenance,
      reply,
      contextCount: context.selected_evidence.length,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  } catch {
    const res: MentorResponse = {
      status: "error",
      mentorMode: "MOCK_ONLY",
      provider: "none",
      route: "INSUFFICIENT_EVIDENCE",
      contextOutcome: context.context_outcome,
      language,
      disclosure,
      provenance,
      reply:
        language === "ta"
          ? "தற்போது விளக்கம் உருவாக்க முடியவில்லை. கீழே உள்ள அதிகாரப்பூர்வத் தரவைப் பார்க்கவும்."
          : "Explanation is temporarily unavailable. Please refer to the governed data directly.",
      contextCount: context.selected_evidence.length,
    };
    options.onEvent?.({ mentor_route: res.route, mentor_status: res.status, mentor_mode: "MOCK_ONLY" });
    return res;
  }
}
