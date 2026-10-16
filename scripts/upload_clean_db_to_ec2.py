import subprocess

print("1. Stopping PM2 and removing old wal/shm on EC2...")
stop_cmd = [
    "ssh", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
    "ubuntu@13.235.234.124",
    "pm2 stop all && rm -f /var/www/examforge-ai/prisma/examforge.db-wal /var/www/examforge-ai/prisma/examforge.db-shm"
]
res1 = subprocess.run(stop_cmd, capture_output=True, text=True)
print("Stop output:", res1.stdout)

print("2. Uploading fresh checkpointed examforge.db to EC2...")
scp_cmd = [
    "scp", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
    "prisma/examforge.db",
    "ubuntu@13.235.234.124:/var/www/examforge-ai/prisma/examforge.db"
]
res2 = subprocess.run(scp_cmd, capture_output=True, text=True)
print("SCP returncode:", res2.returncode)

print("3. Checking EC2 DB integrity...")
check_cmd = [
    "ssh", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
    "ubuntu@13.235.234.124",
    'python3 -c "import sqlite3; con = sqlite3.connect(\'/var/www/examforge-ai/prisma/examforge.db\'); print(con.execute(\'PRAGMA integrity_check;\').fetchall())"'
]
res3 = subprocess.run(check_cmd, capture_output=True, text=True)
print("INTEGRITY CHECK ON EC2:", res3.stdout)

print("4. Restarting PM2 on EC2...")
start_cmd = [
    "ssh", "-i", "examforge-key.pem", "-o", "StrictHostKeyChecking=no",
    "ubuntu@13.235.234.124",
    "pm2 restart all"
]
res4 = subprocess.run(start_cmd, capture_output=True, text=True)
print("Restart output:", res4.stdout)
print("DEPLOYMENT TO EC2 COMPLETE!")
