# scratch/analyze_plot.py
import os
import zipfile
import xml.etree.ElementTree as ET

plot_dir = 'plot'
files = sorted(os.listdir(plot_dir))

for filename in files:
    if not filename.endswith('.docx'):
        continue
    filepath = os.path.join(plot_dir, filename)
    with zipfile.ZipFile(filepath) as z:
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for p in tree.iterfind('.//w:p', namespaces):
            texts = [node.text for node in p.iterfind('.//w:t', namespaces) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        # Save to txt for easy inspection
        out_name = os.path.splitext(filename)[0] + '.txt'
        out_path = os.path.join('scratch', out_name)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(paragraphs))
        print(f"Extracted: {filename} -> {out_name} ({len(paragraphs)} paragraphs, {sum(len(p) for p in paragraphs)} chars)")
