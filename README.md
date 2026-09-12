# TN Engineering Guidance

A deterministic, source-backed 2026 engineering-admission guidance MVP for a five-college Tamil Nadu pilot.

## Current Project Phase

Product V1 M0 is accepted. M1-A routing has passed human routing review; M1-B Awareness Content Pack V1 is frozen at `8ab1f3e`. M1-C integrates its ten bilingual modules into five short awareness sections for human review. M1 is not yet accepted, and M2 remains unauthorized. The implementation plan remains frozen.

See [Golden Product Mission](docs/product_mission.md), [Student Journey V1](docs/student_journey_v1.md), [Student Input & Output V1](docs/student_input_output_v1.md), [Technical Gap Mapping V1](docs/technical_gap_mapping_v1.md), [Implementation Plan V1](docs/implementation_plan_v1.md), and [Project Status](PROJECT_STATUS.md).

## Run locally

Prerequisite: Node.js 22.6 or newer and npm.

```powershell
npm install
npm test
npm run typecheck
npm run start:mvp
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The default page offers a small awareness introduction and three entry choices, without asking for marks. Tamil is the default entry language; the visible language links switch to English or Tamil while keeping the same route.

The small local server loads the version-controlled CSV files through the existing ingestion layer. Opening entry/awareness pages does not evaluate eligibility. Only an explicit detailed-form submission reaches the existing Slice 7 JSON boundary, Slice 6 guidance service, and accepted M0 result presentation.

## M1 browser review

| Path | Review purpose |
| --- | --- |
| `/` or `/?lang=ta` | Tamil default entry with interactive intent cards |
| `/?lang=en` | English entry |
| `/beginner?lang=ta` | Tamil awareness journey without personal information |
| `/beginner?lang=en` | Same awareness journey in English |
| `/beginner?lang=ta&section=admission` | TNEA, cutoff and process section |
| `/beginner?lang=ta&section=choices` | Choice order and comparison section |
| `/beginner?lang=ta&section=support` | Conditional support and preparation section |
| `/beginner?lang=ta&section=next` | Next directions and official information |
| `/personal?lang=en` | Direct personal guidance and English-form limitation |
| `/personal/reference?lang=en` | Existing detailed form with all personal values unknown and no branch preferences |
| `/counselling?lang=en` | Honest scope notice and working next directions |
| `/demo?scenario=eligible` | Explicit development demo with synthetic student inputs |

Replace `lang=en` with `lang=ta` for the M1 entry-language proof. The detailed form and personal results remain English; the preceding personal-entry page explains this. The reference form's snapshot identifies configured pilot programme evidence, not an assumed student counselling round. Round, category, quota, personal information, and branch preferences begin unknown/neutral.

Manual scenarios:

1. **Zero knowledge:** Open the home page, find the beginner card or unsure link, and follow the five awareness sections without entering marks. Expand “Learn more / மேலும் தெரிந்துகொள்ள” and source details only when wanted. Verify that qualifications, caveats and next actions are understandable without opening source details.
2. **Personal guidance:** Choose the direct personal path, read the language limitation, and intentionally open the detailed form. Verify unknown personal values and no branch preferences. Submit it blank to see the accepted missing-information guidance. For an explicitly synthetic eligibility check, enter Maths 90, Physics 80, Chemistry 70; select HSC_ACADEMIC, GENERAL, Tamil Nadu Native Yes, Nativity Exception Type NONE, Classes 8–12 In TN Yes, Govt School 7 5 No, Grade Certificate Used No, and Improvement Marks Used No. Leave branch preferences neutral. The existing trusted result should show cutoff 165 / 200. These are test inputs, not instructions to a real student about how to answer.
3. **Counselling:** Open counselling help and confirm its limitation message and working links into the process, choices, support and next-direction content. No completed choice-builder is promised.
4. **Language:** Repeat the entry routes in Tamil and English. Review all Tamil wording, limitation messages, and return actions. Check the first screen at mobile width and use keyboard navigation.

M1-C reads factual awareness content from [the frozen pack](docs/m1_awareness_content_pack_v1.md), [its manifest](data/m1_awareness_content_pack_v1.json), and the source registry. [Approved Tamil Student Copy V1](docs/m1_tamil_student_copy_v1.md) refines only the Tamil presentation of those same ten identities; English and source mappings are unchanged. The Tamil copy is human-approved, while final M1 acceptance remains pending. AW-08's numeric 7.5% reference was verified against existing source SRC002, printed page 4, section 4.1. Source labels use registry names, with original IDs retained internally. This is not a claim of full D0/D1 completion or pilot-ready bilingual personal guidance. Representative personal-result Tamil validation remains required by M3.

Normal entry pages omit internal governance notices. Add `&review=1` to an entry URL with a query string (for example `/?lang=ta&review=1`) to display an isolated development-review notice. It does not change content, routing, or domain results.

After the Tamil presentation update, verification used `npm test` (127 tests) and `npm run typecheck` with the project's locally installed, pinned TypeScript dependency. Install prerequisites with `npm install` as above; an ad-hoc compiler is not required.

## Pilot data boundary

The local MVP uses the persisted authoritative 2026 programme evidence in `data/`: CEG, MIT, GCT, PSG Tech, and CIT. It retains 79 source programmes, of which 18 have exact frozen canonical mappings and 61 remain deliberately unmapped and excluded from guidance. It does not create additional mappings.

No authoritative 2026 `AdmissionSeatFact` is currently persisted. The demo therefore loads an empty, explicitly named programme-evidence snapshot. Missing vacancy evidence is displayed as `UNKNOWN_OR_UNPUBLISHED`, never as zero seats or no vacancy. The local demo uses no synthetic seat evidence. Existing automated tests that exercise positive seat-fact behavior use records labelled as test fixtures, never as real TNEA facts.

## Reproducible scenarios

Only the explicitly labelled `/demo` path links to ELIGIBLE, INELIGIBLE, NEEDS_REVIEW, and UNKNOWN_OR_UNPUBLISHED-vacancy scenarios. Their student profiles and preferences are synthetic test inputs, not student defaults. They submit through the real API/application path; results are not hard-coded into the UI. Querying a student route with `scenario=eligible` does not load a demo profile.

## Known MVP limitations

- Coverage is limited to the five pilot colleges, five canonical branches, and admission year 2026.
- Vacancy, sanctioned-intake, and quota-vacancy guidance remains unknown until separately sourced authoritative `AdmissionSeatFact` snapshots are published and ingested.
- There is no admission probability, ranking, historical prediction, AI/LLM recommendation, authentication, saved profile, database, or deployment configuration.
- The local server is development/demo tooling, not production infrastructure.
