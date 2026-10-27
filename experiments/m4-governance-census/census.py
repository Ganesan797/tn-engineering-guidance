import csv, json, re, collections, hashlib, sys, os
from pathlib import Path
import pdfplumber

script_dir = Path(__file__).resolve().parent
root = Path(os.environ.get('M4_CENSUS_WORK_DIR', script_dir))
repo = Path(os.environ.get('M4_CENSUS_REPO', script_dir.parents[1]))
source_dir = Path(os.environ.get('M4_CENSUS_SOURCE_DIR', root))
catalogue = repo / 'docs/content/m4/m4_t03_comprehensive_branch_content_review_v1.md'
text = catalogue.read_text(encoding='utf-8')
ledger_text = text.split('## Full TNEA code disposition ledger')[1].split('### Held scope codes')[0]
ledger = {}
for line in ledger_text.splitlines():
    if re.match(r'^\| [A-Z]{2} \|', line):
        fields = [x.strip() for x in line.strip('|').split('|')]
        ledger[fields[0]] = dict(zip(['code','name','variant','profile','family','disposition'], fields))
profiles = {}
for m in re.finditer(r'^#### ([A-Z]{2}) — .*?\r?\n\r?\n- \*\*Codes:\*\* (.*?)\. \*\*Family:\*\* (\w)\. \*\*Status:\*\* (\w+)', text, re.M):
    profiles[m.group(1)] = {'codes':m.group(2), 'family':m.group(3), 'status':m.group(4)}

rows, anomalies, raw, corrections = [], [], [], []
def normalized(x): return ' '.join((x or '').split())
raw_path = root/'raw-tables.json'
if raw_path.exists() and '--extract' not in sys.argv:
    raw = json.loads(raw_path.read_text(encoding='utf-8'))
else:
    with pdfplumber.open(source_dir / 'seat-matrix-2026.pdf') as doc:
        for page_no, page in enumerate(doc.pages, 1):
            tables = page.extract_tables()
            if len(tables) != 1: anomalies.append({'page':page_no,'kind':'TABLE_COUNT','detail':len(tables)})
            for table in tables:
                for row_no, row in enumerate(table, 1): raw.append({'page':page_no,'row':row_no,'cells':row})
    raw_path.write_text(json.dumps(raw,ensure_ascii=False,indent=1),encoding='utf-8')
for item in raw:
    page_no,row_no,row=item['page'],item['row'],item['cells']
    if row_no == 1 and 'COLLEGE' in (row[0] or ''): continue
    if len(row) != 12:
        anomalies.append({'page':page_no,'row':row_no,'kind':'COLUMN_COUNT','detail':row}); continue
    cc, cn, pc, pn = [normalized(v) for v in row[:4]]
    # All 22 spillovers visually inspected on printed/PDF pages 25,105,106,124,125.
    if (page_no,cc) in {(25,'1140'),(105,'2342'),(106,'2342'),(124,'2612'),(125,'2612')} and re.fullmatch(r'- [A-Z]{2}',pc):
        corrections.append({'page':page_no,'row':row_no,'college':cc,'raw':pc,'corrected':pc[2:],'reason':'adjacent college-name hyphen crossed table boundary; source page visually checked'})
        restore={'1140':('Kanchipuram 631604.','Kanchipuram- 631604.'),'2342':('Thudiyalur kovilpalayam','Thudiyalur- kovilpalayam'),'2612':('Namakkal 637207.','Namakkal- 637207.')}
        before,after=restore[cc]
        if before not in cn: anomalies.append({'page':page_no,'row':row_no,'kind':'COLLEGE_HYPHEN_RESTORE_FAILED','detail':cn})
        cn=cn.replace(before,after)
        pc=pc[2:]
    issues=[]
    if not re.fullmatch(r'\d{1,4}', cc): issues.append('INVALID_COLLEGE_CODE')
    if not re.fullmatch(r'[A-Z]{2}', pc): issues.append('INVALID_PROGRAMME_CODE')
    if not cn or not pn: issues.append('MISSING_NAME')
    nums=[normalized(v) for v in row[4:]]
    if not all(v.isdigit() for v in nums): issues.append('NONNUMERIC_SEATS')
    elif sum(map(int,nums[:7])) != int(nums[7]): issues.append('SEAT_TOTAL_MISMATCH')
    for issue in issues: anomalies.append({'page':page_no,'row':row_no,'kind':issue,'detail':row})
    rows.append({'college_code':cc,'college_name_printed':cn,'programme_code':pc,'programme_name_printed':pn,'college_name_raw':row[1] or '', 'programme_name_raw':row[3] or '', 'source_year':'2026','stream':'GENERAL_ACADEMIC','stage':'BEFORE_SPECIAL_RESERVATION_COUNSELLING','printed_page':str(page_no),'pdf_page':str(page_no),'source_row':str(row_no)})
keys=collections.Counter((r['college_code'],r['programme_code']) for r in rows)
for key,n in keys.items():
    if n>1: anomalies.append({'kind':'DUPLICATE_PAIR','detail':{'key':key,'count':n}})
code_names=collections.defaultdict(set)
college_names=collections.defaultdict(set)
for r in rows:
    code_names[r['programme_code']].add(r['programme_name_printed'])
    college_names[r['college_code']].add(r['college_name_printed'])
for code,names in code_names.items():
    if len(names)>1: anomalies.append({'kind':'PROGRAMME_NAME_VARIATION','code':code,'detail':sorted(names)})
for code,names in college_names.items():
    if len(names)>1: anomalies.append({'kind':'COLLEGE_NAME_VARIATION','code':code,'detail':sorted(names)})

def write_csv(path,records):
    if not records:return
    with path.open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(records)
write_csv(root/'pairs.csv',rows)
(root/'anomalies.json').write_text(json.dumps(anomalies,ensure_ascii=False,indent=1),encoding='utf-8')
(root/'corrections.json').write_text(json.dumps(corrections,ensure_ascii=False,indent=1),encoding='utf-8')

present=set(code_names); catalogue_codes=set(ledger)
cross=[]
for code in sorted(present | catalogue_codes):
    entry=ledger.get(code,{})
    cross.append({'code':code,'in_seat_matrix':str(code in present),'in_catalogue':str(code in ledger),'catalogue_name':entry.get('name',''),'matrix_names':' | '.join(sorted(code_names.get(code,[]))),'profile':entry.get('profile',''),'family':entry.get('family',''),'disposition':entry.get('disposition','')})
write_csv(root/'code-crosswalk.csv',cross)
group={p:{'colleges':set(),'codes':set()} for p in profiles}
for r in rows:
    e=ledger.get(r['programme_code'],{})
    profile=e.get('profile')
    if profile in group:
        group[profile]['colleges'].add(r['college_code']);group[profile]['codes'].add(r['programme_code'])
profile_rows=[]
for p,v in profiles.items():
    info=group[p]
    profile_rows.append({'profile':p,'family':v['family'],'profile_status':v['status'],'college_count':len(info['colleges']),'codes_in_matrix':','.join(sorted(info['codes'])),'colleges':','.join(sorted(info['colleges']))})
write_csv(root/'profile-coverage.csv',profile_rows)
pilot=list(csv.DictReader((repo/'data/programmes.csv').open(encoding='utf-8')))
pilot_keys={(r['tnea_college_code'],r['source_branch_code']) for r in pilot}
summary={'raw_rows_including_headers':len(raw),'header_rows':sum(1 for r in raw if r['row']==1),'data_rows':len(rows),'unique_pairs':len(keys),'duplicate_keys':sum(v>1 for v in keys.values()),'colleges':len(college_names),'codes':len(present),'catalogue_codes':len(ledger),'profiles':len(profiles),'families':dict(collections.Counter(v['family'] for v in profiles.values())),'catalogue_present':len(present & catalogue_codes),'catalogue_absent':sorted(catalogue_codes-present),'extra_codes':sorted(present-catalogue_codes),'anomaly_types':dict(collections.Counter(a['kind'] for a in anomalies)),'pilot_missing':sorted(pilot_keys-set(keys)),'profile_multi':sum(len(v['colleges'])>1 for v in group.values()),'profile_single':sum(len(v['colleges'])==1 for v in group.values()),'profile_none':sum(not v['colleges'] for v in group.values()),'family_coverage':{f:{'total':sum(v['family']==f for v in profiles.values()),'multi':sum(profiles[p]['family']==f and len(v['colleges'])>1 for p,v in group.items()),'single':sum(profiles[p]['family']==f and len(v['colleges'])==1 for p,v in group.items()),'none':sum(profiles[p]['family']==f and not v['colleges'] for p,v in group.items())} for f in sorted(set(v['family'] for v in profiles.values()))}}
(root/'summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
