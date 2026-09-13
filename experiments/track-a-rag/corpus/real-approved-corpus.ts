import type { CorpusSection, InstitutionScope } from "../src/types.ts";

const ACCESS_DATE = "2026-09-13";

function officialSection(input: {
  id: string;
  title: string;
  text: string;
  sourceId: "RAG-A01" | "RAG-A02" | "RAG-A03" | "RAG-A04" | "RAG-A05" | "RAG-A06";
  documentTitle: string;
  publisher: string;
  sourceType: string;
  sourceYear: number | null;
  version: string | null;
  reference: string;
  pageOrSection: string;
  terms: readonly string[];
  scope?: InstitutionScope;
  regulation?: string;
  revision?: string;
  batch?: string;
  programme?: string;
}): CorpusSection {
  return {
    section_id: input.id,
    title: input.title,
    text: input.text,
    language: "ENGLISH",
    metadata: {
      source_id: input.sourceId,
      document_title: input.documentTitle,
      publisher: input.publisher,
      source_type: input.sourceType,
      source_year: input.sourceYear,
      document_version: input.version,
      reference: input.reference,
      page_or_section: input.pageOrSection,
      approval_status: "APPROVED",
      access_date: ACCESS_DATE,
      institution_scope: input.scope,
      regulation: input.regulation,
      revision: input.revision,
      academic_batch: input.batch,
      programme: input.programme,
    },
    underlying_source_ids: [],
    evidence_class: "APPROVED_CORPUS",
    retrieval_terms: input.terms,
  };
}

const A01 = "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf";
const A02 = "https://static.tneaonline.org/docs/8_TNEA_2024_Counselling_procedure_2026.pdf";
const A03_CSE = "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/BE%20CSE.pdf";
const A03_IT = "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/B.Tech.%20IT%20.pdf";
const A03_ECE = "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/ECE/B.E%20ECE.pdf";
const A04_CSE = "https://cac.annauniv.edu/uddetails/udug_2023_revision%202/CSIE/B.E.%20CSE.pdf";
const A04_IT = "https://cac.annauniv.edu/uddetails/udug_2023_revision%202/CSIE/16.%20B.Tech.%20IT.pdf";
const A04_ECE = "https://cac.annauniv.edu/uddetails/udug_2023_revision%202/ECE/B.E.%20ECE.pdf";

// Verified, normalized excerpts from the approved official sources. Source wording is
// retained only at the granularity needed for the frozen retrieval experiment.
export const REAL_APPROVED_CORPUS: readonly CorpusSection[] = [
  officialSection({
    id: "A01-TNEA-SCOPE", title: "TNEA 2026 admission scope",
    text: "Tamil Nadu Engineering Admissions 2026 is a common application for first-year B.E. and B.Tech admission under the Unified Single Window Admission System to the listed Government, Government Aided, University Department, constituent, Annamalai University, and surrendered self-financing seats. A candidate registers one online application for the courses and institutions covered by the brochure.",
    sourceId: "RAG-A01", documentTitle: "Tamil Nadu Engineering Admissions 2026 Information Brochure",
    publisher: "Directorate of Technical Education, Government of Tamil Nadu", sourceType: "OFFICIAL_ADMISSION_BROCHURE",
    sourceYear: 2026, version: "2026", reference: A01, pageOrSection: "PDF page 2 / printed page 1, Admission to First Year",
    terms: ["what is tnea", "tnea admission route", "unified single window", "common application"],
  }),
  officialSection({
    id: "A01-CUTOFF", title: "TNEA 2026 mode of selection",
    text: "For general-category selection, marks in the prescribed subjects are reduced to 200: Mathematics 100, Physics 50, and Chemistry 50. A merit list is prepared based on the total mark of 200. Normalised marks are not considered for minimum eligibility.",
    sourceId: "RAG-A01", documentTitle: "Tamil Nadu Engineering Admissions 2026 Information Brochure",
    publisher: "Directorate of Technical Education, Government of Tamil Nadu", sourceType: "OFFICIAL_ADMISSION_BROCHURE",
    sourceYear: 2026, version: "2026", reference: A01, pageOrSection: "PDF page 10 / printed page 9, section 6(a)",
    terms: ["tnea cutoff calculated", "cutoff concept", "marks reduced to 200", "mathematics physics chemistry"],
  }),
  officialSection({
    id: "A01-GOVT-SCHOOL", title: "Government-school provision requires proof",
    text: "The brochure describes the 7.5% reservation for government-school students and states that students admitted under it must submit proof of Government School study details from 6th Standard to 12th Standard. Government-school study by itself is not treated here as proof that every condition is satisfied.",
    sourceId: "RAG-A01", documentTitle: "Tamil Nadu Engineering Admissions 2026 Information Brochure",
    publisher: "Directorate of Technical Education, Government of Tamil Nadu", sourceType: "OFFICIAL_ADMISSION_BROCHURE",
    sourceYear: 2026, version: "2026", reference: A01, pageOrSection: "PDF page 11 / printed page 10, section 7.1",
    terms: ["government school what should i check", "7.5 reservation", "government school proof"],
  }),
  officialSection({
    id: "A02-COUNSELLING", title: "TNEA 2026 online counselling stages",
    text: "Online counselling is conducted in three rounds, with candidates participating according to rank. Each round has four stages: Choice Filling, Allotment, Confirmation of Allotment, and Reporting to College or TFC with fee action depending on confirmation.",
    sourceId: "RAG-A02", documentTitle: "TNEA 2026 - Online Counselling Procedure",
    publisher: "Directorate of Technical Education, Chennai", sourceType: "OFFICIAL_COUNSELLING_PROCEDURE",
    sourceYear: 2026, version: "2026", reference: A02, pageOrSection: "PDF pages 1-2, items 6-7",
    terms: ["what happens in counselling", "counselling rounds stages", "allotment confirmation reporting"],
  }),
  officialSection({
    id: "A02-CHOICE-FILLING", title: "Choice order affects allotment",
    text: "A candidate is given three days for choice filling and may choose any number of college-and-branch options based on preference. The order of choices is important. Allotment is based on preferential order, rank, community, and availability of seats.",
    sourceId: "RAG-A02", documentTitle: "TNEA 2026 - Online Counselling Procedure",
    publisher: "Directorate of Technical Education, Chennai", sourceType: "OFFICIAL_COUNSELLING_PROCEDURE",
    sourceYear: 2026, version: "2026", reference: A02, pageOrSection: "PDF page 2, items 8-9",
    terms: ["what is choice filling", "why order matters", "choice filling order", "preference order"],
  }),
  officialSection({
    id: "A03-CSE", title: "Affiliated-institution CSE curriculum",
    text: "The B.E. Computer Science and Engineering curriculum includes Computer Programming: C, Digital Principles and Computer Organization, Object Oriented Programming, Operating Systems, Data Structures, Java Programming, Algorithms, Database Management Systems, Computer Networks, Artificial Intelligence and Machine Learning, and Full Stack Development.",
    sourceId: "RAG-A03", documentTitle: "B.E. Computer Science and Engineering Curriculum",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2025 (Revised 1, 2026)", reference: A03_CSE, pageOrSection: "PDF pages 1-5, semesters I-VI",
    terms: ["what will i study in cse", "cse subjects", "cse curriculum"], scope: "AFFILIATED_INSTITUTIONS",
    regulation: "R-2025", revision: "REVISED_1_2026", batch: "2026-2027", programme: "CSE",
  }),
  officialSection({
    id: "A03-IT", title: "Affiliated-institution IT curriculum",
    text: "The B.Tech. Information Technology curriculum includes Computer Programming: C, Foundations of Data Science using Python, Digital Principles and System Design, Computer Organization and Architecture, Data Structures, Object Oriented Programming, Web Technologies, Database Management Systems, Operating Systems, Machine Learning, Computer Networks, and Full Stack Development Laboratory.",
    sourceId: "RAG-A03", documentTitle: "B.Tech. Information Technology Curriculum",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2025 (Revised 1, 2026)", reference: A03_IT, pageOrSection: "PDF pages 1-6, semesters I-VI",
    terms: ["it subjects", "information technology curriculum", "cse vs it affiliated"], scope: "AFFILIATED_INSTITUTIONS",
    regulation: "R-2025", revision: "REVISED_1_2026", batch: "2026-2027", programme: "IT",
  }),
  officialSection({
    id: "A03-ECE", title: "Affiliated-institution ECE curriculum",
    text: "The B.E. Electronics and Communication Engineering curriculum includes Computer Programming: C, Data Structures using C++, Electronic Devices, Circuits and Network Analysis, Signals and Systems, Digital System Design, Analog and Digital Communication, Artificial Intelligence and Machine Learning, Microcontroller and Peripheral Interfacing, Digital Signal Processing, VLSI Design, and Embedded Technology and IoT.",
    sourceId: "RAG-A03", documentTitle: "B.E. Electronics and Communication Engineering Curriculum",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2025 (Revised 1, 2026)", reference: A03_ECE, pageOrSection: "PDF pages 1-6, semesters I-VI",
    terms: ["what will i study in ece", "ece programming", "ece curriculum"], scope: "AFFILIATED_INSTITUTIONS",
    regulation: "R-2025", revision: "REVISED_1_2026", batch: "2026-2027", programme: "ECE",
  }),
  officialSection({
    id: "A04-CSE", title: "University Departments CSE curriculum",
    text: "For CEG and MIT University Departments, the B.E. Computer Science and Engineering curriculum includes Programming in C, Computational Thinking, Object Oriented Programming, Software Engineering, Data Structures, Digital System Design, Java Programming, Cryptography and System Security, Compiler Design, and Machine Learning.",
    sourceId: "RAG-A04", documentTitle: "B.E. Computer Science and Engineering Curriculum - University Departments",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2023 (Revised 2, 2026)", reference: A04_CSE, pageOrSection: "PDF pages 1-6, semesters I-VII",
    terms: ["ceg cse curriculum", "cse vs it ceg", "university departments cse"], scope: "UNIVERSITY_DEPARTMENTS",
    regulation: "R-2023", revision: "REVISED_2_2026", batch: "2026-2027", programme: "CSE",
  }),
  officialSection({
    id: "A04-IT", title: "University Departments IT curriculum",
    text: "For CEG and MIT University Departments, the B.Tech. Information Technology curriculum includes Programming in C, Information Technology Essentials, Digital Logic and Design, Data Structures, Database Management Systems, Object Oriented Programming, Advanced Data Structures, Software Engineering, Operating Systems, Computer Networks, Web Programming, Machine Learning, Distributed Systems and Computing, and Natural Language and Image Processing.",
    sourceId: "RAG-A04", documentTitle: "B.Tech. Information Technology Curriculum - University Departments",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2023 (Revised 2, 2026)", reference: A04_IT, pageOrSection: "PDF pages 1-7, semesters I-VII",
    terms: ["ceg it curriculum", "cse vs it ceg", "university departments it"], scope: "UNIVERSITY_DEPARTMENTS",
    regulation: "R-2023", revision: "REVISED_2_2026", batch: "2026-2027", programme: "IT",
  }),
  officialSection({
    id: "A04-ECE", title: "University Departments ECE curriculum",
    text: "For CEG University Departments, the B.E. Electronics and Communication Engineering curriculum includes Programming in C, Data Structures and Programming in C++, Electronic Devices, Circuit Analysis, Digital Electronics and System Design, Signals and Systems, Digital Signal Processing, Communication, Computer Architecture, Microprocessors and Microcontrollers, VLSI Design, Wireless Communications, and Machine Learning.",
    sourceId: "RAG-A04", documentTitle: "B.E. Electronics and Communication Engineering Curriculum - University Departments",
    publisher: "Anna University", sourceType: "OFFICIAL_CURRICULUM", sourceYear: 2026,
    version: "Regulations 2023 (Revised 2, 2026)", reference: A04_ECE, pageOrSection: "PDF pages 1-7, semesters I-VII",
    terms: ["ceg ece curriculum", "ece programming", "university departments ece"], scope: "UNIVERSITY_DEPARTMENTS",
    regulation: "R-2023", revision: "REVISED_2_2026", batch: "2026-2027", programme: "ECE",
  }),
  officialSection({
    id: "A05-CEG-COURSES", title: "CEG courses offered",
    text: "The official CEG Courses Offered page lists B.E. Computer Science and Engineering, B.Tech. Information Technology, B.E. Electronics and Communication Engineering, and B.E. Electrical and Electronics Engineering among its undergraduate offerings.",
    sourceId: "RAG-A05", documentTitle: "Courses Offered", publisher: "College of Engineering, Guindy / Anna University",
    sourceType: "OFFICIAL_COLLEGE_PROGRAMME_INFORMATION", sourceYear: null, version: null,
    reference: "https://ceg.annauniv.edu/course.html", pageOrSection: "Courses Offered / department programme lists",
    terms: ["ceg courses offered", "ceg cse it ece"], scope: "UNIVERSITY_DEPARTMENTS",
  }),
  officialSection({
    id: "A06-CEG-SCOPE", title: "CEG curriculum applicability",
    text: "CEG Campus follows the Regulation and Syllabi as prescribed for the University Departments of Anna University.",
    sourceId: "RAG-A06", documentTitle: "Curriculum and Syllabi", publisher: "College of Engineering, Guindy / Anna University",
    sourceType: "OFFICIAL_CURRICULUM_REFERENCE", sourceYear: null, version: null,
    reference: "https://ceg.annauniv.edu/curr.html", pageOrSection: "Curriculum and Syllabi",
    terms: ["ceg curriculum scope", "ceg university departments", "cse vs it ceg"], scope: "UNIVERSITY_DEPARTMENTS",
  }),
] as const;
