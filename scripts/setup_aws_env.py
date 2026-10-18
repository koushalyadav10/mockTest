import csv
import os

csv_path = r"C:\Users\hp\Downloads\examforge-admin_accessKeys.csv"
if os.path.exists(csv_path):
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        header = [h.strip() for h in next(reader)]
        row = [r.strip() for r in next(reader)]
        data = dict(zip(header, row))
        ak = data.get("Access key ID")
        sk = data.get("Secret access key")

    with open(".env", "r", encoding="utf-8") as f:
        content = f.read()

    if "AWS_BACKUP_S3_BUCKET" not in content:
        with open(".env", "a", encoding="utf-8") as f:
            f.write(f'\n# AWS S3 Cloud Persistent Backup\nAWS_ACCESS_KEY_ID="{ak}"\nAWS_SECRET_ACCESS_KEY="{sk}"\nAWS_REGION="ap-south-1"\nAWS_BACKUP_S3_BUCKET="examforge-persistent-cloud-backups"\n')
        print("Added AWS credentials to .env")
    else:
        print("AWS credentials already in .env")
