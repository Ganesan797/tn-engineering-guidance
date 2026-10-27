import csv,json,re,collections,os
from pathlib import Path
script_dir=Path(__file__).resolve().parent
root=Path(os.environ.get('M4_CENSUS_WORK_DIR',script_dir))
repo=Path(os.environ.get('M4_CENSUS_REPO',script_dir.parents[1]))
sample=json.loads((root/'booklet-sample.json').read_text(encoding='utf-8'))
pairs=list(csv.DictReader((root/'pairs.csv').open(encoding='utf-8-sig')))
codes={r['code']:r for r in csv.DictReader((root/'code-crosswalk.csv').open(encoding='utf-8-sig'))}
profiles={r['profile']:r for r in csv.DictReader((root/'profile-coverage.csv').open(encoding='utf-8-sig'))}
matrix_colleges={r['college_code'] for r in pairs}
base={r['tnea_college_code'] for r in csv.DictReader((repo/'data/colleges.csv').open(encoding='utf-8'))}
minimum_positions={42,50,100,101,140,200,250,300,350,400,420}
minimum={r['college_code'] for r in sample if r['pdf_page'] in minimum_positions}|base
def profile_set(ids):
    return {codes.get(r['programme_code'],{}).get('profile') for r in pairs if r['college_code'] in ids} & set(profiles)
preferred=set(minimum)
for _ in range(10):
    covered=profile_set(preferred)
    candidates=matrix_colleges-preferred
    # Analysis selection for breadth only, never student ranking or claim of suitability.
    gains={c:len(profile_set({c})-covered) for c in candidates}
    best=sorted(candidates,key=lambda c:(-gains[c],int(c)))[0]
    preferred.add(best)
sets={'minimum':minimum,'preferred':preferred}
all_results={}
for name,ids in sets.items():
    selected=[r for r in pairs if r['college_code'] in ids]
    p=collections.defaultdict(set)
    for r in selected:
        entry=codes.get(r['programme_code'],{})
        if entry.get('profile') in profiles: p[entry['profile']].add(r['college_code'])
    books=[r for r in sample if r['college_code'] in ids]
    # Conflicting official district labels for 1303 and 4967 require reconciliation.
    conflict_ids={'1303','4967'}
    district=collections.Counter(r['District'].upper() for r in books if r['District'] and r['college_code'] not in conflict_ids)
    district_pairs=collections.Counter()
    for b in books:
        if b['District'] and b['college_code'] not in conflict_ids: district_pairs[b['District'].upper()]+=sum(r['college_code']==b['college_code'] for r in selected)
    status=lambda field:dict(collections.Counter(r[field] or 'UNKNOWN' for r in books))
    result={'proposed_college_ids':sorted(ids,key=int),'colleges_in_matrix':len(ids & matrix_colleges),'not_in_matrix':sorted(ids-matrix_colleges),'pair_count':len(selected),'potential_profile_count':len(p),'multiple_college_profiles':sum(len(v)>1 for v in p.values()),'single_college_profiles':sum(len(v)==1 for v in p.values()),'families':dict(collections.Counter(profiles[k]['family'] for k in p)),'combined_hold_profiles':sum(profiles[k]['profile_status']=='HOLD_EVIDENCE_OR_IDENTITY' for k in p),'booklet_sample_count':len(books),'districts':dict(district),'pairs_by_district':dict(district_pairs),'unknown_district_count':len(ids)-sum(district.values()),'district_conflicts':sorted(ids & conflict_ids),'autonomy':status('Autonomous Status'),'minority':status('Minority Status'),'management':'NOT_RECONCILED'}
    all_results[name]=result
    with (root/(name+'-cohort-pairs.csv')).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(selected[0]));w.writeheader();w.writerows(selected)
(root/'cohort-summary.json').write_text(json.dumps(all_results,indent=2),encoding='utf-8')
print(json.dumps(all_results,indent=2))
