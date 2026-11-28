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

export const COHORT_79_ADDITIONS_CODES: readonly string[] = Object.freeze([
  // Tier A: Central / Specialized Public (3)
  "1321", "5012", "2343",
  // Tier B: Underserved Districts (16)
  "3805", "3817", "2656", "2651", "2717", "2705", "1523", "1505",
  "1441", "1430", "1510", "3801", "3803", "4968", "4994", "5865",
  // Tier C: Regional Autonomous Anchors (35)
  "3466", "2683", "1520", "2642", "3806", "3833", "5921", "4941", "3920",
  "3425", "3843", "4670", "4971", "5530", "5832", "5913", "5912", "5919",
  "4949", "4669", "4680", "4965", "5914", "5935", "5502", "2625", "2302",
  "2636", "2648", "2624", "2609", "2614", "2620", "2758", "2748",
  // Tier D: High-Offering Autonomous Anchors (25)
  "3786", "3807", "3826", "3795", "3811", "1111", "1218", "1413", "1405",
  "1202", "1207", "1225", "1316", "1306", "1431", "1414", "1101", "1110",
  "1432", "1126", "2716", "2704", "2329", "2743", "2751",
]);

export const COHORT_200_CODES: readonly string[] = Object.freeze([
  ...COHORT_121_CODES,
  ...COHORT_79_ADDITIONS_CODES,
]);

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

export const COHORT_79_ADDITIONS_METADATA: Record<string, CollegeMeta> = {
  "1101": { code: "1101", name: "Aalim Muhammed Salegh College of Engineering (Autonomous)", type: "SFC", district: "Tiruvallur", aliases: [] },
  "1110": { code: "1110", name: "Prathyusha Engineering College (Autonomous)", type: "SFC", district: "Tiruvallur", aliases: [] },
  "1111": { code: "1111", name: "Rajalakshmi Engineering College (Off Campus - Autonomous) Perungudi", type: "SFC", district: "Chennai", aliases: [] },
  "1126": { code: "1126", name: "J N N Institute of Engineering (Autonomous)", type: "SFC", district: "Tiruvallur", aliases: [] },
  "1202": { code: "1202", name: "D M I College of Engineering (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1207": { code: "1207", name: "Kings Engineering College (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1218": { code: "1218", name: "Sri Muthukumaran Institute of Technology (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1225": { code: "1225", name: "Loyola Institute of Technology (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1306": { code: "1306", name: "Jeppiaar Engineering College (Autonomous)", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1316": { code: "1316", name: "Agni College of Technology (Autonomous)", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1321": { code: "1321", name: "Central Institute of Petrochemicals Engineering and Technology (CIPET), Chennai", type: "GOVERNMENT", district: "Chennai", aliases: ["CIPET"] },
  "1405": { code: "1405", name: "Dhanalakshmi College of Engineering (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1413": { code: "1413", name: "Sri Venkateswaraa College of Technology (Autonomous)", type: "SFC", district: "Kancheepuram", aliases: [] },
  "1414": { code: "1414", name: "Prince Shri Venkateshwara Padmavathy Engineering College (Autonomous)", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1430": { code: "1430", name: "Maha Bharathi Engineering College", type: "SFC", district: "Kallakurichi", aliases: [] },
  "1431": { code: "1431", name: "New Prince Shri Bhavani College of Engineering and Technology (Autonomous)", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1432": { code: "1432", name: "Rajalakshmi Institute of Technology (Autonomous)", type: "SFC", district: "Tiruvallur", aliases: ["RIT"] },
  "1441": { code: "1441", name: "A K T Memorial College of Engineering and Technology", type: "SFC", district: "Kallakurichi", aliases: [] },
  "1505": { code: "1505", name: "C Abdul Hakeem College of Engineering and Technology", type: "SFC", district: "Ranipet", aliases: [] },
  "1510": { code: "1510", name: "Priyadarshini Engineering College", type: "SFC", district: "Tirupathur", aliases: [] },
  "1520": { code: "1520", name: "Kingston Engineering College (Autonomous)", type: "SFC", district: "Vellore", aliases: [] },
  "1523": { code: "1523", name: "Global Institute of Engineering and Technology (Autonomous)", type: "SFC", district: "Ranipet", aliases: [] },
  "2302": { code: "2302", name: "Sri Shanmugha College of Engineering and Technology (Autonomous)", type: "SFC", district: "Salem", aliases: [] },
  "2329": { code: "2329", name: "Rathinam Technical Campus (Autonomous)", type: "SFC", district: "Coimbatore", aliases: ["Rathinam"] },
  "2343": { code: "2343", name: "Indian Institute of Handloom Technology", type: "GOVERNMENT", district: "Salem", aliases: ["IIHT"] },
  "2609": { code: "2609", name: "Mahendra Engineering College (Autonomous)", type: "SFC", district: "Namakkal", aliases: ["Mahendra"] },
  "2614": { code: "2614", name: "S S M College of Engineering (Autonomous)", type: "SFC", district: "Namakkal", aliases: [] },
  "2620": { code: "2620", name: "Vivekanandha College of Engineering for Women (Autonomous)", type: "SFC", district: "Namakkal", aliases: [] },
  "2624": { code: "2624", name: "Gnanamani College of Technology (Autonomous)", type: "SFC", district: "Namakkal", aliases: [] },
  "2625": { code: "2625", name: "The Kavery Engineering College (Autonomous)", type: "SFC", district: "Salem", aliases: [] },
  "2636": { code: "2636", name: "A V S Engineering College (Autonomous)", type: "SFC", district: "Salem", aliases: [] },
  "2642": { code: "2642", name: "P S V College of Engineering and Technology (Autonomous)", type: "SFC", district: "Krishnagiri", aliases: [] },
  "2648": { code: "2648", name: "Annapoorana Engineering College (Autonomous)", type: "SFC", district: "Salem", aliases: [] },
  "2651": { code: "2651", name: "Jai Shriram Engineering College (Autonomous)", type: "SFC", district: "Tiruppur", aliases: [] },
  "2656": { code: "2656", name: "Kangeyam Institute of Technology (Autonomous)", type: "SFC", district: "Tiruppur", aliases: [] },
  "2683": { code: "2683", name: "Shreenivasa Engineering College (Autonomous)", type: "SFC", district: "Dharmapuri", aliases: [] },
  "2704": { code: "2704", name: "Coimbatore Institute of Engineering and Technology (Autonomous)", type: "SFC", district: "Coimbatore", aliases: ["CIET"] },
  "2705": { code: "2705", name: "CSI College of Engineering (Autonomous)", type: "SFC", district: "The Nilgiris", aliases: [] },
  "2716": { code: "2716", name: "Park College of Engineering and Technology (Autonomous)", type: "SFC", district: "Coimbatore", aliases: ["Park"] },
  "2717": { code: "2717", name: "Sasurie College of Engineering (Autonomous)", type: "SFC", district: "Tiruppur", aliases: [] },
  "2743": { code: "2743", name: "Dhanalakshmi Srinivasan College of Engineering (CBE) (Autonomous)", type: "SFC", district: "Coimbatore", aliases: [] },
  "2748": { code: "2748", name: "Surya Engineering College (Autonomous)", type: "SFC", district: "Erode", aliases: [] },
  "2751": { code: "2751", name: "KGISL Institute of Technology (Autonomous)", type: "SFC", district: "Coimbatore", aliases: ["KITE", "KGISL"] },
  "2758": { code: "2758", name: "J K K Munirajah College of Technology (Autonomous)", type: "SFC", district: "Erode", aliases: [] },
  "3425": { code: "3425", name: "C K College of Engineering and Technology (Autonomous)", type: "SFC", district: "Cuddalore", aliases: [] },
  "3466": { code: "3466", name: "Nelliandavar Institute of Technology (Autonomous)", type: "SFC", district: "Ariyalur", aliases: [] },
  "3786": { code: "3786", name: "M.A.M. School of Engineering (Autonomous)", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3795": { code: "3795", name: "SRM TRP Engineering College (Autonomous)", type: "SFC", district: "Tiruchirappalli", aliases: ["SRM TRP"] },
  "3801": { code: "3801", name: "A V C College of Engineering", type: "SFC", district: "Mayiladuthurai", aliases: ["AVC"] },
  "3803": { code: "3803", name: "Anjalai Ammal Mahalingam Engineering College", type: "SFC", district: "Tiruvarur", aliases: ["AAMEC"] },
  "3805": { code: "3805", name: "Dhanalakshmi Srinivasan Engineering College (Autonomous)", type: "SFC", district: "Perambalur", aliases: ["DSEC"] },
  "3806": { code: "3806", name: "E G S Pillay Engineering College (Autonomous)", type: "SFC", district: "Nagapattinam", aliases: ["EGSP"] },
  "3807": { code: "3807", name: "J J College of Engineering and Technology (Autonomous)", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3811": { code: "3811", name: "M I E T Engineering College (Autonomous)", type: "SFC", district: "Tiruchirappalli", aliases: ["MIET"] },
  "3817": { code: "3817", name: "Roever Engineering College (Autonomous)", type: "SFC", district: "Perambalur", aliases: [] },
  "3826": { code: "3826", name: "Kongunadu College of Engineering and Technology (Autonomous)", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3833": { code: "3833", name: "Parisutham Institute of Technology and Science (Autonomous)", type: "SFC", district: "Thanjavur", aliases: ["PITS"] },
  "3843": { code: "3843", name: "M R K Institute of Technology (Autonomous)", type: "SFC", district: "Cuddalore", aliases: [] },
  "3920": { code: "3920", name: "Sudharsan Engineering College (Autonomous)", type: "SFC", district: "Pudukkottai", aliases: [] },
  "4669": { code: "4669", name: "Thamirabharani Engineering College (Autonomous)", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4670": { code: "4670", name: "Rohini College of Engineering & Technology (Autonomous)", type: "SFC", district: "Kanyakumari", aliases: [] },
  "4680": { code: "4680", name: "AAA College of Engineering and Technology (Autonomous)", type: "SFC", district: "Virudhunagar", aliases: [] },
  "4941": { code: "4941", name: "Unnamalai Institute of Technology (Autonomous)", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4949": { code: "4949", name: "PSN Institute of Technology and Science (Autonomous)", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4965": { code: "4965", name: "P S R Engineering College (Autonomous)", type: "SFC", district: "Virudhunagar", aliases: ["PSR"] },
  "4968": { code: "4968", name: "Sardar Raja College of Engineering", type: "SFC", district: "Tenkasi", aliases: [] },
  "4971": { code: "4971", name: "St. Xavier's Catholic College of Engineering (Autonomous)", type: "SFC", district: "Kanyakumari", aliases: [] },
  "4994": { code: "4994", name: "J P College of Engineering", type: "SFC", district: "Tenkasi", aliases: [] },
  "5012": { code: "5012", name: "Central Electrochemical Research Institute (CECRI), Karaikudi", type: "GOVERNMENT", district: "Sivaganga", aliases: ["CECRI"] },
  "5502": { code: "5502", name: "Sri Raajaraajan College of Engineering & Technology (Autonomous)", type: "SFC", district: "Madurai", aliases: [] },
  "5530": { code: "5530", name: "SSM Institute of Engineering and Technology (Autonomous)", type: "SFC", district: "Dindigul", aliases: [] },
  "5832": { code: "5832", name: "N P R College of Engineering and Technology (Autonomous)", type: "SFC", district: "Dindigul", aliases: [] },
  "5865": { code: "5865", name: "Nadar Saraswathi College of Engineering and Technology", type: "SFC", district: "Theni", aliases: [] },
  "5912": { code: "5912", name: "Pandian Saraswathi Yadav Engineering College (Autonomous)", type: "SFC", district: "Sivaganga", aliases: [] },
  "5913": { code: "5913", name: "R V S College of Engineering (Autonomous)", type: "SFC", district: "Dindigul", aliases: [] },
  "5914": { code: "5914", name: "Solamalai College of Engineering (Autonomous)", type: "SFC", district: "Madurai", aliases: [] },
  "5919": { code: "5919", name: "St. Michael College of Engineering and Technology (Autonomous)", type: "SFC", district: "Sivaganga", aliases: [] },
  "5921": { code: "5921", name: "Syed Ammal Engineering College (Autonomous)", type: "SFC", district: "Ramanathapuram", aliases: [] },
  "5935": { code: "5935", name: "Fatima Michael College of Engineering and Technology (Autonomous)", type: "SFC", district: "Madurai", aliases: [] },
};

export const COHORT_200_METADATA: Record<string, CollegeMeta> = {
  ...COHORT_121_METADATA,
  ...COHORT_79_ADDITIONS_METADATA,
};

export const COHORT_100_ADDITIONS_CODES = Object.freeze([
  "1115", "1137", "1140", "1217", "1226", "1232", "1233", "1238", "1325", "1412",
  "1420", "1421", "1423", "1424", "1434", "1442", "1501", "1507", "1509", "1517",
  "1605", "2345", "2349", "2354", "2357", "2623", "2627", "2628", "2630", "2632",
  "2635", "2639", "2640", "2643", "2646", "2652", "2673", "2713", "2721", "2729",
  "2731", "2732", "2741", "2744", "2745", "2749", "2752", "2753", "2755", "2762",
  "2763", "2769", "2770", "2776", "2777", "3410", "3454", "3477", "3782", "3804",
  "3810", "3812", "3825", "3829", "3831", "3846", "3848", "3852", "3857", "3860",
  "4675", "4676", "4677", "4686", "4864", "4928", "4931", "4933", "4944", "4952",
  "4954", "4957", "4961", "4966", "4969", "4975", "4976", "4977", "4980", "4981",
  "4992", "4993", "4996", "5536", "5546", "5703", "5842", "5902", "5924", "5988",
] as const);

export const COHORT_300_CODES = Object.freeze([...COHORT_200_CODES, ...COHORT_100_ADDITIONS_CODES] as const);

export const COHORT_100_ADDITIONS_METADATA: Record<string, CollegeMeta> = {
  "1115": { code: "1115", name: "SriRam Engineering College, Perumalpattu, Veppampattu R.S., Tiruvallur District, Chennai-602024.", type: "SFC", district: "Thiruvallur", aliases: [] },
  "1137": { code: "1137", name: "Annai Mira College of Engineering and Technology, Arappakkam Village, Arcot Road, Walaja Taluk, Vellore District-632517.", type: "SFC", district: "Ranipet", aliases: [] },
  "1140": { code: "1140", name: "Jeppiaar Institute of Technology (Autonomous), Jeppiaar Nagar, Kunnam Village,Sriperumbudur Taluk, Kanchipuram- 631604.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1217": { code: "1217", name: "Sree Sastha Institute of Engineering and Technology, Chennai-Bangalore Highway, Chembarambakkam, Thiruvallur District, Chennai-600123.", type: "SFC", district: "Tiruvallur", aliases: [] },
  "1226": { code: "1226", name: "P.T.Lee Chengalvaraya Naicker College of Engineering and Technology, Oovery, Veliyur Post, Kanchipuram District- 631502.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1232": { code: "1232", name: "ARM College of Engineering and Technology, Sattamangalam,Maraimalainagar Post, Chengalpattu Taluk, Kanchipuram Dist-603209.", type: "SFC", district: "Chengalpet", aliases: [] },
  "1233": { code: "1233", name: "Adhi College of Engineering and Technology (Autonomous), No. 6, Munu Adhi Nagar, Sankarapuram, Puliambakkam Post, Near Wallajabad Kancheepuram- 631605.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1238": { code: "1238", name: "GRT Institute of Engineering and Technology (Autonomous), GRT Mahalakshmi Nagar, Chennai- Tirupathi Highway, Tiruttani, Thiruvallur-631209.", type: "SFC", district: "Tiruvallur", aliases: [] },
  "1325": { code: "1325", name: "St. Joseph College of Engineering, Trinity Campus, Nemili B Beemanthangal Village, Sriperumbudur, Kancheepuram District, Chennai-602105.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1412": { code: "1412", name: "Mailam Engineering College, Mailam, Tindivanam Taluk, Villupuram District-604304.", type: "SFC", district: "Viluppuram", aliases: [] },
  "1420": { code: "1420", name: "Tagore Engineering College, Rathinamangalam, Vandalur, Kanchipuram, Chennai-600127.", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1421": { code: "1421", name: "V.R.S. College of Engineering and Technology, Arasur & Post, Ulundurpet Taluk, Villupuram District-607107.", type: "SFC", district: "Viluppuram", aliases: [] },
  "1423": { code: "1423", name: "Asan Memorial College of Engineering and Technology, Asan Nagar, 9th kilometer, Chengalpattu - Mahabalipuram Highway, Post Box No.6, Chengalpattu-603001.", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1424": { code: "1424", name: "Dhaanish Ahmed College of Engineering (Autonomous), Dhaanish Nagar, Vanchuvancherry, Padappai(Near Tambaram), Sriperumbudur Taluk, Kancheepuram District- 601301.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1434": { code: "1434", name: "Surya Group of Institutions, NH-45, GST Road, Vikiravandi, Villupuram-605652.", type: "SFC", district: "Viluppuram", aliases: [] },
  "1442": { code: "1442", name: "Prince Dr. K. Vasudevan College of Engineering and Technology (Autonomous), Medavakkam-Mambakkam Road, Ponmar, Chennai-600127.", type: "SFC", district: "Chengalpattu", aliases: [] },
  "1501": { code: "1501", name: "Adhiparasakthi College of Engineering, G.B.Nagar, Kalavai, Arcot Taluk, Vellore District-632506.", type: "SFC", district: "Ranipet", aliases: [] },
  "1507": { code: "1507", name: "Ganadipathy Tulsi's Jain Engineering College, Chittoor- Cuddalore Road, Kaniyambadi, Vellore-632102.", type: "SFC", district: "Vellore", aliases: [] },
  "1509": { code: "1509", name: "Meenakshi College of Engineering, 12,Vembuli Amman Koil Street, West K K Nagar, Chennai-600078.", type: "SFC", district: "Chennai", aliases: [] },
  "1517": { code: "1517", name: "Thirumalai Engineering College, Kilambi, Krishnapuram Post, Kanchipuram-631551.", type: "SFC", district: "Kanchipuram", aliases: [] },
  "1605": { code: "1605", name: "Idhaya Engineering College for Women, Nainarpalayam Road,Chinna Salem, Villupuram District.-606201.", type: "SFC", district: "Kallakurichi", aliases: [] },
  "2345": { code: "2345", name: "Dhirajlal Gandhi College of Technology (Autonomous), Sikkanampatty, Opposite to Airport,Omalur Taluk, Salem District-636309.", type: "SFC", district: "Salem", aliases: [] },
  "2349": { code: "2349", name: "Dhaanish Ahmed Institute of Technology (Autonomous), Pitchanur Village, Coimbatore-641018.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2354": { code: "2354", name: "Pollachi Institute of Engineering and Technology, 107/1, Poosaripatti Village, Pollachi to Dharapuram road, Poosaripatti(post) Pollachi, Coimbatore-642205.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2357": { code: "2357", name: "V.S.B. College of Engineering Technical Campus (Autonomous), S.F. No.91/2A,91/2B,252, 253/1, Solavampalayam Village, Kinathukadavu, Pollachi Taluk, Coimbatore District-642109.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2623": { code: "2623", name: "Mahendra College of Engineering (Autonomous), 12th KM Attur Main Road, Minnampalli, Salem-636106.", type: "SFC", district: "Salem", aliases: [] },
  "2627": { code: "2627", name: "Selvam College of Technology (Autonomous), Salem Road NH-7, Pappinaickenpatti (Post), Ponnusamy Nagar, Namakkal (Tk & Dt)-637003.", type: "SFC", district: "Namakkal", aliases: [] },
  "2628": { code: "2628", name: "Paavai College of Engineering, Paavai Nagar, NH-7,Pachal, Namakkal-637018.", type: "SFC", district: "Namakkal", aliases: [] },
  "2630": { code: "2630", name: "Chettinad College of Engineering and Technology, NH-67, Karur to Trichy Highways, Puliyur CF, Karur-639114.", type: "SFC", district: "Karur", aliases: [] },
  "2632": { code: "2632", name: "Mahendra Institute of Technology (Autonomous), Mahendhirapuri, Mallasamudram West, Vadugapalayam Post, Tiruchengodu Taluk, Namakkal District-637503.", type: "SFC", district: "Namakkal", aliases: [] },
  "2635": { code: "2635", name: "CMS College of Engineering, CMS Nagar, Eranapuram Post, Namakkal-637003.", type: "SFC", district: "Namakkal", aliases: [] },
  "2639": { code: "2639", name: "R P Sarathy Institute of Technology (Autonomous) , Poosaripatty(PO), Omalur Taluk, Salem-636305.", type: "SFC", district: "Salem", aliases: [] },
  "2640": { code: "2640", name: "Jayalakshmi Institute of Technology, Thoppur, Dharmapuri District-636352.", type: "SFC", district: "Dharmapuri", aliases: [] },
  "2643": { code: "2643", name: "Bharathiyar Institute of Engineering for Women (Autonomous), 43/3, Deviyakurichi, Attur Taluk,Salem District-636112.", type: "SFC", district: "Salem", aliases: [] },
  "2646": { code: "2646", name: "Tagore Institute of Engineering and Technology, Salem- Chennai Bye Pass Road, Deviyakurichi (Po), Attur (Tk), Salem (Dt)-636112.", type: "SFC", district: "Salem", aliases: [] },
  "2652": { code: "2652", name: "AL-Ameen Engineering College (Autonomous), Karundevanpalayam, Nanjai Uthukkuli Post, Erode District- 638104.", type: "SFC", district: "Erode", aliases: [] },
  "2673": { code: "2673", name: "Sree Sakthi Engineering College (Autonomous), 899/1 & 898/2, Bettathapuram, Bilichi Village, Karamadai, Coimbatore-641104.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2713": { code: "2713", name: "M.P.Nachimuthu M.Jaganathan Engineering College (Autonomous), Chennimalai, Erode-638112.", type: "SFC", district: "Erode", aliases: [] },
  "2721": { code: "2721", name: "Tamilnadu College of Engineering, Palanisame Ravi Nagar, Karumathampatti Post, Coimbatore-641659.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2729": { code: "2729", name: "Nehru Institute of Engineering and Technology (Autonomous), Nehru Gardens, Thirumalayampalayam (Post), Coimbatore-641105.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2731": { code: "2731", name: "RVS College of Engineering and Technology (Autonomous), Kumaran Kottam Campus, Kannampalayam Post, Coimbatore-641402.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2732": { code: "2732", name: "Info Institute of Engineering (Autonomous), S F No.194- 200, N.H.209, Sathy Road, Sarakarsamakulam, Kovilpalayam, Coimbatore-641107.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2741": { code: "2741", name: "P A College of Engineering and Technology (Autonomous), Palladam Road, Pollachi, Coimbatore Dt.-642002.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2744": { code: "2744", name: "Adithya Institute of Technology (Autonomous), S.F.No. 348/1,349/1, Kurumbapalayam, SS Kulam(PO), Coimbatore-641107.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2745": { code: "2745", name: "Kathir College of Engineering (Autonomous), WISDOM TREE, Avinashi Road, Neelambur, Coimbatore-641062.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2749": { code: "2749", name: "Easa College of Engineering and Technology (Autonomous), NH-47, Palakkad main Road, Navakkarai Post, Coimbatore-641105.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2752": { code: "2752", name: "Nandha College of Technology (Autonomous), 235, Chennimalaipalayam Road, Pitchandampalayam Post, Veppampalayam Village, Erode-638052.", type: "SFC", district: "Erode", aliases: [] },
  "2753": { code: "2753", name: "PPG Institute of Technology (Autonomous), Rathnagiri Road, Saravanampatti, Coimbatore-641035.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2755": { code: "2755", name: "Nehru Institute of Technology (Autonomous), Jawahar Gardens, Kaliapuram, Thirumalayampalayam, Coimbatore- 641105.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2762": { code: "2762", name: "Jansons Institute of Technology (Autonomous), SF.NO.443/1,2, 442/1A & 442/1B Karumathampatty, Coimbatore-641659.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2763": { code: "2763", name: "Akshaya College of Engineering and Technology (Autonomous), SF No.112/1CPT,114/1,115/1,116/2C, Bagavathipalayam Road,Kinathukadavu, Coimbatore- 642109.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2769": { code: "2769", name: "JCT College of Engineering and Technology (Autonomous), Pichanur, Coimbatore South Taluk, Coimbatore-641105.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2770": { code: "2770", name: "Studyworld College of Engineering, Alagu Nachiamman Koil Road, Palathurai Post, Coimbatore-641105.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2776": { code: "2776", name: "R V S Technical Campus Coimbatore (Autonomous), Kumaran Kottam Campus, Kannampalayam, Sulur, Coimbatore-641402.", type: "SFC", district: "Coimbatore", aliases: [] },
  "2777": { code: "2777", name: "HINDUSTHAN COLLEGE OF ENGINEERING, CHENNIMALAI ROAD, INGUR, PERUNDURAI, ERODE - 638052", type: "SFC", district: "Erode", aliases: [] },
  "3410": { code: "3410", name: "Krishnasamy College of Engineering and Technology, Nellikuppam Main Road, S.Kumarapuram, Cuddalore- 607109.", type: "SFC", district: "Cuddalore", aliases: [] },
  "3454": { code: "3454", name: "Sri Ramakrishna College of Engineering, Sri Saradha Nagar, NH - 45, Perambalur-621113.", type: "SFC", district: "Perambalur", aliases: [] },
  "3477": { code: "3477", name: "SRI VIGNESH COLLEGE OF ENGINEERING AND TECHNOLOGY, TRICHY - CHENNAI TRUNK ROAD, KOOTHUR - POST, KOOTHUR, TIRUCHIRAPPALLI, TAMIL NADU, 621216", type: "SFC", district: "Trichirappalli", aliases: [] },
  "3782": { code: "3782", name: "OASYS Institute of Technology, Tiruchirappalli-Thuraiyur Mani Road, Pulivalam P.O Musiri Taluk, Tiruchirappalli- 621006.", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3804": { code: "3804", name: "Arasu Engineering College, Chennai Main Road, Thiruvisanallur - Village, Thiruvidaimaruthur - Taluk, Kumbakonam,Thanjavur-612501.", type: "SFC", district: "Thanjavur", aliases: [] },
  "3810": { code: "3810", name: "MAM College of Engineering, Trichy-Chennai Trunk Road, Siruganur, Tiruchirappalli-621105.", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3812": { code: "3812", name: "Mookambigai College of Engineering, Srinivasa Nagar, Kalamavur (PO), Keeranur, Pudukkottai-622502.", type: "SFC", district: "Pudukkottai", aliases: [] },
  "3825": { code: "3825", name: "St. Joseph's College of Engineering and Technology, A.S.Nagar, Ellupatti, Rawasapatti Post, Inathukanpatti Village, Thanjavur-613403.", type: "SFC", district: "Thanjavur", aliases: [] },
  "3829": { code: "3829", name: "M.A.M. College of Engineering and Technology, Trichy- Chennai Trunk Road, Siruganur, Manachanallur Taluk, Tiruchirappalli-621105.", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3831": { code: "3831", name: "Indra Ganesan College of Engineering (Autonomous), Madurai Main Road, Manikandam, Tiruchirappalli-620012.", type: "SFC", district: "Tiruchirappalli", aliases: [] },
  "3846": { code: "3846", name: "Mother Terasa College of Engineering and Technology, Mettusalai, Illuppur (Post & Taluk), Pudukkottai District- 622102.", type: "SFC", district: "Pudukkottai", aliases: [] },
  "3848": { code: "3848", name: "Vandayar Engineering College, Pulavarnatham (Post), Mariammankovil (via), Nagai Main Road, Thanjavur- 613501.", type: "SFC", district: "Thanjavur", aliases: [] },
  "3852": { code: "3852", name: "Sri Bharathi Engineering College for Women, Aranthangi Road, Kaikurichi, Alangudi Taluk, Pudukkottai-622303.", type: "SFC", district: "Pudukkottai", aliases: [] },
  "3857": { code: "3857", name: "Meenakshi Ramaswamy Engineering College, M.R.Kalvi Nagar, Thathanur Post, Udayarpalayam Taluk, Ariyalur District-621804.", type: "SFC", district: "Ariyalur", aliases: [] },
  "3860": { code: "3860", name: "St.Anne's College of Engineering and Technology, Anguchettypalayam, Siruvathur Post, Panruti Taluk, Cuddalore District-607110.", type: "SFC", district: "Cuddalore", aliases: [] },
  "4675": { code: "4675", name: "Universal College of Engineering and Technology, Anbagam Campus, Kadambankulam, Villakku, Radhapuram Road, Vallioor, Tirunelveli-627117.", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4676": { code: "4676", name: "Renganayagi Varatharaj College of Engineering, Salvarpatti Village & Post, Thayilpatti Via, Sivakasi Taluk, Virudhunagar-626128.", type: "SFC", district: "Virudhunagar", aliases: [] },
  "4677": { code: "4677", name: "Arunachala Hitech Engineering College (formerly Lourdes Mount College of Engineering and Technology), Marthandam-Karungal Road, Chundavilai Mullanganavilai, Nattalam Post, Nattalam, Kanyakumari -629195.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4686": { code: "4686", name: "Good Shepherd College of Engineering and Technology, Maruthamparai, Kaliyal Village, Kaliyal, Kanyakumari- 629151.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4864": { code: "4864", name: "V V College of Engineering, V.V. Nagar, Arasur Village, Idaichivilai Post, Sathankulam Taluk, Tuticorin District, Tirunelveli-628656.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4928": { code: "4928", name: "Mar Ephraem College of Engineering and Technology, Malankara Hills, Elavuvillai, Kanyakumari-629171.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4931": { code: "4931", name: "Grace College of Engineering , Chandy Nagar, Mullakkadu, Thoothukudi -628005.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4933": { code: "4933", name: "St. Mother Theresa Engineering College, Vagaikulam, Mudivaithanendal Post, Tuticorin District-628102.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4944": { code: "4944", name: "Arunachala College of Engineering for Women, Thanka Gardens, Manavilai, Vellichanthai, Nagercoil, Kanyakumari District-629203.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4952": { code: "4952", name: "C.S.I. Institute of Technology, Thovalai & PO, Kanyakumari District, Nagercoil-629302.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4954": { code: "4954", name: "Dr Sivanthi Aditanar College of Engineering, Tirunelveli Road, Tiruchendur, Thoothukudi-628215.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4957": { code: "4957", name: "Jayaraj Annapackiam CSI College of Engineering, Margoschis Nagar, Nazareth, Thoothukudi District-628617.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4961": { code: "4961", name: "Nellai College of Engineering , Maruthakulam P.O, Nanguneri Taluk, Tirunelveli-627151.", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4966": { code: "4966", name: "PET Engineering College, Thiruchendur Road, Vallioor, Tirunelveli -627117.", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4969": { code: "4969", name: "SCAD College of Engineering and Technology, Scad Nagar, Cheranmahadevi, Tirunelveli-627414.", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4975": { code: "4975", name: "Dr G.U. Pope College of Engineering, Pope Nagar, Sawyerpuram, Thoothukudi-628251.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4976": { code: "4976", name: "Infant Jesus College of Engineering, Kamarajar Nagar, Tirunelveli-Thoothukudi Highway (NH-7A), Keelavallanadu Village, Ellanayakkan Patti Post, Srivaikundam Taluk, Thoothukudi District-628851.", type: "SFC", district: "Thoothukudi", aliases: [] },
  "4977": { code: "4977", name: "Narayanaguru College of Engineering, Chittadavu, Manjalumoodu, Vilavancode Taluk, Kuzhithurai, Kanyakumari District-629151.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4980": { code: "4980", name: "Einstein College of Engineering, Sir.C.V.Raman Nagar, Seethaparpanallur, Tirunelveli-627012.", type: "SFC", district: "Tirunelveli", aliases: [] },
  "4981": { code: "4981", name: "Ponjesly College of Engineering, Near Parvathipuram, Alamparai, Veturnimadam Post, Nagercoil-629003.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4992": { code: "4992", name: "Bethlahem Institute of Engineering, Nadutheri, Karungal, Kanyakumari-629157.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4993": { code: "4993", name: "Loyola Institute of Technology and Science, P.Bo. No.2, Thovalai - Rajavoor Road, Loyola Nagar, Theroor Village, Thovalai, Kanyakumari District-629302.", type: "SFC", district: "Kanniyakumari", aliases: [] },
  "4996": { code: "4996", name: "Sri Vidya College of Engineering and Technology, Sivakasi Main Road, P.Kumaralingapuram, Virudhunagar-626005.", type: "SFC", district: "Virudhunagar", aliases: [] },
  "5536": { code: "5536", name: "Mangayarkarasi College of Engineering, 7-1-139, 1st Street, Mangayarkarasi Nagar, Paravai, Madurai-625402.", type: "SFC", district: "Madurai", aliases: [] },
  "5546": { code: "5546", name: "Jamal Mohamed College of Engineering, NH-45, Trichy Road, Morepatty, Vadamadurai, Dindigul - 624802", type: "SFC", district: "Dindigul", aliases: [] },
  "5703": { code: "5703", name: "Christian College of Engineering and Technology, Near Check Post, Oddanchatram, Dindigul-624619.", type: "SFC", district: "Dindigul", aliases: [] },
  "5842": { code: "5842", name: "SRM Madurai College for Engineering and Technology, Pottapalayam Village, Manamadurai Taluk, Sivagangai District-630611.", type: "SFC", district: "Sivagangai", aliases: [] },
  "5902": { code: "5902", name: "Bharath Niketan Engineering College, Shri Gowri Nagar, Thimmarasanaickanoor, Aundipatti, Theni District-625536.", type: "SFC", district: "Theni", aliases: [] },
  "5924": { code: "5924", name: "Ganapathy Chettiar College of Engineering and Technology, Melakavanur (PO), Paramakudi, Ramanathapuram District-623706.", type: "SFC", district: "Ramanathapuram", aliases: [] },
  "5988": { code: "5988", name: "Theni Kammavar Sangam College of Technology, Theni Main road, Koduvilarpatti (PO), Veerapandi(Via), Theni District-625534.", type: "SFC", district: "Theni", aliases: [] },
};

export const COHORT_300_METADATA: Record<string, CollegeMeta> = {
  ...COHORT_200_METADATA,
  ...COHORT_100_ADDITIONS_METADATA,
};
