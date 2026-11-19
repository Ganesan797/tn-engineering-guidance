/**
 * Governed Cohort Metadata for Tamil Nadu Engineering Admissions.
 *
 * Cohort 55: Original benchmark cohort (35 public institutions + 20 premier autonomous SFCs = 55 institutions).
 * Cohort 66 Additions: Curated top autonomous and accredited private engineering colleges (66 institutions).
 * Cohort 121: Combined catalogue covering 121 unique institutions (55 public/premier + 66 autonomous private).
 */

export interface CollegeMeta {
  code: string;
  name: string;
  type: "GOVERNMENT" | "UNIVERSITY" | "AIDED" | "CONSTITUENT" | "SFC";
  district: string;
  aliases: readonly string[];
}

export const COHORT_55_CODES: readonly string[] = Object.freeze([
  // 11 Govt
  "1516", "2005", "2369", "2603", "2615", "2709", "3464", "3465", "4974", "5009", "5901",
  // 5 Univ Depts
  "1", "2", "3", "4", "5",
  // 3 Govt Aided
  "2006", "2007", "5008",
  // 16 Constituent
  "1013", "1014", "1015", "1026", "2025", "3011", "3016", "3018", "3019", "3021",
  "4020", "4023", "4024", "5010", "5017", "5022",
  // 20 SFC
  "1113", "1120", "1211", "1219", "1304", "1317", "1399", "1419", "1422", "1450",
  "2377", "2607", "2618", "2702", "2711", "2712", "2718", "2719", "4960", "5986",
]);

export const COHORT_66_ADDITIONS_CODES: readonly string[] = Object.freeze([
  // Chennai & Northern Cluster (19)
  "1216", "1112", "1128", "1210", "1114", "1309", "1311", "1307", "1118", "1122",
  "1401", "1408", "1504", "1301", "1303", "1123", "1116", "1322", "1452",
  // Coimbatore & Kongu Cluster (25)
  "2764", "2739", "2710", "2706", "2708", "2740", "2726", "2736", "2727", "2750",
  "2725", "2707", "2715", "2723", "2747", "2611", "2610", "2613", "2608", "2622",
  "2653", "2601", "2621", "2634", "2617",
  // Madurai & Southern Cluster (13)
  "5910", "5904", "4917", "4959", "4678", "4955", "4964", "5907", "4967", "5911",
  "4970", "4672", "4962",
  // Trichy & Central Cluster (9)
  "3819", "3830", "3701", "3813", "3841", "3905", "3908", "3926", "3760",
]);

export const COHORT_65_ADDITIONS_CODES = COHORT_66_ADDITIONS_CODES;

export const COHORT_121_CODES: readonly string[] = Object.freeze([
  ...COHORT_55_CODES,
  ...COHORT_66_ADDITIONS_CODES,
]);

export const COHORT_120_CODES = COHORT_121_CODES;

export const COHORT_55_METADATA: Record<string, CollegeMeta> = {
  // 11 Govt
  "1516": { code: "1516", name: "Thanthai Periyar Government Institute of Technology, Vellore", type: "GOVERNMENT", district: "Vellore", aliases: ["TPGIT", "TPGIT Vellore"] },
  "2005": { code: "2005", name: "Government College of Technology, Coimbatore", type: "GOVERNMENT", district: "Coimbatore", aliases: ["GCT", "GCT Coimbatore"] },
  "2369": { code: "2369", name: "Government College of Engineering, Dharmapuri", type: "GOVERNMENT", district: "Dharmapuri", aliases: ["GCED", "GCE Dharmapuri"] },
  "2603": { code: "2603", name: "Government College of Engineering, Salem", type: "GOVERNMENT", district: "Salem", aliases: ["GCES", "GCE Salem"] },
  "2615": { code: "2615", name: "Government College of Engineering, Srirangam, Tiruchirappalli", type: "GOVERNMENT", district: "Tiruchirappalli", aliases: ["GCE Srirangam", "GCE Trichy", "GCET"] },
  "2709": { code: "2709", name: "Government College of Engineering, Erode (IRTT)", type: "GOVERNMENT", district: "Erode", aliases: ["IRTT", "GCE Erode", "IRT Tech"] },
  "3464": { code: "3464", name: "Government College of Engineering, Thanjavur", type: "GOVERNMENT", district: "Thanjavur", aliases: ["GCET", "GCE Thanjavur"] },
  "3465": { code: "3465", name: "Government College of Engineering, Gandharvakottai", type: "GOVERNMENT", district: "Pudukkottai", aliases: ["GCE Gandharvakottai", "GCE Pudukkottai"] },
  "4974": { code: "4974", name: "Government College of Engineering, Tirunelveli", type: "GOVERNMENT", district: "Tirunelveli", aliases: ["GCETLY", "GCE Tirunelveli", "GCE Nellai"] },
  "5009": { code: "5009", name: "Government College of Engineering, Bodinayakkanur", type: "GOVERNMENT", district: "Theni", aliases: ["GCE Bodinayakkanur", "GCE Bodi", "GCE Theni"] },
  "5901": { code: "5901", name: "Alagappa Chettiar Government College of Engineering and Technology, Karaikudi", type: "GOVERNMENT", district: "Sivaganga", aliases: ["ACGCET", "ACCET", "ACCET Karaikudi"] },

  // 5 Univ Depts
  "1": { code: "1", name: "College of Engineering Guindy (CEG), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["CEG", "CEG Guindy", "Anna University Guindy"] },
  "2": { code: "2", name: "Alagappa College of Technology (ACT), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["ACT", "ACTech", "AC Tech"] },
  "3": { code: "3", name: "School of Architecture and Planning (SAP), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["SAP", "SAP Chennai"] },
  "4": { code: "4", name: "Madras Institute of Technology (MIT), Anna University, Chromepet", type: "UNIVERSITY", district: "Chengalpattu", aliases: ["MIT", "MIT Chromepet", "MIT Chennai"] },
  "5": { code: "5", name: "Faculty of Engineering & Technology, Annamalai University, Chidambaram", type: "UNIVERSITY", district: "Cuddalore", aliases: ["FEAT", "FEAT Annamalai", "Annamalai University"] },

  // 3 Govt Aided
  "2006": { code: "2006", name: "PSG College of Technology, Peelamedu, Coimbatore", type: "AIDED", district: "Coimbatore", aliases: ["PSG", "PSG Tech", "PSGCT"] },
  "2007": { code: "2007", name: "Coimbatore Institute of Technology, Civil Aerodrome Post, Coimbatore", type: "AIDED", district: "Coimbatore", aliases: ["CIT", "CIT Coimbatore"] },
  "5008": { code: "5008", name: "Thiagarajar College of Engineering, Madurai", type: "AIDED", district: "Madurai", aliases: ["TCE", "TCE Madurai", "Thiagarajar"] },

  // 16 Constituent
  "1013": { code: "1013", name: "University College of Engineering, Villupuram", type: "CONSTITUENT", district: "Villupuram", aliases: ["UCEV", "UCE Villupuram"] },
  "1014": { code: "1014", name: "University College of Engineering, Tindivanam", type: "CONSTITUENT", district: "Villupuram", aliases: ["UCET", "UCE Tindivanam"] },
  "1015": { code: "1015", name: "University College of Engineering, Arni", type: "CONSTITUENT", district: "Tiruvannamalai", aliases: ["UCEA", "UCE Arni"] },
  "1026": { code: "1026", name: "University College of Engineering, Kancheepuram", type: "CONSTITUENT", district: "Kancheepuram", aliases: ["UCEK", "UCE Kancheepuram", "UCE Kanchi"] },
  "2025": { code: "2025", name: "Anna University Regional Campus, Coimbatore", type: "CONSTITUENT", district: "Coimbatore", aliases: ["AURCC", "AURC Coimbatore"] },
  "3011": { code: "3011", name: "University College of Engineering, Tiruchirappalli (BIT Campus)", type: "CONSTITUENT", district: "Tiruchirappalli", aliases: ["BIT", "BIT Campus", "BIT Trichy", "UCE Trichy", "UCE Tiruchirappalli"] },
  "3016": { code: "3016", name: "University College of Engineering, Ariyalur", type: "CONSTITUENT", district: "Ariyalur", aliases: ["UCE Ariyalur"] },
  "3018": { code: "3018", name: "University College of Engineering, Nagercoil", type: "CONSTITUENT", district: "Kanyakumari", aliases: ["UCEN", "UCE Nagercoil"] },
  "3019": { code: "3019", name: "University College of Engineering, Panruti", type: "CONSTITUENT", district: "Cuddalore", aliases: ["UCE Panruti"] },
  "3021": { code: "3021", name: "University College of Engineering, Pattukkottai", type: "CONSTITUENT", district: "Thanjavur", aliases: ["UCE Pattukkottai"] },
  "4020": { code: "4020", name: "Anna University Regional Campus, Tirunelveli", type: "CONSTITUENT", district: "Tirunelveli", aliases: ["AURCT", "AURC Tirunelveli"] },
  "4023": { code: "4023", name: "University College of Engineering, Ramanathapuram", type: "CONSTITUENT", district: "Ramanathapuram", aliases: ["UCER", "UCE Ramanathapuram", "UCE Ramnad"] },
  "4024": { code: "4024", name: "University College of Engineering, Dindigul", type: "CONSTITUENT", district: "Dindigul", aliases: ["UCED", "UCE Dindigul"] },
  "5010": { code: "5010", name: "Anna University Regional Campus, Madurai", type: "CONSTITUENT", district: "Madurai", aliases: ["AURCM", "AURC Madurai"] },
  "5017": { code: "5017", name: "University College of Engineering, Thirukkuvalai", type: "CONSTITUENT", district: "Nagapattinam", aliases: ["UCE Thirukkuvalai"] },
  "5022": { code: "5022", name: "University College of Engineering, Thoothukudi", type: "CONSTITUENT", district: "Thoothukudi", aliases: ["UCE Thoothukudi", "UCE Tuticorin", "VOC", "VOC College", "VOC Thoothukudi", "VOC Tuticorin"] },

  // 20 SFC
  "1113": { code: "1113", name: "R.M.K. Engineering College, Gummidipoondi, Tiruvallur", type: "SFC", district: "Tiruvallur", aliases: ["RMK", "RMKEC"] },
  "1120": { code: "1120", name: "Velammal Engineering College, Ambattur, Chennai", type: "SFC", district: "Chennai", aliases: ["VEC", "VEC Chennai"] },
  "1211": { code: "1211", name: "Rajalakshmi Engineering College, Thandalam, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["REC", "REC Chennai", "Rajalakshmi"] },
  "1219": { code: "1219", name: "Sri Venkateswara College of Engineering, Pennalur, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["SVCE", "SVCE Sriperumbudur"] },
  "1304": { code: "1304", name: "Easwari Engineering College, Ramapuram, Chennai", type: "SFC", district: "Chennai", aliases: ["EEC", "Easwari"] },
  "1317": { code: "1317", name: "St. Joseph's College of Engineering, OMR, Chennai", type: "SFC", district: "Chennai", aliases: ["SJCE", "St Josephs", "St Joseph"] },
  "1399": { code: "1399", name: "Chennai Institute of Technology, Kundrathur, Chennai", type: "SFC", district: "Chennai", aliases: ["CIT", "CIT Chennai", "CIT Kundrathur"] },
  "1419": { code: "1419", name: "Sri Sai Ram Engineering College, West Tambaram, Chennai", type: "SFC", district: "Kancheepuram", aliases: ["SEC", "SSREC", "Sairam", "Sai Ram", "Sri Sai Ram"] },
  "1422": { code: "1422", name: "SRM Valliammai Engineering College, Kattankulathur", type: "SFC", district: "Chengalpattu", aliases: ["SRMVEC", "Valliammai"] },
  "1450": { code: "1450", name: "Loyola-ICAM College of Engineering and Technology (LICET), Chennai", type: "SFC", district: "Chennai", aliases: ["LICET", "Loyola ICAM", "Loyola"] },
  "2377": { code: "2377", name: "PSG Institute of Technology and Applied Research, Neelambur, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["PSG", "PSG iTech", "PSGITECH", "PSG IT"] },
  "2607": { code: "2607", name: "K.S. Rangasamy College of Technology, Tiruchengode, Namakkal", type: "SFC", district: "Namakkal", aliases: ["KSRCT", "KSR"] },
  "2618": { code: "2618", name: "Sona College of Technology, Suramangalam, Salem", type: "SFC", district: "Salem", aliases: ["SCT", "Sona"] },
  "2702": { code: "2702", name: "Bannari Amman Institute of Technology, Sathyamangalam, Erode", type: "SFC", district: "Erode", aliases: ["BIT", "BIT Sathy", "Bannari", "BAIT"] },
  "2711": { code: "2711", name: "Kongu Engineering College, Perundurai, Erode", type: "SFC", district: "Erode", aliases: ["KEC", "Kongu"] },
  "2712": { code: "2712", name: "Kumaraguru College of Technology, Chinnavedampatti, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["KCT", "Kumaraguru"] },
  "2718": { code: "2718", name: "Sri Krishna College of Engineering and Technology, Kuniamuthur, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["SKCET", "Krishna"] },
  "2719": { code: "2719", name: "Sri Ramakrishna Engineering College, Vattamalaipalayam, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["SREC", "Ramakrishna"] },
  "4960": { code: "4960", name: "Mepco Schlenk Engineering College, Sivakasi, Virudhunagar", type: "SFC", district: "Virudhunagar", aliases: ["Mepco", "MSEC"] },
  "5986": { code: "5986", name: "Velammal College of Engineering and Technology, Madurai", type: "SFC", district: "Madurai", aliases: ["VCET", "VCET Madurai"] },
};

export const COHORT_65_ADDITIONS_METADATA: Record<string, CollegeMeta> = {
  // --- Chennai & Northern Belt (19) ---
  "1216": { code: "1216", name: "Saveetha Engineering College (Autonomous), Thandalam", type: "SFC", district: "Kancheepuram", aliases: ["SEC", "Saveetha", "SEC Chennai"] },
  "1112": { code: "1112", name: "R.M.D. Engineering College (Autonomous), Kavaraipettai", type: "SFC", district: "Tiruvallur", aliases: ["RMD", "RMD Chennai"] },
  "1128": { code: "1128", name: "R.M.K. College of Engineering and Technology (Autonomous), Puduvoyal", type: "SFC", district: "Tiruvallur", aliases: ["RMKCET", "RMK CET"] },
  "1210": { code: "1210", name: "Panimalar Engineering College (Autonomous), Poonamallee", type: "SFC", district: "Tiruvallur", aliases: ["Panimalar", "PEC"] },
  "1114": { code: "1114", name: "S.A. Engineering College (Autonomous), Thiruverkadu", type: "SFC", district: "Tiruvallur", aliases: ["SAEC", "SA Engineering"] },
  "1309": { code: "1309", name: "Meenakshi Sundararajan Engineering College (Autonomous), Kodambakkam", type: "SFC", district: "Chennai", aliases: ["MSEC", "Meenakshi Sundararajan"] },
  "1311": { code: "1311", name: "KCG College of Technology (Autonomous), Karapakkam", type: "SFC", district: "Chennai", aliases: ["KCG", "KCG Tech"] },
  "1307": { code: "1307", name: "Jerusalem College of Engineering (Autonomous), Pallikkaranai", type: "SFC", district: "Chennai", aliases: ["Jerusalem", "JCE"] },
  "1118": { code: "1118", name: "Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous), Avadi", type: "SFC", district: "Tiruvallur", aliases: ["Vel Tech Multi Tech", "VTMT"] },
  "1122": { code: "1122", name: "Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous), Avadi", type: "SFC", district: "Tiruvallur", aliases: ["Vel Tech High Tech", "VTHT"] },
  "1401": { code: "1401", name: "Adhiparasakthi Engineering College (Autonomous), Melmaruvathur", type: "SFC", district: "Kancheepuram", aliases: ["APEC", "Adhiparasakthi"] },
  "1408": { code: "1408", name: "IFET College of Engineering (Autonomous), Villupuram", type: "SFC", district: "Villupuram", aliases: ["IFET"] },
  "1504": { code: "1504", name: "Arunai Engineering College (Autonomous), Tiruvannamalai", type: "SFC", district: "Tiruvannamalai", aliases: ["Arunai", "AEC"] },
  "1301": { code: "1301", name: "Mohamed Sathak A.J. College of Engineering (Autonomous), Siruseri", type: "SFC", district: "Chengalpattu", aliases: ["MSAJCE"] },
  "1303": { code: "1303", name: "Anand Institute of Higher Technology (Autonomous), Kazhipattur", type: "SFC", district: "Chengalpattu", aliases: ["AIHT", "Anand"] },
  "1123": { code: "1123", name: "Gojan School of Business and Technology (Autonomous), Red Hills", type: "SFC", district: "Tiruvallur", aliases: ["Gojan"] },
  "1116": { code: "1116", name: "Sri Venkateswara College of Engineering and Technology (Autonomous), Thiruvallur", type: "SFC", district: "Tiruvallur", aliases: ["SVCET Thiruvallur"] },
  "1322": { code: "1322", name: "Dhanalakshmi Srinivasan College of Engineering and Technology (Autonomous), Mamallapuram", type: "SFC", district: "Chengalpattu", aliases: ["Dhanalakshmi Srinivasan ECR", "DSCET"] },
  "1452": { code: "1452", name: "PERI Institute of Technology (Autonomous), Tambaram", type: "SFC", district: "Chengalpattu", aliases: ["PERI", "PERI IT"] },

  // --- Coimbatore & Kongu Cluster (24) ---
  "2764": { code: "2764", name: "KPR Institute of Engineering and Technology (Autonomous), Arasur", type: "SFC", district: "Coimbatore", aliases: ["KPR", "KPRIET", "KPR Coimbatore"] },
  "2739": { code: "2739", name: "Sri Eshwar College of Engineering (Autonomous), Kinathukadavu", type: "SFC", district: "Coimbatore", aliases: ["Sri Eshwar", "SECE", "Eshwar"] },
  "2710": { code: "2710", name: "Karpagam College of Engineering (Autonomous), Othakkalmandapam", type: "SFC", district: "Coimbatore", aliases: ["KCE", "Karpagam"] },
  "2706": { code: "2706", name: "Dr. Mahalingam College of Engineering and Technology (Autonomous), Pollachi", type: "SFC", district: "Coimbatore", aliases: ["MCET", "Mahalingam", "MCET Pollachi"] },
  "2708": { code: "2708", name: "Hindusthan College of Engineering and Technology (Autonomous), Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["HICET", "Hindusthan"] },
  "2740": { code: "2740", name: "Hindusthan Institute of Technology (Autonomous), Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["HIT", "Hindusthan Tech"] },
  "2726": { code: "2726", name: "SNS College of Technology (Autonomous), Saravanampatti", type: "SFC", district: "Coimbatore", aliases: ["SNST", "SNS"] },
  "2736": { code: "2736", name: "Dr. N.G.P. Institute of Technology (Autonomous), Kalapatti", type: "SFC", district: "Coimbatore", aliases: ["NGP", "Dr NGP"] },
  "2727": { code: "2727", name: "Sri Shakthi Institute of Engineering and Technology (Autonomous), Chinniyampalayam", type: "SFC", district: "Coimbatore", aliases: ["Sri Shakthi", "SIET"] },
  "2750": { code: "2750", name: "KIT - Kalaignarkarunanidhi Institute of Technology (Autonomous), Kannampalayam", type: "SFC", district: "Coimbatore", aliases: ["KIT", "Kalaignarkarunanidhi"] },
  "2725": { code: "2725", name: "Sri Ramakrishna Institute of Technology (Autonomous), Pachapalayam", type: "SFC", district: "Coimbatore", aliases: ["SRIT", "Ramakrishna IT"] },
  "2707": { code: "2707", name: "Erode Sengunthar Engineering College (Autonomous), Perundurai", type: "SFC", district: "Erode", aliases: ["ESEC", "Erode Sengunthar"] },
  "2715": { code: "2715", name: "Nandha Engineering College (Autonomous), Erode", type: "SFC", district: "Erode", aliases: ["Nandha", "NEC Erode"] },
  "2723": { code: "2723", name: "Velalar College of Engineering and Technology (Autonomous), Erode", type: "SFC", district: "Erode", aliases: ["VCET", "Velalar"] },
  "2747": { code: "2747", name: "Shree Venkateshwara Hi-Tech Engineering College (Autonomous), Gobi", type: "SFC", district: "Erode", aliases: ["SVHEC", "Shree Venkateshwara"] },
  "2611": { code: "2611", name: "Paavai Engineering College (Autonomous), Pachal", type: "SFC", district: "Namakkal", aliases: ["Paavai", "PEC Namakkal"] },
  "2610": { code: "2610", name: "Muthayammal Engineering College (Autonomous), Rasipuram", type: "SFC", district: "Namakkal", aliases: ["MEC Rasipuram", "Muthayammal"] },
  "2613": { code: "2613", name: "K.S.R. College of Engineering (Autonomous), Tiruchengode", type: "SFC", district: "Namakkal", aliases: ["KSRCE", "KSR College"] },
  "2608": { code: "2608", name: "M. Kumarasamy College of Engineering (Autonomous), Thalavapalayam", type: "SFC", district: "Karur", aliases: ["MKCE", "Kumarasamy Karur"] },
  "2622": { code: "2622", name: "V.S.B. Engineering College (Autonomous), Karur", type: "SFC", district: "Karur", aliases: ["VSB", "VSB Karur"] },
  "2653": { code: "2653", name: "Knowledge Institute of Technology (Autonomous), Kakapalayam", type: "SFC", district: "Salem", aliases: ["KIOT", "KIOT Salem"] },
  "2601": { code: "2601", name: "Adhiyamaan College of Engineering (Autonomous), Hosur", type: "SFC", district: "Krishnagiri", aliases: ["ACE", "Adhiyamaan Hosur"] },
  "2621": { code: "2621", name: "Er. Perumal Manimekalai College of Engineering (Autonomous), Hosur", type: "SFC", district: "Krishnagiri", aliases: ["PMC Tech", "Perumal Manimekalai"] },
  "2634": { code: "2634", name: "Excel Engineering College (Autonomous), Pallakapalayam", type: "SFC", district: "Namakkal", aliases: ["Excel", "Excel Namakkal"] },
  "2617": { code: "2617", name: "Sengunthar Engineering College (Autonomous), Tiruchengode", type: "SFC", district: "Namakkal", aliases: ["Sengunthar Tiruchengode"] },

  // --- Madurai & Southern Belt (13) ---
  "5910": { code: "5910", name: "PSNA College of Engineering and Technology (Autonomous), Dindigul", type: "SFC", district: "Dindigul", aliases: ["PSNA", "PSNA Dindigul"] },
  "5904": { code: "5904", name: "K.L.N. College of Engineering (Autonomous), Pottapalayam", type: "SFC", district: "Madurai", aliases: ["KLN", "KLNCE Madurai"] },
  "4917": { code: "4917", name: "Sethu Institute of Technology (Autonomous), Kariapatti", type: "SFC", district: "Virudhunagar", aliases: ["Sethu", "SIT Kariapatti"] },
  "4959": { code: "4959", name: "Kamaraj College of Engineering and Technology (Autonomous), Virudhunagar", type: "SFC", district: "Virudhunagar", aliases: ["Kamaraj", "KCET Virudhunagar"] },
  "4678": { code: "4678", name: "RAMCO Institute of Technology (Autonomous), Rajapalayam", type: "SFC", district: "Virudhunagar", aliases: ["RAMCO", "RIT Rajapalayam"] },
  "4955": { code: "4955", name: "Francis Xavier Engineering College (Autonomous), Tirunelveli", type: "SFC", district: "Tirunelveli", aliases: ["FX", "Francis Xavier", "FXEC Tirunelveli"] },
  "4964": { code: "4964", name: "PSN College of Engineering and Technology (Autonomous), Melathediyoor", type: "SFC", district: "Tirunelveli", aliases: ["PSNCET", "PSN Tirunelveli"] },
  "5907": { code: "5907", name: "Mohamed Sathak Engineering College (Autonomous), Kilakarai", type: "SFC", district: "Ramanathapuram", aliases: ["MSEC Kilakarai", "Mohamed Sathak Kilakarai"] },
  "4967": { code: "4967", name: "St. Xavier's Catholic College of Engineering (Autonomous), Nagercoil", type: "SFC", district: "Kanyakumari", aliases: ["St Xavier Catholic", "SXCCE Nagercoil"] },
  "5911": { code: "5911", name: "NPR College of Engineering and Technology (Autonomous), Natham", type: "SFC", district: "Dindigul", aliases: ["NPR", "NPR Natham"] },
  "4970": { code: "4970", name: "Sree Sowdambika College of Engineering (Autonomous), Aruppukottai", type: "SFC", district: "Virudhunagar", aliases: ["Sowdambika Aruppukottai"] },
  "4672": { code: "4672", name: "Stella Mary's College of Engineering (Autonomous), Kanyakumari", type: "SFC", district: "Kanyakumari", aliases: ["Stella Mary", "Stella Mary Kanyakumari"] },
  "4962": { code: "4962", name: "National Engineering College (Autonomous), Kovilpatti", type: "SFC", district: "Thoothukudi", aliases: ["NEC", "NEC Kovilpatti"] },

  // --- Trichy & Central Belt (9) ---
  "3819": { code: "3819", name: "Saranathan College of Engineering (Autonomous), Trichy", type: "SFC", district: "Tiruchirappalli", aliases: ["Saranathan", "SCE Trichy"] },
  "3830": { code: "3830", name: "K. Ramakrishnan College of Engineering (Autonomous), Samayapuram", type: "SFC", district: "Tiruchirappalli", aliases: ["KRCE", "Ramakrishnan Trichy"] },
  "3701": { code: "3701", name: "K Ramakrishnan College of Technology (Autonomous), Samayapuram", type: "SFC", district: "Tiruchirappalli", aliases: ["KRCT", "Ramakrishnan Tech Trichy"] },
  "3813": { code: "3813", name: "Oxford Engineering College (Autonomous), Pirattiyur", type: "SFC", district: "Tiruchirappalli", aliases: ["Oxford Trichy"] },
  "3841": { code: "3841", name: "CARE College of Engineering (Autonomous), Thayanoor", type: "SFC", district: "Tiruchirappalli", aliases: ["CARE Trichy"] },
  "3905": { code: "3905", name: "Kings College of Engineering (Autonomous), Punalkulam", type: "SFC", district: "Pudukkottai", aliases: ["Kings Pudukkottai", "Kings Thanjavur"] },
  "3908": { code: "3908", name: "Mount Zion College of Engineering and Technology (Autonomous), Pilivalam", type: "SFC", district: "Pudukkottai", aliases: ["Mount Zion Pudukkottai"] },
  "3926": { code: "3926", name: "Chendhuran College of Engineering and Technology (Autonomous), Lena Vilakku", type: "SFC", district: "Pudukkottai", aliases: ["Chendhuran"] },
  "3760": { code: "3760", name: "Sir Issac Newton College of Engineering and Technology (Autonomous), Nagapattinam", type: "SFC", district: "Nagapattinam", aliases: ["Sir Issac Newton", "SINCET"] },
};

export const COHORT_66_ADDITIONS_METADATA = COHORT_65_ADDITIONS_METADATA;

export const COHORT_121_METADATA: Record<string, CollegeMeta> = {
  ...COHORT_55_METADATA,
  ...COHORT_66_ADDITIONS_METADATA,
};

export const COHORT_120_METADATA = COHORT_121_METADATA;
