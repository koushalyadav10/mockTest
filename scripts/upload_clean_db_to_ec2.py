import subprocess

print("Uploading clean local database to EC2...")
cmd = [
    "scp", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
    "prisma/examforge.db",
    "ubuntu@13.235.234.124:/var/www/examforge-ai/prisma/examforge.db"
]
res = subprocess.run(cmd, capture_output=True, text=True)
print("SCP STDOUT:", res.stdout)
print("SCP STDERR:", res.stderr)
print("SCP RETURNCODE:", res.returncode)

if res.returncode == 0:
    print("Checking EC2 DB integrity after upload...")
    check_cmd = [
        "ssh", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
        "ubuntu@13.235.234.124",
        "python3 -c \"import sqlite3; con = sqlite3.connect('/var/www/examforge-ai/prisma/examforge.db'); print(con.execute('PRAGMA integrity_check;').fetchall())\""
    ]
    check_res = subprocess.run(check_cmd, capture_output=True, text=True)
    print("INTEGRITY CHECK ON EC2:", check_res.stdout)
