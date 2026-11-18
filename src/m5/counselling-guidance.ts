import type { SupportedLanguage } from "./bilingual-copy.ts";

export interface CounsellingGuideSection {
  readonly title: string;
  readonly content: string[];
}

export interface CounsellingGuidanceContent {
  readonly title: string;
  readonly subtitle: string;
  readonly sections: readonly CounsellingGuideSection[];
}

const EN_COUNSELLING_GUIDANCE: CounsellingGuidanceContent = {
  title: "TNEA Choice-Filling Process & Procedure Guidance",
  subtitle:
    "Factual guidance based on official TNEA procedures to help students organize their preference list accurately.",
  sections: [
    {
      title: "1. Choice List Evaluation Procedure",
      content: [
        "Candidates submit an ordered list of college and branch preferences. The TNEA counselling process evaluates candidate choices based on merit rank, category reservation rules, seat matrix availability, and the submitted preference order.",
        "When an eligible seat is found based on official reservation rules and rank, that choice is provisionally allotted. Lower preferences in the list are not considered during that allocation cycle.",
        "Candidates should organize choices strictly according to their genuine preferences for colleges and branches, ensuring that more preferred options are listed above less preferred options.",
      ],
    },
    {
      title: "2. Upward Movement Option in Provisional Allotment",
      content: [
        "If a candidate is allotted a seat other than their first preference (for example, Choice #7), official TNEA procedures provide the option to accept the seat with a request for 'Upward Movement'.",
        "During seat reallocation stages, if vacancies arise in choices listed above the allotted seat, the candidate may be considered for movement toward Choice #1.",
        "Upward movement proceeds strictly toward higher preferences (movement toward Choice #1); it never moves downward to lower choices. Arranging choices in genuine order of priority ensures any movement toward Choice #1 reflects the student's true preference.",
      ],
    },
    {
      title: "3. Ordering Choices by Genuine Preference",
      content: [
        "Historical provisional cutoffs are past observations that fluctuate annually based on candidate preferences, applicant distribution, and seat matrix revisions.",
        "A historical mark difference does not guarantee or prevent admission. Candidates are free to enter any approved college and branch in their preference list, regardless of past cutoffs.",
        "Organizing your list according to your actual academic and geographic preferences ensures that any allotment made matches your true priorities.",
      ],
    },
    {
      title: "4. Government School (7.5%) Quota Eligibility & Fee Support",
      content: [
        "Under Tamil Nadu Act No. 14 of 2021, eligible students who studied from 6th to 12th standard in Tamil Nadu Government schools are eligible for the 7.5% preferential reservation for engineering admissions.",
        "The qualifying school categories are Government schools, Corporation schools, Municipal schools, Adi Dravidar and Tribal Welfare schools, Kallar Reclamation schools, Forest Department schools, and schools managed by Government departments.",
        "Eligibility must be verified using proof of Government-school study details from 6th through 12th standard; eligibility and verification do not by themselves establish an allotment or fee support.",
        "For a student who is verified, allotted, and admitted under the 7.5% reservation through single-window counselling, the Government of Tamil Nadu pays the applicable tuition, hostel, and development fees in accordance with G.O. (Ms.) No. 221.",
      ],
    },
    {
      title: "5. Choice Entry & Submission Guidelines",
      content: [
        "Candidates must carefully enter, verify, and save their choices before the published deadline specified in the official counselling schedule.",
        "Candidates are advised to review the generated summary of choices—including college codes, branch codes, and sequential order—and lock their choices within the designated window.",
        "Complete choice locking well before the closing hours to avoid potential portal congestion or network delays.",
      ],
    },
  ],
};

const TA_COUNSELLING_GUIDANCE: CounsellingGuidanceContent = {
  title: "TNEA விருப்பப் பட்டியல் நிரப்புதல் மற்றும் நடைமுறை வழிகாட்டல்",
  subtitle:
    "மாணவர்கள் தங்கள் அதிகாரப்பூர்வ முன்னுரிமைப் பட்டியலைத் துல்லியமாக அமைக்க உதவும் நடைமுறை வழிகாட்டல்.",
  sections: [
    {
      title: "1. விருப்பப் பட்டியல் பரிசீலனை நடைமுறை",
      content: [
        "விண்ணப்பதாரர்கள் தங்கள் கல்லூரி மற்றும் கிளை விருப்பங்களை முன்னுரிமை வரிசையில் சமர்ப்பிக்கின்றனர். TNEA கலந்தாய்வு நடைமுறையில் தகுதித் தரவரிசை, இட ஒதுக்கீட்டு விதிகள், காலியிடங்கள் மற்றும் சமர்ப்பிக்கப்பட்ட விருப்ப வரிசையின் அடிப்படையில் இடங்கள் பரிசீலிக்கப்படுகின்றன.",
        "இட ஒதுக்கீட்டு விதிகள் மற்றும் தரவரிசையின்படி ஓர் இடத்தில் தற்காலிக இடம் ஒதுக்கப்பட்டவுடன், அந்தச் சுற்றில் அதற்குக் கீழே உள்ள விருப்பங்கள் பரிசீலிக்கப்பட மாட்டாது.",
        "எனவே, மாணவர்கள் தங்களுக்கு மிகவும் பிடித்த கல்லூரி மற்றும் கிளைகளை மேலே வைத்து, உண்மையான முன்னுரிமையின் அடிப்படையில் விருப்பப் பட்டியலை வரிசைப்படுத்த வேண்டும்.",
      ],
    },
    {
      title: "2. தற்காலிக ஒதுக்கீட்டில் மேல்நோக்கிய நகர்வு (Upward Movement) வாய்ப்பு",
      content: [
        "ஒரு மாணவருக்கு முதல் விருப்பம் அல்லாத மாற்று விருப்பத்தில் (எ.கா. விருப்பம் #7) தற்காலிக இடம் ஒதுக்கப்படும் போது, TNEA நடைமுறைகளின்படி அந்த இடத்தை ஏற்றுக்கொண்டு 'மேல்நோக்கிய நகர்வு' (Upward Movement - விருப்பம் #1-ஐ நோக்கிய நகர்வு) கோரும் வாய்ப்பு உண்டு.",
        "அடுத்த கட்ட ஒதுக்கீட்டில் மேலே உள்ள விருப்பங்களில் காலியிடங்கள் ஏற்பட்டால், மாணவர் விருப்பம் #1-ஐ நோக்கிய உயர் முன்னுரிமைக்கு மாற்றப்பட வாய்ப்புள்ளது.",
        "மேல்நோக்கிய நகர்வு எப்போதும் விருப்பம் #1-ஐ நோக்கிய உயர் முன்னுரிமைகளுக்கு மட்டுமே நகர்த்தும்; ஒருபோதும் கீழ்ப்பகுதி விருப்பங்களுக்கு நகர்த்தாது. எனவே உண்மையான விருப்பங்களை வரிசையாக அமைப்பது அவசியமாகும்.",
      ],
    },
    {
      title: "3. விருப்பங்களை உண்மையான முன்னுரிமைப்படி வரிசைப்படுத்துதல்",
      content: [
        "கடந்த கால தற்காலிக கட்-ஆஃப் மதிப்பெண்கள் முந்தைய ஆண்டுகளின் பதிவு மட்டுமே. விண்ணப்பதாரர்களின் விருப்பங்கள் மற்றும் இடங்களின் எண்ணிக்கைக்கு ஏற்ப கட்-ஆஃப் ஆண்டுதோறும் மாறுபடும்.",
        "கடந்த கால மதிப்பெண் வேறுபாடு சேர்க்கையை உறுதிப்படுத்தவோ தடுக்கவோ செய்யாது. உங்கள் கல்வி மற்றும் இருப்பிட முன்னுரிமையின் அடிப்படையில் கல்லூரிகளைப் பட்டியலில் சேர்க்கலாம்.",
        "உங்கள் விருப்பப் பட்டியலை உண்மையான முன்னுரிமைப்படி அமைப்பது, கிடைக்கும் ஒதுக்கீடு உங்கள் விருப்பத்திற்கு உகந்ததாக அமைய வழிவகுக்கும்.",
      ],
    },
    {
      title: "4. அரசுப் பள்ளி 7.5% சிறப்பு ஒதுக்கீடு மற்றும் கல்விக் கட்டண உதவி",
      content: [
        "தமிழ்நாடு சட்டம் 14/2021-ன் படி, தமிழ்நாட்டில் உள்ள அரசுப் பள்ளிகளில் 6 முதல் 12-ம் வகுப்பு வரை பயின்ற தகுதியுள்ள மாணவர்கள் பொறியியல் சேர்க்கையில் 7.5% முன்னுரிமை ஒதுக்கீட்டிற்குத் தகுதியுடையவர்கள்.",
        "தகுதியான பள்ளி வகைகள்: அரசுப் பள்ளிகள், மாநகராட்சிப் பள்ளிகள், நகராட்சிப் பள்ளிகள், ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலப் பள்ளிகள், கள்ளர் சீரமைப்புப் பள்ளிகள், வனத்துறைப் பள்ளிகள் மற்றும் அரசுத் துறைகளால் நிர்வகிக்கப்படும் பள்ளிகள்.",
        "6-ம் வகுப்பு முதல் 12-ம் வகுப்பு வரையிலான அரசுப் பள்ளிப் பயில் விவரங்களுக்கான சான்றைச் சமர்ப்பித்துத் தகுதியை உறுதிப்படுத்த வேண்டும்; தகுதியும் சரிபார்ப்பும் மட்டும் இட ஒதுக்கீட்டையோ கட்டண உதவியையோ உறுதிப்படுத்தாது.",
        "சரிபார்க்கப்பட்டு, ஒற்றைச் சாளரக் கலந்தாய்வு மூலம் 7.5% ஒதுக்கீட்டில் இடம் ஒதுக்கப்பட்டுச் சேர்க்கை பெற்ற மாணவருக்கு, G.O. (Ms.) No. 221-ன்படி பொருந்தும் கல்விக் கட்டணம், விடுதிக் கட்டணம் மற்றும் மேம்பாட்டுக் கட்டணம் ஆகியவற்றைத் தமிழக அரசு செலுத்தும்.",
      ],
    },
    {
      title: "5. விருப்பப் பதிவு மற்றும் சமர்ப்பித்தல் வழிகாட்டல்",
      content: [
        "அதிகாரப்பூர்வ கலந்தாய்வு கால அட்டவணையில் தெரிவிக்கப்பட்டுள்ள காலக்கெடுவிற்குள் விருப்பங்களை கவனமாக உள்ளீடு செய்து சேமிக்க வேண்டும்.",
        "கல்லூரிக் குறியீடு, கிளைக் குறியீடு மற்றும் முன்னுரிமை வரிசை எண்களைச் சரிபார்த்து, குறிப்பிட்ட கால இடைவெளிக்குள் விருப்பங்களை உறுதி செய்து பூட்ட (Locking) வேண்டும்.",
        "கடைசி நேர இணைய நெரிசல் மற்றும் தொழில்நுட்பத் தடைகளைத் தவிர்க்க, இறுதி நேரத்திற்கு முன்னதாகவே விருப்பங்களைப் பூட்டி இறுதி செய்ய வேண்டும்.",
      ],
    },
  ],
};

export function getCounsellingGuidance(
  lang: SupportedLanguage = "en"
): CounsellingGuidanceContent {
  return lang === "ta" ? TA_COUNSELLING_GUIDANCE : EN_COUNSELLING_GUIDANCE;
}
