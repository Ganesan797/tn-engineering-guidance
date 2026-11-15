import json
import os

def build():
    with open('scratch/m5-t04-transient/candidates.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Collect 12 unique sources
    sources_map = {}
    sources_list = []
    for r in data:
        k = (r['source_url'], r['source_title_literal'], r['source_sha256'])
        if k not in sources_map:
            sid = len(sources_list)
            sources_map[k] = sid
            sources_list.append({
                'id': sid,
                'url': r['source_url'],
                'title': r['source_title_literal'],
                'sha256': r['source_sha256'],
                'year': int(r['source_year_literal']),
                'route': 'GA' if 'GENERAL' in r['source_route_literal'] else '7.5',
                'round': int(r['source_round_literal'].replace('ROUND ', ''))
            })

    # Map: key `${college}~${programme}~${year}~${route}~${category}` -> list of [round, minMark, count, locator, sourceId]
    lookup = {}
    for r in data:
        c = r['source_college_code_literal']
        p = r['source_programme_code_literal']
        y = int(r['source_year_literal'])
        route = 'GA' if 'GENERAL' in r['source_route_literal'] else '7.5'
        rnd = int(r['source_round_literal'].replace('ROUND ', ''))
        cat = r['source_allotted_category_literal']
        mark = r['derived_minimum_mark']
        cnt = r['allotment_count_in_bucket']
        loc = r['nonpersonal_source_locator']
        sid = sources_map[(r['source_url'], r['source_title_literal'], r['source_sha256'])]
        
        k = f"{c}~{p}~{y}~{route}~{cat}"
        if k not in lookup:
            lookup[k] = []
        lookup[k].append([rnd, mark, cnt, loc, sid])

    os.makedirs('src/m5', exist_ok=True)
    sources_json = json.dumps(sources_list, indent=2)
    lookup_json = json.dumps(lookup)

    template = """/**
 * Governed Historical Minimum Observations compiled from official TNEA Round 1-3 provisional allotment publications (2024-2025).
 * Strictly non-applicant aggregate metrics derived under D5 methodology.
 */

export interface HistoricalSource {
  readonly id: number;
  readonly url: string;
  readonly title: string;
  readonly sha256: string;
  readonly year: number;
  readonly route: "GA" | "7.5";
  readonly round: number;
}

export interface HistoricalObservation {
  readonly round: number;
  readonly minMark: number;
  readonly count: number;
  readonly locator: string;
  readonly source: HistoricalSource;
}

export const HISTORICAL_SOURCES: readonly HistoricalSource[] = __SOURCES__ as const;

// Compact format: [round, minMark, count, locator, sourceId]
const RAW_LOOKUP: Record<string, readonly [number, number, number, string, number][]> = __LOOKUP__;

export function getHistoricalObservations(
  collegeCode: string,
  programmeCode: string,
  year: number,
  route: "GA" | "7.5",
  category: string
): readonly HistoricalObservation[] {
  const key = `${collegeCode}~${programmeCode}~${year}~${route}~${category}`;
  const rows = RAW_LOOKUP[key];
  if (!rows || rows.length === 0) return [];
  return rows.map(([rnd, mark, cnt, loc, sid]) => ({
    round: rnd,
    minMark: mark,
    count: cnt,
    locator: loc,
    source: HISTORICAL_SOURCES[sid]!,
  }));
}

export function hasHistoricalRecordsForOffering(
  collegeCode: string,
  programmeCode: string
): boolean {
  const prefix = `${collegeCode}~${programmeCode}~`;
  for (const k in RAW_LOOKUP) {
    if (k.startsWith(prefix)) return true;
  }
  return false;
}
"""
    out = template.replace('__SOURCES__', sources_json).replace('__LOOKUP__', lookup_json)

    with open('src/m5/historical-data.ts', 'w', encoding='utf-8') as f:
        f.write(out)

    print(f"Generated src/m5/historical-data.ts: {os.path.getsize('src/m5/historical-data.ts') / 1024:.1f} KB")

if __name__ == '__main__':
    build()
