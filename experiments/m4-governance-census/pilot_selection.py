import csv, json, os
from pathlib import Path

script_dir = Path(__file__).resolve().parent
root = Path(os.environ.get('M4_CENSUS_WORK_DIR', script_dir))
selected = [('1','CS'),('1','BY'),('1','XC'),('4','AE'),('4','CS'),
            ('1303','AD'),('1303','CS'),('1304','EC'),('1304','BM'),
            ('2603','EE'),('3018','CE'),('4967','AD')]
with (root/'pairs.csv').open(encoding='utf-8-sig', newline='') as f:
    pairs = {(r['college_code'],r['programme_code']): r for r in csv.DictReader(f)}
with (root/'code-crosswalk.csv').open(encoding='utf-8-sig', newline='') as f:
    ledger = {r['code']: r for r in csv.DictReader(f)}
records = []
for key in selected:
    row = pairs[key]
    item = ledger[key[1]]
    records.append({**row,'proposed_profile':item['profile'],'family':item['family'],
                    'catalogue_disposition':item['disposition'],
                    'source_pair_status':'LISTED_IN_2026_GENERAL_ACADEMIC_PRE_SPECIAL_RESERVATION',
                    'review_status':'HUMAN_APPROVAL_PENDING'})
with (root/'pilot-programme-pairs.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=records[0].keys())
    writer.writeheader()
    writer.writerows(records)
sample = json.loads((root/'booklet-sample.json').read_text(encoding='utf-8'))
fields = ['pdf_page','printed_page','college_code','District','Minority Status','Autonomous Status','Website']
with (root/'booklet-fields.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=fields)
    writer.writeheader()
    writer.writerows([{k:r.get(k) for k in fields} for r in sample])
