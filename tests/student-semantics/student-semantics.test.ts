import assert from "node:assert/strict";
import test from "node:test";

import type { GuidanceResult } from "../../src/application/guidance.ts";
import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import {
  ENGINEERING_CHOICES_AWARENESS,
  MissingStudentPresentationError,
  getInformationalContent,
  isVerifiedPersonalResult,
  resolveStudentMessage,
  toStudentGuidanceSemanticView,
  type StudentSemanticMessage,
} from "../../src/student-semantics/index.ts";

function result(
  outcome: GuidanceResult["eligibility"]["outcome"],
  cutoff: number | null,
): GuidanceResult {
  return {
    eligibility: {
      outcome,
      cutoff,
      blocking_missing_fields:
        outcome === "NEEDS_REVIEW" ? ["maths_mark"] : [],
      matched_rule_ids: ["ELG009"],
      checks: [
        {
          rule_id: "ELG009",
          outcome,
          reason_code: "INTERNAL_TEST_REASON",
          explanation: "Trusted explanation remains available.",
          source_id: "SRC002",
          source_page: 16,
          source_year: ADMISSION_YEAR,
        },
      ],
    },
    selected_snapshot_id: "TEST_SNAPSHOT",
    selected_snapshot_stage: null,
    ordered_choices: [],
    provenance: [{ source_id: "SRC002", source_page: 16 }],
  };
}

test("ELIGIBLE maps to a student-safe semantic key and English presentation", () => {
  const view = toStudentGuidanceSemanticView(result("ELIGIBLE", 165));
  assert.equal(view.verified_result.primary_message.key, "guidance.eligibility.eligible");
  assert.equal(
    resolveStudentMessage(view.verified_result.primary_message, "en"),
    "Based on the information provided, you meet the checked TNEA eligibility conditions.",
  );
});

test("NEEDS_REVIEW maps to student meaning while preserving trusted details", () => {
  const trusted = result("NEEDS_REVIEW", null);
  const view = toStudentGuidanceSemanticView(trusted);
  assert.equal(
    resolveStudentMessage(view.verified_result.primary_message, "en"),
    "We need a little more information to confirm your eligibility.",
  );
  assert.equal(view.verified_result.internal_outcome, "NEEDS_REVIEW");
  assert.deepEqual(view.verified_result.blocking_missing_fields, ["maths_mark"]);
  assert.equal(view.verified_result.explanations[0].rule_id, "ELG009");
  assert.deepEqual(view.verified_result.student_checks[0], {
    title: "TNEA cutoff calculation",
    result_text: "More information needed",
    explanation: "Trusted explanation remains available.",
    rule_reference: "ELG009",
    source_id: "SRC002",
    source_page: 16,
  });
  assert.deepEqual(view.verified_result.evidence, trusted.provenance);
  assert.deepEqual(view.trusted_result, trusted);
});

test("cutoff passes through unchanged and is never manufactured from null", () => {
  const cutoff = 173.25;
  const withCutoff = toStudentGuidanceSemanticView(result("ELIGIBLE", cutoff));
  assert.equal(withCutoff.verified_result.cutoff_value, cutoff);
  assert.deepEqual(withCutoff.verified_result.cutoff_message?.parameters, { cutoff });
  assert.equal(
    resolveStudentMessage(withCutoff.verified_result.cutoff_message!, "en"),
    "Your TNEA cutoff: 173.25 / 200",
  );
  const unknown = toStudentGuidanceSemanticView(result("NEEDS_REVIEW", null));
  assert.equal(unknown.verified_result.cutoff_value, null);
  assert.equal(unknown.verified_result.cutoff_message, null);
});

test("structured awareness content resolves and remains informational", () => {
  const content = getInformationalContent("awareness.engineering_choices");
  assert.equal(content, ENGINEERING_CHOICES_AWARENESS);
  assert.equal(content.output_class, "INFORMATION");
  assert.equal(content.governance_status, "M0_REVIEW_PROOF_NOT_PILOT_READY");
  assert.match(resolveStudentMessage(content.body, "en"), /different branches and fields/);
  assert.equal(isVerifiedPersonalResult(content), false);
});

test("verified results originate only from the trusted guidance mapper", () => {
  const view = toStudentGuidanceSemanticView(result("ELIGIBLE", 165));
  assert.equal(isVerifiedPersonalResult(view.verified_result), true);
  assert.equal(view.verified_result.origin, "DETERMINISTIC_GUIDANCE_RESULT");
  assert.equal(view.trusted_result.eligibility.cutoff, 165);
});

test("language presentation is separate and missing language fails safely", () => {
  const message = toStudentGuidanceSemanticView(
    result("ELIGIBLE", null),
  ).verified_result.primary_message;
  assert.doesNotThrow(() => resolveStudentMessage(message, "en"));
  assert.throws(
    () => resolveStudentMessage(message, "ta"),
    MissingStudentPresentationError,
  );
});

test("missing semantic and content keys fail safely", () => {
  assert.throws(
    () =>
      resolveStudentMessage(
        { key: "guidance.missing" } as unknown as StudentSemanticMessage,
        "en",
      ),
    MissingStudentPresentationError,
  );
  assert.throws(() => getInformationalContent("awareness.missing"));
});
