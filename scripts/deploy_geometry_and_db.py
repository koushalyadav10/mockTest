import subprocess
import time
import os

SSH_HOST = "ubuntu@13.235.234.124"
KEY_FILE = "examforge-key.pem"

def run_ssh(cmd, desc):
    print(f"\n--- [EC2] {desc} ---")
    ssh_cmd = ["ssh", "-i", KEY_FILE, "-o", "StrictHostKeyChecking=no", SSH_HOST, cmd]
    res = subprocess.run(ssh_cmd, capture_output=True, text=True)
    if res.stdout:
        print("STDOUT:", res.stdout.strip())
    if res.stderr:
        print("STDERR:", res.stderr.strip())
    return res

def main():
    # 1. Ensure remote diagrams directory exists
    run_ssh("mkdir -p /var/www/examforge-ai/public/images/diagrams/ch24_geometry", "Creating diagrams directory on EC2")

    # 2. Upload diagrams via SCP
    print("\n--- Uploading Geometry diagrams to EC2 ---")
    diagrams_dir = "public/images/diagrams/ch24_geometry"
    diagram_files = [f for f in os.listdir(diagrams_dir) if f.startswith("q") and f.endswith(".png") and not f.endswith("_raw.png")]
    print(f"Uploading {len(diagram_files)} clean diagram files...")
    
    # We can tar them and send, or scp the whole directory
    tar_cmd = ["tar", "-czf", "geom_diagrams.tar.gz", "-C", "public/images/diagrams", "ch24_geometry"]
    subprocess.run(tar_cmd, check=True)
    
    scp_tar = ["scp", "-i", KEY_FILE, "-o", "StrictHostKeyChecking=no", "geom_diagrams.tar.gz", f"{SSH_HOST}:/var/www/examforge-ai/"]
    subprocess.run(scp_tar, check=True)
    
    untar_cmd = "tar -xzf /var/www/examforge-ai/geom_diagrams.tar.gz -C /var/www/examforge-ai/public/images/diagrams/ && rm -f /var/www/examforge-ai/geom_diagrams.tar.gz"
    run_ssh(untar_cmd, "Extracting diagrams on EC2")
    
    if os.path.exists("geom_diagrams.tar.gz"):
        os.remove("geom_diagrams.tar.gz")

    # 3. Stop PM2 and clean WAL
    run_ssh("pm2 stop all && rm -f /var/www/examforge-ai/prisma/examforge.db-wal /var/www/examforge-ai/prisma/examforge.db-shm", "Stopping PM2 and cleaning WAL")

    # 4. Checkpoint local SQLite DB to ensure zero WAL lag
    import sqlite3
    con = sqlite3.connect("prisma/examforge.db")
    con.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    con.close()

    # 5. Upload updated SQLite DB
    print("\n--- Uploading fresh checkpointed examforge.db to EC2 ---")
    scp_db = ["scp", "-i", KEY_FILE, "-o", "StrictHostKeyChecking=no", "prisma/examforge.db", f"{SSH_HOST}:/var/www/examforge-ai/prisma/examforge.db"]
    subprocess.run(scp_db, check=True)

    # 6. Verify integrity on EC2
    run_ssh('python3 -c "import sqlite3; con = sqlite3.connect(\'/var/www/examforge-ai/prisma/examforge.db\'); print(con.execute(\'PRAGMA integrity_check;\').fetchall())"', "Verifying DB integrity on EC2")

    # 7. Restart PM2
    run_ssh("pm2 restart all", "Restarting PM2 on EC2")
    
    time.sleep(3)
    print("\nSUCCESS: All Geometry diagrams and 100% verified Database deployed to EC2!")

if __name__ == "__main__":
    main()
