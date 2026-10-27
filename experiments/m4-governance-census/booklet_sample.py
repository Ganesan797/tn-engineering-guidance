import os,re,json
from pathlib import Path
from pypdf import PdfReader
script_dir=Path(__file__).resolve().parent
root=Path(os.environ.get('M4_CENSUS_WORK_DIR',script_dir))
source_dir=Path(os.environ.get('M4_CENSUS_SOURCE_DIR',root))
doc=PdfReader(source_dir/'college-booklet-2026.pdf')
positions=[42,50,70,90,100,101,120,140,160,180,200,220,250,270,300,320,350,380,400,420,450]
rows=[]
for n in positions:
    text=doc.pages[n-1].extract_text() or ''
    printed=re.search(r'\n(\d+)\s*$',text)
    code=re.match(r'\s*(\d+)\s*\n',text)
    row={'pdf_page':n,'printed_page':printed.group(1) if printed else None,'college_code':code.group(1) if code else None,'text':text}
    for label in ['District','Minority Status','Autonomous Status','Website','Phone/Fax','Email-ID']:
        hits=re.findall(r'(?m)^'+re.escape(label)+r'[ \t]+([^\r\n]+)',text)
        row[label]=hits[-1].strip() if hits else None
    rows.append(row)
(root/'booklet-sample.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
for r in rows: print(r['pdf_page'],r['printed_page'],r['college_code'],r['District'],r['Minority Status'],r['Autonomous Status'])
