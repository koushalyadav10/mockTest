import urllib.request
import json
import ssl
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.urlopen('https://13.235.234.124.nip.io/api/exams', context=ctx)
data = json.loads(req.read().decode('utf-8'))
exams = data.get('exams', [])
print(f"Total ExamConfigs on EC2: {len(exams)}")

math_exams = [e for e in exams if 'Maths' in e.get('title', '') or 'MATHS' in e.get('code', '') or 'Chapter' in e.get('title', '')]
print(f"Total Maths ExamConfigs on EC2: {len(math_exams)}")
for e in sorted(math_exams, key=lambda x: str(x.get('code', ''))):
    print(f"- {e.get('code')}: {e.get('title')} ({e.get('totalQuestions')} Qs)")
for e in sorted(math_exams, key=lambda x: x.get('code', '')):
    print(f"- {e.get('code')}: {e.get('title')} ({e.get('totalQuestions')} Qs)")
