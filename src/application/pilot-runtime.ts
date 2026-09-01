import { AdmissionSeatFactSnapshotStore } from "../ingestion/snapshot-store.ts";
import { parsePilotCollegeCsv, parseProgrammeCsv, parseRegisteredSourceIds } from "../ingestion/csv.ts";
import { PilotDataRegistry } from "../ingestion/pilot-data.ts";

export const PILOT_DEMO_SNAPSHOT_ID = "PILOT_PROGRAMME_EVIDENCE_ONLY";
export const PILOT_DEMO_SNAPSHOT_STAGE = "PROGRAMME_EVIDENCE_ONLY";

const CANONICAL_BRANCH_IDS = ["CSE", "IT", "ECE", "EEE", "MECH"] as const;

export interface PilotRuntimeInput {
  readonly sources_csv: string;
  readonly colleges_csv: string;
  readonly programmes_csv: string;
}

export function createPilotRuntime(input: PilotRuntimeInput) {
  const registry = new PilotDataRegistry(
    parseRegisteredSourceIds(input.sources_csv),
    CANONICAL_BRANCH_IDS,
  );
  registry.ingestColleges(parsePilotCollegeCsv(input.colleges_csv));
  registry.ingestProgrammes(parseProgrammeCsv(input.programmes_csv));

  const snapshots = new AdmissionSeatFactSnapshotStore(registry);
  snapshots.append({
    snapshot_id: PILOT_DEMO_SNAPSHOT_ID,
    stage: PILOT_DEMO_SNAPSHOT_STAGE,
    facts: [],
  });

  return { registry, snapshots } as const;
}
