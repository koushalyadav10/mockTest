#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 EXAMFORGE AI - AUTOMATED AWS EC2 PRODUCTION DEPLOYMENT"
echo "=========================================================="

# 1. Update OS packages
echo "📦 Updating OS packages..."
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# 2. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "⚡ Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 process manager
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 4. Install Project Dependencies
echo "📥 Installing application dependencies..."
npm install --legacy-peer-deps

# 5. Database Schema & Prisma Generation
echo "🗄️ Initializing SQLite Database with Prisma..."
npx prisma generate
npx prisma db push

# 6. Production Next.js Build
echo "🏗️ Building Next.js production bundle..."
npm run build

# 7. Configure and Start with PM2
echo "🚀 Starting ExamForge AI with PM2..."
pm2 delete examforge-ai 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 to restart on server reboot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# 8. Setup Nginx Reverse Proxy
echo "🌐 Configuring Nginx reverse proxy..."
sudo cp nginx.conf /etc/nginx/sites-available/examforge
sudo ln -sf /etc/nginx/sites-available/examforge /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=========================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "ExamForge AI is live on port 80!"
echo "Check PM2 logs with: pm2 logs examforge-ai"
echo "=========================================================="
