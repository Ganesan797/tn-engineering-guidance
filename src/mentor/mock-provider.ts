import { MAX_RESPONSE_LENGTH, type BoundedExplanationContext, type MentorProvider } from "./types.ts";

function roundLabel(round: string, ta: boolean): string {
  if (round === "ROUND_1") return ta ? "சுற்று 1" : "Round 1";
  if (round === "ROUND_2") return ta ? "சுற்று 2" : "Round 2";
  if (round === "ROUND_3") return ta ? "சுற்று 3" : "Round 3";
  return ta ? "கிடைத்த சுற்றுகள்" : "Available Rounds";
}

function quotaLabel(quota: string, ta: boolean): string {
  return quota === "GOVT_SCHOOL_7_5"
    ? ta ? "7.5% அரசுப் பள்ளி ஒதுக்கீடு" : "7.5% Govt School Quota"
    : ta ? "பொதுக் கல்விப் பிரிவு" : "General Academic";
}

function clampResponse(text: string): string {
  return text.length <= MAX_RESPONSE_LENGTH ? text : text.slice(0, MAX_RESPONSE_LENGTH - 1) + "…";
}

export class MockMentorProvider implements MentorProvider {
  public readonly name = "mock" as const;

  public explain(context: BoundedExplanationContext, question: string): string {
    const ta = context.language === "ta";

    // Neutral "which college is best?" handling
    if (/(best college|which college is best|சிறந்த கல்லூரி|எது நல்ல கல்லூரி|எந்த கல்லூரி சிறந்தது)/i.test(question)) {
      return clampResponse(
        ta
          ? "எந்தக் கல்லூரி உங்களுக்குப் பொருத்தமானது என்பது துறை விருப்பம், இடம், செலவு, விடுதி, பயணம் மற்றும் குடும்ப முன்னுரிமைகளைப் பொறுத்தது. நீங்கள் தேர்ந்தெடுத்த விருப்பங்களை அந்த அம்சங்களின் அடிப்படையில் புரிந்துகொள்ள உதவலாம்; இறுதி முடிவு உங்களுடையதே."
          : "Which college suits you best depends on your branch interest, location, fees, hostel, commute, and family priorities. I can help compare the options you selected on those factors, while the final choice remains yours."
      );
    }

    // Explicit FILTERED_OUT state
    if (context.context_outcome === "FILTERED_OUT") {
      const first = context.selected_evidence[0];
      return clampResponse(
        ta
          ? `${first ? `${first.collegeName} (${first.collegeCode}) - ${first.programmeName} (${first.programmeCode}) ` : "இந்த விருப்பம் "}ஆளுகை செய்யப்பட்ட பட்டியலில் உள்ளது; ஆனால் நீங்கள் இப்போது தேர்வு செய்துள்ள வடிகட்டிகளால் (Filters) மறைக்கப்பட்டுள்ளது.`
          : `${first ? `${first.collegeName} (${first.collegeCode}) - ${first.programmeName} (${first.programmeCode}) ` : "This option "}exists, but your current filters are hiding it.`
      );
    }

    const items = context.selected_evidence;
    if (items.length === 0) {
      return clampResponse(
        ta
          ? "தேர்ந்தெடுக்கப்பட்ட கல்லூரி அல்லது பாடப்பிரிவுத் தகவல் இல்லை. ஒப்பீட்டு அட்டவணையிலிருந்தோ உங்கள் விருப்பப் பட்டியலிலிருந்தோ ஒரு பதிவைத் தேர்ந்தெடுத்து விளக்கம் கேளுங்கள்."
          : "No college or branch record is selected. Select an offering from the comparison table or your shortlist to view an explanation."
      );
    }

    // Explicit HELD_NEEDS_REVIEW state (e.g., College 1516)
    const heldItem = items.find((i) => i.evidenceState === "HELD_NEEDS_REVIEW");
    if (heldItem) {
      return clampResponse(
        ta
          ? `${heldItem.collegeName} (${heldItem.collegeCode}) தரவு தற்போது சரிபார்ப்பிற்காக நிறுத்திவைக்கப்பட்டுள்ளது (Held for review); இது வழிகாட்டலுக்குப் பயன்படுத்தப்படவில்லை. அதிகாரப்பூர்வ TNEA/DOTE கையேட்டில் சரிபார்க்கவும்.`
          : `This evidence for ${heldItem.collegeName} (${heldItem.collegeCode}) is currently held for review and is not used as guidance. Please check official TNEA/DOTE notices.`
      );
    }

    // Explicit NO_HISTORICAL_DATA state
    if (context.context_outcome === "NO_HISTORICAL_DATA" || context.evidence_state === "NO_HISTORICAL_DATA") {
      const first = items[0];
      return clampResponse(
        ta
          ? `${first.collegeName} (${first.collegeCode}) - ${first.programmeName} (${first.programmeCode}) படிப்புக்கு ${first.year} ${roundLabel(first.round, true)} (${quotaLabel(first.quota, true)}, ${first.community}) பிரிவில் தற்போது ஆளுகை செய்யப்பட்ட வரலாற்றுப் பதிவு இல்லை. இது அந்தப் படிப்பு கிடைக்காது என்று அர்த்தமல்ல.`
          : `No governed historical observation is currently available for ${first.collegeName} (${first.collegeCode}) - ${first.programmeName} (${first.programmeCode}) in ${first.year} ${roundLabel(first.round, false)} (${quotaLabel(first.quota, false)}, ${first.community}). This does not mean the branch is unavailable.`
      );
    }

    // Compare two explicitly selected options
    if (items.length >= 2) {
      const lines = items.slice(0, 4).map((i, idx) => {
        const markText =
          i.observedMinimumMark !== null
            ? ta
              ? `${i.observedMinimumMark.toFixed(2)} (${i.year} ${roundLabel(i.round, true)} குறைந்தபட்ச தற்காலிக ஒதுக்கீட்டு மதிப்பெண்)`
              : `${i.observedMinimumMark.toFixed(2)} (${i.year} ${roundLabel(i.round, false)} observed provisional min)`
            : ta
            ? "தரவு இல்லை"
            : "Not available";
        return `${idx + 1}. ${i.collegeName} (${i.collegeCode}) — ${i.programmeName} (${i.programmeCode}), ${i.district}: ${markText}`;
      });
      const intro = ta
        ? "நீங்கள் தேர்ந்தெடுத்த விருப்பங்களின் விவரம் (உங்கள் தேர்வு வரிசை மாற்றப்படாது):"
        : "Details of your selected options (your preference order is never altered):";
      const footer = ta
        ? "இவை முந்தைய ஆண்டு தற்காலிக ஒதுக்கீட்டுப் பதிவுகள் மட்டுமே; சேர்க்கை கணிப்பு அல்ல. பாடப்பிரிவு ஆர்வம், கட்டணம், விடுதி மற்றும் பயண தூரத்தைப் பொறுத்து குடும்பத்துடன் சேர்ந்து வரிசையை முடிவு செய்யுங்கள்."
        : "These are historical observations only, not admission predictions. Compare branch interest, fees, hostel, and travel distance with your family before deciding your order.";
      return clampResponse(`${intro} ${lines.join(" | ")}. ${footer}`);
    }

    // Single selected record explanation (simple +2 / parent-readable)
    const item = items[0];
    const markStr = item.observedMinimumMark !== null ? item.observedMinimumMark.toFixed(2) : "—";
    return clampResponse(
      ta
        ? `${item.collegeName} (${item.collegeCode}, ${item.district}) - ${item.programmeName} (${item.programmeCode}): ${item.year} ${roundLabel(item.round, true)}, ${quotaLabel(item.quota, true)} (${item.community}) பட்டியலில் காணப்பட்ட குறைந்தபட்ச தற்காலிக ஒதுக்கீட்டு மதிப்பெண் ${markStr}. இது முந்தைய ஆண்டு தற்காலிக ஒதுக்கீட்டுப் பதிவு மட்டுமே; அதிகாரப்பூர்வ இறுதி கட்-ஆஃப் அல்ல, சேர்க்கை கணிப்பும் அல்ல.`
        : `${item.collegeName} (${item.collegeCode}, ${item.district}) - ${item.programmeName} (${item.programmeCode}): Lowest observed provisional allotment mark in ${item.year} ${roundLabel(item.round, false)} (${quotaLabel(item.quota, false)}, ${item.community}) is ${markStr}. This is a historical observation only, not an official closing cutoff or admission prediction.`
    );
  }
}
