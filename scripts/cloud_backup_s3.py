import os
import sys
import sqlite3
import datetime
import shutil
import boto3
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "prisma", "examforge.db")
BACKUP_DIR = os.path.join(os.path.dirname(__file__), "..", "prisma", "backups")
BUCKET_NAME = os.getenv("AWS_BACKUP_S3_BUCKET", "examforge-persistent-cloud-backups")
REGION = os.getenv("AWS_REGION", "ap-south-1")

def perform_cloud_backup():
    print("=" * 60)
    print("STARTING PERSISTENT CLOUD S3 BACKUP")
    print("=" * 60)

    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        return False

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    local_backup_name = f"examforge_backup_{timestamp}.db"
    local_backup_path = os.path.join(BACKUP_DIR, local_backup_name)

    # 1. Checkpoint WAL and copy database safely
    try:
        con = sqlite3.connect(DB_PATH, timeout=30)
        con.execute("PRAGMA wal_checkpoint(TRUNCATE);")
        con.close()
        shutil.copy2(DB_PATH, local_backup_path)
        size_mb = os.path.getsize(local_backup_path) / (1024 * 1024)
        print(f"1. Local snapshot created: {local_backup_name} ({size_mb:.2f} MB)")
    except Exception as e:
        print(f"Error creating local snapshot: {e}")
        return False

    # 2. Upload to AWS S3
    ak = os.getenv("AWS_ACCESS_KEY_ID")
    sk = os.getenv("AWS_SECRET_ACCESS_KEY")
    if not ak or not sk:
        print("WARNING: AWS credentials not found in environment, S3 upload skipped.")
        return True

    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=ak,
            aws_secret_access_key=sk,
            region_name=REGION
        )
        s3_key_versioned = f"database/{local_backup_name}"
        s3_key_latest = "database/latest.db"

        print(f"2. Uploading to s3://{BUCKET_NAME}/{s3_key_versioned} ...")
        s3.upload_file(local_backup_path, BUCKET_NAME, s3_key_versioned)

        print(f"3. Updating s3://{BUCKET_NAME}/{s3_key_latest} ...")
        s3.upload_file(local_backup_path, BUCKET_NAME, s3_key_latest)

        print("=" * 60)
        print("SUCCESS: Database permanently backed up to AWS S3 Cloud!")
        print(f"Bucket: {BUCKET_NAME}")
        print(f"Permanent Snapshot: {s3_key_versioned}")
        print(f"Permanent Latest: {s3_key_latest}")
        print("=" * 60)
        return True
    except Exception as e:
        print(f"S3 Upload failed: {e}")
        return False

if __name__ == "__main__":
    perform_cloud_backup()
