import fitz

pdf_path = r'd:\Downloads2\astralitha-main\astralithamarsmoon(1) (1).pdf'
doc = fitz.open(pdf_path)
text = ''
for page in doc:
    text += page.get_text()
with open(r'd:\Downloads2\astralitha-main\astralitha_pdf_extract.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done')
