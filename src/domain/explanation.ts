import type { StudentProfile } from "./models.ts";

export interface CutoffOperand {
  readonly subject: "maths" | "physics" | "chemistry";
  readonly value: number | null;
  readonly input_field: keyof StudentProfile | null;
}
export interface CompleteCutoffOperand extends CutoffOperand {
  readonly value: number;
}
export type CutoffTrace =
  | { readonly status: "NOT_REQUESTED"; readonly calculation_id: null; readonly operands: readonly []; readonly result: null }
  | { readonly status: "UNAVAILABLE"; readonly calculation_id: "TNEA_ACADEMIC_CUTOFF"; readonly operands: readonly CutoffOperand[]; readonly result: null }
  | { readonly status: "AVAILABLE"; readonly calculation_id: "TNEA_ACADEMIC_CUTOFF"; readonly operands: readonly [CompleteCutoffOperand, CompleteCutoffOperand, CompleteCutoffOperand]; readonly result: number };

/** Internal explanatory information, produced alongside (never inferred from) a result. */
export interface ExplanationSidecarV1 {
  readonly version: 1;
  readonly check_blockers: readonly {
    readonly check_index: number;
    readonly rule_id: string;
    readonly blocking_fields: readonly string[];
  }[];
  readonly aggregate_blockers: readonly { readonly field: string; readonly origin: "AGGREGATION" }[];
  readonly cutoff_trace: CutoffTrace;
}

export interface ExplainedEvaluation<T> {
  readonly result: T;
  readonly explanation: ExplanationSidecarV1;
}
