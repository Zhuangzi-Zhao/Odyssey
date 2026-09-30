# scratch/read_plot_docx.py
import os
import zipfile
import xml.etree.ElementTree as ET

plot_dir = 'plot'
for filename in sorted(os.listdir(plot_dir)):
    if not filename.endswith('.docx'):
        continue
    filepath = os.path.join(plot_dir, filename)
    print(f"\n{'='*30}\nFILE: {repr(filename)}\n{'='*30}")
    try:
        with zipfile.ZipFile(filepath) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find all paragraph tags <w:p> and text <w:t>
            # Namespace is usually http://schemas.openxmlformats.org/wordprocessingml/2006/main
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in tree.iterfind('.//w:p', namespaces):
                texts = [node.text for node in p.iterfind('.//w:t', namespaces) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            full_text = '\n'.join(paragraphs)
            print(full_text)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
