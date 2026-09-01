import { assertAdmissionSeatFact } from "../domain/admission-seat-fact.ts";
import type { AdmissionSeatFact } from "../domain/models.ts";
import { requireNonEmptyString } from "../domain/validation.ts";
import {
  ConflictingFactError,
  DuplicateFactError,
  DuplicateSnapshotError,
  IngestionValidationError,
} from "./errors.ts";
import type { PilotDataRegistry } from "./pilot-data.ts";

export interface AdmissionSeatFactSnapshot {
  readonly snapshot_id: string;
  readonly stage: string | null;
  readonly facts: readonly AdmissionSeatFact[];
}

function factIdentity(fact: AdmissionSeatFact): string {
  return [
    fact.admission_year,
    fact.tnea_college_code,
    fact.branch_id,
    fact.fact_type,
    fact.round ?? "",
    fact.reservation_category ?? "",
    fact.quota ?? "",
  ].join("|");
}

function factValue(fact: AdmissionSeatFact): string {
  return JSON.stringify({
    seat_count: fact.seat_count,
    source_id: fact.source_id,
    source_page: fact.source_page,
  });
}

function copySnapshot(
  snapshot: AdmissionSeatFactSnapshot,
): AdmissionSeatFactSnapshot {
  return {
    snapshot_id: snapshot.snapshot_id,
    stage: snapshot.stage,
    facts: snapshot.facts.map((fact) => ({ ...fact })),
  };
}

export class AdmissionSeatFactSnapshotStore {
  readonly #registry: PilotDataRegistry;
  readonly #snapshots = new Map<string, AdmissionSeatFactSnapshot>();

  constructor(registry: PilotDataRegistry) {
    this.#registry = registry;
  }

  append(snapshot: AdmissionSeatFactSnapshot): void {
    requireNonEmptyString(snapshot.snapshot_id, "snapshot_id");
    if (snapshot.stage !== null) {
      requireNonEmptyString(snapshot.stage, "stage");
    }
    if (this.#snapshots.has(snapshot.snapshot_id)) {
      throw new DuplicateSnapshotError(snapshot.snapshot_id);
    }

    const factsByIdentity = new Map<string, AdmissionSeatFact>();
    for (const fact of snapshot.facts) {
      assertAdmissionSeatFact(fact);
      this.#registry.validateProvenance(fact);
      if (!this.#registry.hasCollege(fact.tnea_college_code)) {
        throw new IngestionValidationError(
          `unknown tnea_college_code: ${fact.tnea_college_code}`,
        );
      }
      if (!this.#registry.hasProgramme(fact.tnea_college_code, fact.branch_id)) {
        throw new IngestionValidationError(
          `unknown canonical programme: ${fact.tnea_college_code}|${fact.branch_id}`,
        );
      }

      const identity = factIdentity(fact);
      const existing = factsByIdentity.get(identity);
      if (existing !== undefined) {
        if (factValue(existing) === factValue(fact)) {
          throw new DuplicateFactError(
            `duplicate seat fact in snapshot ${snapshot.snapshot_id}: ${identity}`,
          );
        }
        throw new ConflictingFactError(
          `conflicting seat fact in snapshot ${snapshot.snapshot_id}: ${identity}`,
        );
      }
      factsByIdentity.set(identity, fact);
    }

    this.#snapshots.set(snapshot.snapshot_id, copySnapshot(snapshot));
  }

  snapshots(): readonly AdmissionSeatFactSnapshot[] {
    return [...this.#snapshots.values()].map(copySnapshot);
  }

  factsFor(
    tneaCollegeCode: string,
    branchId: string,
  ): readonly AdmissionSeatFact[] {
    return this.snapshots().flatMap(({ facts }) =>
      facts.filter(
        (fact) =>
          fact.tnea_college_code === tneaCollegeCode &&
          fact.branch_id === branchId,
      ),
    );
  }
}
