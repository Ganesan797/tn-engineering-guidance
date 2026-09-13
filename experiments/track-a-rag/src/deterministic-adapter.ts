import type { StudentProfile } from "../../../src/domain/models.ts";
import {
  evaluateEligibility,
  type EligibilityEvaluationRequest,
} from "../../../src/domain/rules.ts";

// Experiment-only adapter: delegates without reproducing or altering ELG rules.
export function invokeDeterministicEligibility(
  profile: StudentProfile,
  request: EligibilityEvaluationRequest,
) {
  return evaluateEligibility(profile, request);
}
