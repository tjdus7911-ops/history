"""Collect original evidence. Text/answer matching alone never marks an exam verified."""
import hashlib
import json
import re
import sys
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium

repo = Path(__file__).resolve().parent.parent
destination = Path(sys.argv[1])
destination.mkdir(parents=True, exist_ok=True)
research = json.loads((repo / 'docs/PROTO_REBUILD_OFFICIAL_RESEARCH.json').read_text(encoding='utf-8'))
catalog = json.loads((repo / 'dist/official-exam-catalog.json').read_text(encoding='utf-8'))
catalog = {row['officialQuestionId']: row for row in catalog}
explanations = json.loads((repo / 'dist/official-exam-explanations.json').read_text(encoding='utf-8'))
explanations = {row['officialQuestionId']: row for row in explanations['records']}
sources = {row['examRound']: row for row in research['sources'] if row['examLevel'] == '심화'}
files = {}
for file in Path('D:/').glob('*.pdf'):
    if '심화' not in file.name:
        continue
    match = re.search(r'(\d+)회', file.name)
    if match:
        kind = 'question' if '문제' in file.name else 'answer' if any(word in file.name for word in ['정답', '답지']) else None
        if kind:
            files.setdefault(int(match[1]), {})[kind] = file

audit = {'status': 'evidence-collected-not-visually-verified', 'sources': [], 'questions': []}
for round_number, pair in sorted(files.items()):
    if not {'question', 'answer'} <= pair.keys():
        continue
    official = sources.get(round_number, {})
    hashes = {kind: hashlib.sha256(file.read_bytes()).hexdigest() for kind, file in pair.items()}
    known_hashes = {file['sha256'] for file in official.get('files', [])}
    prefix = f'{round_number}-advanced'
    folder = destination / prefix
    folder.mkdir(exist_ok=True)
    answers = {}
    with pdfplumber.open(pair['answer']) as pdf:
        answer_text = '\n'.join(page.extract_text() or '' for page in pdf.pages)
        for number, answer, points in re.findall(r'(?<!\d)(\d{1,2})\s*([①②③④⑤])\s*([123])(?!\d)', answer_text):
            number = int(number)
            value = '①②③④⑤'.index(answer)
            if number in answers and answers[number] != value:
                raise ValueError(f'Conflicting official answers {prefix}/{number}')
            answers[number] = value
    document = pdfium.PdfDocument(pair['answer'])
    for page_index in range(len(document)):
        document[page_index].render(scale=1.8).to_pil().convert('RGB').save(folder / f'answer-{page_index+1}.jpg', quality=94)
    document.close()
    source_record = {'examRound': round_number, 'officialSourceUrl': official.get('officialSourceUrl'),
        'files': {kind: {'path': str(file), 'sha256': hashes[kind], 'matchesPreviouslyDownloadedOfficialFile': hashes[kind] in known_hashes} for kind, file in pair.items()},
        'parsedAnswerCount': len(answers), 'answersZeroBased': answers,
        'answerText': answer_text, 'visualVerification': 'pending'}
    audit['sources'].append(source_record)
    raster = pdfium.PdfDocument(pair['question'])
    with pdfplumber.open(pair['question']) as pdf:
        for page_index, page in enumerate(pdf.pages[:4]):
            bitmap = raster[page_index].render(scale=1.8).to_pil().convert('RGB')
            bitmap.save(folder / f'page-{page_index+1}.jpg', quality=93)
            for side in (0, 1):
                left, right = page.width * side / 2, page.width * (side+1) / 2
                headers = page.crop((left, 0, right, page.height)).search(r'(?m)^(\d{1,2})\.\s', regex=True)
                headers = [header for header in headers if 1 <= int(header['groups'][0]) <= 20]
                for index, header in enumerate(headers):
                    number = int(header['groups'][0])
                    top = max(0, header['top'] - 3)
                    bottom = headers[index+1]['top'] - 4 if index+1 < len(headers) else page.height - 23
                    text = page.crop((left, top, right, bottom)).extract_text() or ''
                    question_id = f'official-{prefix}-{number:02}'
                    candidate = catalog.get(question_id, {})
                    marks = list(re.finditer(r'[①②③④⑤]', text))[-5:]
                    options = [text[mark.end():marks[i+1].start() if i+1 < len(marks) else len(text)].strip() for i, mark in enumerate(marks)]
                    image_path = folder / f'{number:02}.jpg'
                    bitmap.crop(tuple(round(value*1.8) for value in (left, top, right, bottom))).save(image_path, quality=95)
                    audit['questions'].append({'questionId': question_id, 'examRound': round_number, 'questionNumber': number,
                        'sourcePage': page_index+1, 'bbox': [left, top, right, bottom], 'text': text, 'extractedOptions': options,
                        'answerZeroBased': answers.get(number), 'catalogAnswer': candidate.get('answer'),
                        'catalogAnswerMatchesOriginal': number in answers and candidate.get('answer') == answers[number],
                        'catalogQuestionImage': candidate.get('questionImage'), 'evidenceImage': str(image_path),
                        'existingExplanation': explanations.get(question_id, {}).get('explanation'),
                        'verificationStatus': 'pending-visual-question-answer-and-option-review'})
    raster.close()
    (destination / 'official-evidence-audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{prefix}: {len(answers)} extracted answers; {len(audit["questions"])} total evidence crops', flush=True)
