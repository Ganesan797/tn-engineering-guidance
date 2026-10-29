"""Prepare research-only directory candidates from preserved 2026 sources.

Set M4_CENSUS_SOURCE_DIR to the directory containing the two original PDFs.
This does not re-extract the matrix or write production data. No source-page
text or numerical seat fields are exported.
"""
import csv
import hashlib
import json
import os
import re
from collections import Counter, defaultdict
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent
SOURCE = Path(os.environ['M4_CENSUS_SOURCE_DIR'])
MATRIX_URL = 'https://static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf'
BOOKLET_URL = 'https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf'
EXPECTED = {'seat-matrix-2026.pdf': '85dbb154b56822fef150054e4508787d53b9f438fdf5a5532da7b3d02e547743', 'college-booklet-2026.pdf': '035dd2604fa784c0ce57379783b50eca1a0972a08a6e7811ab2ca50562ce5373'}
for name, digest in EXPECTED.items():
    assert hashlib.sha256((SOURCE / name).read_bytes()).hexdigest() == digest, name

def read(name):
    with (ROOT / name).open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def write(name, rows, columns):
    with (OUT / name).open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)

def flat(value):
    return re.sub(r'\s+', ' ', value or '').strip()

def field(text, label, next_label=None):
    if next_label:
        m = re.search(r'(?ms)^' + re.escape(label) + r'\s*(.*?)\s*^' + re.escape(next_label) + r'\b', text)
    else:
        m = re.search(r'(?m)^' + re.escape(label) + r'[ \t]+([^\r\n]+)', text)
    if not m:
        return '', 'NOT_CHECKED'
    value = flat(m.group(1))
    if value in ('', '-', '--', 'NA', 'N/A'):
        return '', 'NOT_PUBLISHED'
    return value, 'OFFICIAL_SUPPORTED'

pairs = read('pairs.csv')
cross = {r['code']: r for r in read('code-crosswalk.csv')}
coverage = {r['profile']: r for r in read('profile-coverage.csv')}
matrix = defaultdict(list)
for row in pairs:
    matrix[row['college_code']].append(row)

doc = PdfReader(SOURCE / 'college-booklet-2026.pdf')
details = {}
page_exceptions = []
for index in range(41, len(doc.pages)):
    text = doc.pages[index].extract_text() or ''
    match = re.match(r'\s*(\d{1,4})\s*\n\s*-\s*\n(.*?)\nDean/Principal', text, re.S)
    if not match:
        if text.strip():
            page_exceptions.append({'kind': 'UNMATCHED_BOOKLET_PAGE', 'college_code': '', 'detail': 'Nonempty page did not match detail header', 'source_pdf_page': str(index + 1)})
        continue
    code = match.group(1)
    if code in details:
        page_exceptions.append({'kind': 'DUPLICATE_BOOKLET_CODE', 'college_code': code, 'detail': 'Multiple detail pages; identity requires review', 'source_pdf_page': str(index + 1)})
        continue
    printed = re.search(r'\n(\d+)\s*$', text)
    details[code] = {'text': text, 'name': flat(match.group(2)), 'name_raw': match.group(2), 'pdf_page': str(index + 1), 'printed_page': printed.group(1) if printed else ''}

category_names = ['UNIVERSITY DEPARTMENTS', 'GOVERNMENT COLLEGES', 'GOVERNMENT AIDED COLLEGES', 'CECRI AND CIPET', 'CONSTITUENT COLLEGES', 'SELF FINANCING ENGINEERING COLLEGES']
heading = re.compile(r'^(' + '|'.join(category_names) + r')\s*$')
index_categories = defaultdict(list)
category = None
for index in range(1, 25):  # Category-wise index only; pages 26–41 are alphabetical.
    for line in (doc.pages[index].extract_text() or '').splitlines():
        line = line.strip()
        h = heading.match(line)
        if h:
            category = h.group(1)
            continue
        # Category index entries have an optional serial followed by a college
        # code. Codes of 1–5 occur only in the first index group and are handled
        # from their explicit numbered lines; four-digit page references cannot
        # be confused with the printed booklet pages, which are below 1000.
        m = re.match(r'^(?:\d{1,3}\s+)?(\d{4})\b', line)
        if not m and index == 1:
            m = re.match(r'^\d{1,2}\s+([1-5])\s+\D', line)
        if m and category and m.group(1) in details:
            item = (category, str(index + 1))
            if item not in index_categories[m.group(1)]:
                index_categories[m.group(1)].append(item)

prior_identities = {'1', '4', '1303', '1304', '2603', '3018', '4967'}
prior_links = {('1','CS'), ('4','CS'), ('1303','AD'), ('1303','CS'), ('1304','EC'), ('1304','BM'), ('2603','EE'), ('3018','CE'), ('4967','AD')}
district_names = ['Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram','Kanchipuram','Kanyakumari','Kanniyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Nagappattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivagangai','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Thirupathur','Tiruppur','Thiruvallur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Villupuram','Viluppuram','Virudhunagar']
district_alias = {'kancheepuram':'kanchipuram', 'kanniyakumari':'kanyakumari', 'nagappattinam':'nagapattinam', 'thiruvallur':'tiruvallur', 'villupuram':'viluppuram', 'thirupathur':'tirupathur'}
def district_key(s):
    s = s.lower().replace(' ', '')
    return district_alias.get(s, s)
field_rows = []
colleges = []
exceptions = list(page_exceptions)

def add(code, name, value, status, url, page, printed, detail=''):
    field_rows.append({'college_code': code, 'field': name, 'value': value, 'status': status, 'source_url': url, 'source_year': '2026', 'printed_page': printed, 'pdf_page': page, 'verification': 'EXTRACTED_NOT_VISUALLY_VERIFIED', 'notes': detail})

all_codes = set(matrix) | set(details)
for code in sorted(all_codes, key=int):
    m = matrix.get(code, []); b = details.get(code); page = b['pdf_page'] if b else ''; printed = b['printed_page'] if b else ''
    previous_year = bool(b and 'previous year data' in b['name'].lower())
    matrix_districts = [d for d in district_names if m and re.search(r'\b' + re.escape(d) + r'\s+district\b', m[0]['college_name_printed'], re.I)]
    booklet_district = field(b['text'].split('Dean/Principal', 1)[1], 'District')[0] if b else ''
    matrix_district = matrix_districts[-1] if matrix_districts else ''
    district_conflict = bool(matrix_district and booklet_district and district_key(matrix_district) != district_key(booklet_district))
    scope = 'MATRIX_AND_BOOKLET' if m and b else ('MATRIX_ONLY' if m else 'BOOKLET_ONLY')
    identity = 'CONFLICTING' if code == '1133' else 'NEEDS_REVIEW'
    prior = 'BOUNDED_CODE_NAME_ACCEPTED' if code in prior_identities else 'NOT_APPROVED'
    values = {}
    for name, label, next_label in [('address', 'Address', 'Taluk'), ('taluk', 'Taluk', None), ('district', 'District', None), ('pincode', 'Pincode', None), ('autonomous_status', 'Autonomous Status', None), ('minority_status', 'Minority Status', None), ('website', 'Website', None), ('phone_fax', 'Phone/Fax', None), ('email', 'Email-ID', None)]:
        # Search only below the heading: source names can begin a continuation
        # line with "District", which must not be mistaken for the field label.
        detail_text = b['text'].split('Dean/Principal', 1)[1] if b else ''
        value, status = field(detail_text, label, next_label) if b else ('', 'NOT_CHECKED')
        if code == '1133' and status == 'OFFICIAL_SUPPORTED':
            status = 'NEEDS_REVIEW'
        if previous_year and status == 'OFFICIAL_SUPPORTED':
            status = 'NEEDS_REVIEW'
        if name == 'district' and district_conflict:
            status = 'CONFLICTING'
        values[name] = value
        values[name + '_status'] = status
        add(code, name, value, status, BOOKLET_URL if b else '', page, printed, 'Booklet header says previous year data; fact year not established' if previous_year else '')
    cats = index_categories.get(code, [])
    unique = sorted({x[0] for x in cats})
    type_value = unique[0] if len(unique) == 1 else ''
    type_status = ('OFFICIAL_SUPPORTED' if len(unique) == 1 else 'CONFLICTING' if len(unique) > 1 else 'NOT_CHECKED')
    if code == '1133' and type_status == 'OFFICIAL_SUPPORTED': type_status = 'NEEDS_REVIEW'
    add(code, 'institution_type', type_value, type_status, BOOKLET_URL if cats else '', ','.join(x[1] for x in cats), '', 'Booklet index category; not inferred from name or autonomous/minority status')
    mat = m[0] if m else {}
    if m:
        add(code, 'college_code', code, 'OFFICIAL_SUPPORTED', MATRIX_URL, mat['pdf_page'], mat['printed_page'], 'Exact source code; identity decision remains separate')
        add(code, 'matrix_college_name_and_address_printed', mat['college_name_printed'], 'OFFICIAL_SUPPORTED', MATRIX_URL, mat['pdf_page'], mat['printed_page'], 'Raw combined source cell, not a normalized display name')
    if b:
        if not m:
            add(code, 'college_code', code, 'OFFICIAL_SUPPORTED', BOOKLET_URL, page, printed, 'Booklet-only code; no matrix offering inferred')
        add(code, 'booklet_college_name_printed', b['name'], 'CONFLICTING' if code == '1133' else 'OFFICIAL_SUPPORTED', BOOKLET_URL, page, printed, 'Source header; may include address')
    if scope != 'MATRIX_AND_BOOKLET':
        exceptions.append({'kind': scope, 'college_code': code, 'detail': 'No matching matrix offering is inferred from booklet presence' if not m else 'No matched booklet detail page', 'source_pdf_page': page})
    if code == '1133':
        exceptions.append({'kind':'IDENTITY_CONFLICT','college_code':code,'detail':'Matrix Annai Veilankannis / booklet Nellai Nadar; same code does not resolve identity; retain both source names','source_pdf_page':page})
    if previous_year:
        exceptions.append({'kind':'PREVIOUS_YEAR_BOOKLET_DATA','college_code':code,'detail':'Header explicitly marks previous-year data; field year and present validity require review','source_pdf_page':page})
    if district_conflict:
        exceptions.append({'kind':'DISTRICT_CONFLICT','college_code':code,'detail':'Matrix '+matrix_district+'; booklet '+booklet_district+'; retain both, display UNKNOWN','source_pdf_page':page})
        add(code, 'matrix_district_conflict', matrix_district, 'CONFLICTING', MATRIX_URL, mat['pdf_page'], mat['printed_page'], 'Matrix address text; conflicts with booklet district')
    if type_status != 'OFFICIAL_SUPPORTED':
        exceptions.append({'kind':'TYPE_'+type_status,'college_code':code,'detail':'Index category requires review; no type inferred from name','source_pdf_page':','.join(x[1] for x in cats)})
    for field_name in ('address','taluk','district','pincode','autonomous_status','minority_status','website','phone_fax','email'):
        if values[field_name+'_status'] in ('NOT_CHECKED','NOT_PUBLISHED','NEEDS_REVIEW'):
            exceptions.append({'kind':'FIELD_'+values[field_name+'_status'],'college_code':code,'detail':field_name,'source_pdf_page':page})
    colleges.append({'college_code':code,'inventory_scope':scope,'matrix_name_and_address_printed':mat.get('college_name_printed',''),'matrix_name_and_address_raw':mat.get('college_name_raw',''),'booklet_name_printed':b['name'] if b else '', 'booklet_name_raw':b['name_raw'] if b else '', 'normalized_display_name':'','identity_status':identity,'prior_identity_decision':prior,'matrix_pdf_page':mat.get('pdf_page',''),'booklet_printed_page':printed,'booklet_pdf_page':page,**values,'institution_type':type_value,'institution_type_status':type_status,'institution_type_index_pdf_page':','.join(x[1] for x in cats)})

offerings = []
for r in pairs:
    code=r['programme_code']; c=r['college_code']; x=cross[code]; profile=x['profile']; disposition=x['disposition']
    if code in ('BY','XC'): link='HOLD_VARIANT_ASSOCIATION'
    elif code in ('AE','AO'): link='HOLD_N9_IDENTITY'
    elif code in ('BP','DA','CQ','IF','ID','CJ'): link='HOLD_SCOPE'
    elif (c,code) in prior_links: link='EXISTING_BOUNDED_LINK_ACCEPTED'
    else: link='NOT_APPROVED'
    if c=='1133': link='HOLD_COLLEGE_IDENTITY_CONFLICT'
    offerings.append({'college_code':c,'programme_code':code,'programme_name_printed':r['programme_name_printed'],'programme_name_raw':r['programme_name_raw'],'delivery_variant_source_text':'; '.join(re.findall(r'\([^)]*(?:TAMIL MEDIUM|SS)[^)]*\)', r['programme_name_printed'], re.I)), 'source_year':r['source_year'],'stream':r['stream'],'stage':r['stage'],'source_url':MATRIX_URL,'printed_page':r['printed_page'],'pdf_page':r['pdf_page'],'source_row':r['source_row'],'source_status':'OFFICIAL_SUPPORTED','verification':'PRESERVED_EXTRACTION_NOT_EXHAUSTIVELY_VERIFIED','offering_approval':'NOT_APPROVED','research_profile_lead':profile,'research_family_lead':x['family'],'research_disposition':disposition,'research_profile_status':coverage.get(profile,{}).get('profile_status','NOT_CHECKED'),'association_decision':link,'explanation_approval':'NOT_APPROVED'})

write('college-candidates.csv', colleges, list(colleges[0]))
write('offering-candidates.csv', offerings, list(offerings[0]))
write('field-provenance.csv', field_rows, list(field_rows[0]))
write('exceptions.csv', exceptions, ['kind','college_code','detail','source_pdf_page'])
summary={'matrix_colleges':len(matrix),'matrix_offerings':len(pairs),'booklet_detail_colleges':len(details),'booklet_only':sorted(set(details)-set(matrix),key=int),'matrix_only':sorted(set(matrix)-set(details),key=int),'field_statuses':{f:dict(Counter(r['status'] for r in field_rows if r['field']==f)) for f in sorted({r['field'] for r in field_rows})},'exception_counts':dict(Counter(r['kind'] for r in exceptions)),'category_counts':dict(Counter(r['institution_type'] or 'UNKNOWN' for r in colleges))}
(OUT/'extraction-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
