# TN Engineering Guidance

A deterministic, source-backed 2026 engineering-admission guidance MVP for a five-college Tamil Nadu pilot.

## Run locally

Prerequisite: Node.js 22.6 or newer and npm.

```powershell
npm install
npm test
npm run typecheck
npm run start:mvp
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Choose a reproducible demo scenario or edit the student form, set an explicit branch order if wanted, and submit it. The small local server loads the version-controlled CSV files, validates them through the existing ingestion layer, sends submissions through the Slice 7 JSON boundary and Slice 6 guidance service, and renders the Slice 8 UI.

## Pilot data boundary

The local MVP uses the persisted authoritative 2026 programme evidence in `data/`: CEG, MIT, GCT, PSG Tech, and CIT. It retains 79 source programmes, of which 18 have exact frozen canonical mappings and 61 remain deliberately unmapped and excluded from guidance. It does not create additional mappings.

No authoritative 2026 `AdmissionSeatFact` is currently persisted. The demo therefore loads an empty, explicitly named programme-evidence snapshot. Missing vacancy evidence is displayed as `UNKNOWN_OR_UNPUBLISHED`, never as zero seats or no vacancy. The local demo uses no synthetic seat evidence. Existing automated tests that exercise positive seat-fact behavior use records labelled as test fixtures, never as real TNEA facts.

## Reproducible scenarios

The local page links to ELIGIBLE, INELIGIBLE, NEEDS_REVIEW, and UNKNOWN_OR_UNPUBLISHED-vacancy inputs. They submit through the real API/application path; results are not hard-coded into the UI.

## Known MVP limitations

- Coverage is limited to the five pilot colleges, five canonical branches, and admission year 2026.
- Vacancy, sanctioned-intake, and quota-vacancy guidance remains unknown until separately sourced authoritative `AdmissionSeatFact` snapshots are published and ingested.
- There is no admission probability, ranking, historical prediction, AI/LLM recommendation, authentication, saved profile, database, or deployment configuration.
- The local server is development/demo tooling, not production infrastructure.
