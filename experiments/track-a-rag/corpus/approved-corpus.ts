import type { CorpusSection, Language } from "../src/types.ts";
import { REAL_APPROVED_CORPUS } from "./real-approved-corpus.ts";

const BASE_METADATA = {
  source_id: "RAG-A08" as const,
  document_title: "Frozen M1 Awareness Content Pack",
  publisher: "TN Engineering Guidance project",
  source_type: "FROZEN_PROJECT_CONTENT",
  source_year: 2026,
  document_version: "V1",
  reference: "docs/m1_awareness_content_pack_v1.md",
  approval_status: "APPROVED" as const,
  access_date: "2026-09-13",
};

function section(
  id: string,
  title: string,
  text: string,
  language: Language,
  underlyingSourceIds: readonly string[],
): CorpusSection {
  const retrievalTerms: Readonly<Record<string, readonly string[]>> = {
    "AW-01": ["what is engineering", "engineering awareness", "பொறியியல் என்றால் என்ன"],
    "AW-02": ["engineering branches", "main engineering branches", "branch families", "computers maths branches", "பொறியியல் பிரிவுகள்"],
    "AW-03": ["what is tnea", "tnea admission route", "tnea என்றால் என்ன"],
    "AW-04": ["tnea cutoff", "cutoff calculated", "கட் ஆஃப்"],
    "AW-05": ["counselling process", "tnea journey", "கலந்தாய்வு நடைமுறை"],
    "AW-06": ["choice filling order", "preference order", "விருப்ப வரிசை"],
    "AW-08": ["government school support", "support scheme", "அரசுப் பள்ளி உதவி"],
  };
  return {
    section_id: `${id}-${language}`,
    title,
    text,
    language,
    metadata: { ...BASE_METADATA, page_or_section: id },
    underlying_source_ids: underlyingSourceIds,
    evidence_class: "APPROVED_CORPUS",
    retrieval_terms: retrievalTerms[id] ?? [],
  };
}

// Exact reviewed extracts from docs/m1_awareness_content_pack_v1.md.
export const AWARENESS_APPROVED_CORPUS: readonly CorpusSection[] = [
  section(
    "AW-01",
    "Engineering is a group of fields",
    "Engineering uses science, mathematics, design, and practical thinking to solve problems and build or improve things. It is not one single course or one single job. There are many branches, and each branch focuses on different kinds of problems.",
    "ENGLISH",
    ["SRC006", "SRC007", "SRC008"],
  ),
  section(
    "AW-01",
    "பொறியியல் என்பது பல துறைகளைக் கொண்ட படிப்பு",
    "அறிவியல், கணிதம், வடிவமைப்பு, நடைமுறை சிந்தனை ஆகியவற்றைப் பயன்படுத்தி பிரச்சினைகளுக்கு தீர்வு காண்பதே பொறியியல். இது ஒரே படிப்போ ஒரே வேலையோ அல்ல. பல பாடப்பிரிவுகள் உள்ளன. ஒவ்வொரு பிரிவும் வேறு வகையான தேவைகள் மற்றும் பிரச்சினைகளில் கவனம் செலுத்தும்.",
    "TAMIL",
    ["SRC006", "SRC007", "SRC008"],
  ),
  section(
    "AW-02",
    "Begin with broad families",
    "Computing includes software, data, artificial intelligence, cybersecurity, and information systems. Electrical and electronics includes power, circuits, communication, devices, and embedded systems. Mechanical and production includes machines, design, manufacturing, automobiles, and automation. Civil and built environment includes structures, construction, transport, and public infrastructure. A branch name does not by itself tell you the full syllabus or career. Read the current curriculum.",
    "ENGLISH",
    ["SRC006", "SRC008"],
  ),
  section(
    "AW-02",
    "முதலில் பெரிய துறைக் குடும்பங்களைப் பாருங்கள்",
    "கணினித் துறை மென்பொருள், தரவு, செயற்கை நுண்ணறிவு, இணையப் பாதுகாப்பை உள்ளடக்கும். மின்சாரம் மற்றும் மின்னணு துறையில் மின்சக்தி, மின்சுற்றுகள், தகவல் தொடர்பு, கருவிகள் உள்ளன. பாடப்பிரிவின் பெயரை மட்டும் பார்த்து முடிவு செய்ய வேண்டாம். அந்தப் பிரிவின் தற்போதைய பாடத்திட்டத்தைப் பாருங்கள்.",
    "TAMIL",
    ["SRC006", "SRC008"],
  ),
  section(
    "AW-03",
    "TNEA is one engineering admission route",
    "Tamil Nadu Engineering Admissions (TNEA) is the unified single-window process used for first-year B.E./B.Tech admission to the institutions and surrendered seats listed in the official TNEA brochure. For TNEA 2026, one online application covers the courses and institutions included in that process. Other engineering admission routes also exist.",
    "ENGLISH",
    ["SRC002", "SRC008"],
  ),
  section(
    "AW-03",
    "TNEA என்பது பொறியியல் சேர்க்கைக்கான ஒரு வழி",
    "தமிழ்நாடு பொறியியல் சேர்க்கை, அதாவது TNEA, அரசு வெளியிடும் பட்டியலில் உள்ள B.E./B.Tech முதலாம் ஆண்டு இடங்களுக்கு நடத்தப்படும் ஒருங்கிணைந்த இணையவழிச் சேர்க்கை முறை. எல்லா பொறியியல் கல்லூரிகளும் இதே முறையில் சேர்க்கை நடத்தாது.",
    "TAMIL",
    ["SRC002", "SRC008"],
  ),
  section(
    "AW-04",
    "Your TNEA cutoff is a mark out of 200",
    "For general academic TNEA 2026 selection, Mathematics contributes 100, Physics 50, and Chemistry 50. Mathematics plus Physics divided by two plus Chemistry divided by two gives the cutoff out of 200. This cutoff helps prepare the merit list. It is not a guaranteed college or branch.",
    "ENGLISH",
    ["SRC002", "SRC008"],
  ),
  section(
    "AW-04",
    "TNEA கட்-ஆஃப் 200 மதிப்பெண்களுக்கு கணக்கிடப்படுகிறது",
    "பொதுக் கல்விப் பிரிவு மாணவர்களுக்கு TNEA 2026 தேர்வு மதிப்பெண் 200-க்கு கணக்கிடப்படுகிறது. கணிதம் 100, இயற்பியல் 50, வேதியியல் 50 மதிப்பெண்களாக எடுத்துக்கொள்ளப்படும். இந்தக் கட்-ஆஃப் ஒரு குறிப்பிட்ட கல்லூரி அல்லது பாடப்பிரிவு உறுதியாகக் கிடைக்கும் என்று சொல்லாது.",
    "TAMIL",
    ["SRC002", "SRC008"],
  ),
  section(
    "AW-05",
    "The TNEA journey has a clear order",
    "The 2026 journey is online application, certificate upload, merit or rank list, counselling round, choice filling, tentative allotment, confirmation, reporting and fee action. Each step has official instructions and a time window. Use only official TNEA or Directorate of Technical Education portals for current actions.",
    "ENGLISH",
    ["SRC002"],
  ),
  section(
    "AW-05",
    "TNEA நடைமுறைக்கு ஒரு தெளிவான வரிசை உள்ளது",
    "2026 நடைமுறையை எளிமையாகப் பார்த்தால் இணைய விண்ணப்பம், சான்றிதழ் பதிவேற்றம், தரவரிசைப் பட்டியல், கலந்தாய்வு சுற்று, விருப்பப் பட்டியல், தற்காலிக ஒதுக்கீடு, உறுதிப்படுத்தல், அறிக்கையிடல் மற்றும் கட்டண நடவடிக்கை. தற்போதைய நடவடிக்கைகளுக்கு அதிகாரப்பூர்வ இணையதளங்களை மட்டும் பயன்படுத்துங்கள்.",
    "TAMIL",
    ["SRC002"],
  ),
  section(
    "AW-06",
    "Put choices in your true preference order",
    "In TNEA 2026 Choice Filling, you choose combinations of college and branch. The order matters. Allotment uses your preference order, rank, and eligible seat matrix. Put the option you genuinely prefer higher; do not place an option first only because someone says it is safe.",
    "ENGLISH",
    ["SRC002"],
  ),
  section(
    "AW-06",
    "உங்களுக்கு உண்மையில் பிடித்த வரிசையில் விருப்பங்களை இடுங்கள்",
    "TNEA 2026 விருப்பப் பதிவில் கல்லூரி மற்றும் பாடப்பிரிவு சேர்ந்த தேர்வுகளை இடுவீர்கள். அவற்றின் வரிசை முக்கியம். உங்கள் விருப்ப வரிசை, தரவரிசை, உங்களுக்கு பொருந்தும் இடங்கள் ஆகியவற்றின் அடிப்படையில் ஒதுக்கீடு செய்யப்படும்.",
    "TAMIL",
    ["SRC002"],
  ),
  section(
    "AW-08",
    "Some support routes may be worth checking",
    "TNEA 2026 includes communal reservation and specified special categories. The application asks whether the student wants to claim provisions such as the government-school preferential route, first-graduate fee concession, or post-matric scholarship. These do not apply automatically to every student. Check exact conditions and required certificates in the current official brochure.",
    "ENGLISH",
    ["SRC002"],
  ),
  section(
    "AW-08",
    "உங்களுக்கு பொருந்தக்கூடிய உதவிகளைச் சரிபாருங்கள்",
    "TNEA 2026-ல் சமூக இடஒதுக்கீடும் சில சிறப்புப் பிரிவுகளும் உள்ளன. அரசுப் பள்ளி மாணவர் முன்னுரிமை போன்ற உதவிகள் எல்லா மாணவர்களுக்கும் தானாகக் கிடைக்காது. உங்களுக்கு பொருந்துமா, எந்தச் சான்றிதழ் வேண்டும் என்பதைக் தற்போதைய அதிகாரப்பூர்வக் கையேட்டில் பார்த்து உறுதி செய்யுங்கள்.",
    "TAMIL",
    ["SRC002"],
  ),
] as const;

export const APPROVED_CORPUS: readonly CorpusSection[] = [
  ...REAL_APPROVED_CORPUS,
  ...AWARENESS_APPROVED_CORPUS,
];
