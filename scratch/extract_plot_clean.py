# scratch/extract_plot_clean.py
import os
import zipfile
import xml.etree.ElementTree as ET

plot_dir = 'plot'
namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

for f in os.listdir(plot_dir):
    if not f.endswith('.docx'):
        continue
    fpath = os.path.join(plot_dir, f)
    with zipfile.ZipFile(fpath) as z:
        raw = z.read('word/document.xml')
        tree = ET.fromstring(raw)
        paragraphs = []
        for p in tree.iterfind('.//w:p', namespaces):
            texts = [node.text for node in p.iterfind('.//w:t', namespaces) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        full_text = '\n'.join(paragraphs)
        # Find chapter title from first line
        first_line = paragraphs[0] if paragraphs else "未知"
        clean_title = "".join(c for c in first_line if c.isalnum() or c in (' ', '·', '_', '—')).strip()
        out_name = f"plot_{clean_title[:30]}.txt"
        out_path = os.path.join('scratch', out_name)
        with open(out_path, 'w', encoding='utf-8') as out_f:
            out_f.write(full_text)
        print(f"Saved: {out_name} | First line: {first_line} | Chars: {len(full_text)}")
