#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "💖 Installing Kamran Apology & Proposal App (/root/kamiii)"
echo "=========================================================="

# 1. Create target folder
mkdir -p /root/kamiii
cd /root/kamiii

# 2. Check Node.js and npm
if ! command -v node &> /dev/null; then
    echo "📥 Node.js not found. Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo " Node.js version: $(node -v)"
echo " npm version: $(npm -v)"

# 3. Unpack tarball if present in /tmp or current folder
if [ -f "/tmp/kamiii-app.tar.gz" ]; then
    tar -xzf /tmp/kamiii-app.tar.gz -C /root/kamiii
elif [ -f "./kamiii-app.tar.gz" ]; then
    tar -xzf ./kamiii-app.tar.gz -C /root/kamiii
fi

# 4. Install dependencies
echo "📦 Installing dependencies (npm install)..."
npm install --production=false

# 5. Build production bundle
echo "🔨 Building frontend production assets..."
npm run build
cp -r public/images/* dist/images/ 2>/dev/null || true

# 6. Install PM2 for 24/7 background running
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 process manager..."
    npm install -g pm2
fi

# 7. Start application on port 3001 so it never conflicts with existing project!
echo "🚀 Starting app with PM2 on port 3001..."
pm2 delete kamiii-love-app 2>/dev/null || true
PORT=3001 pm2 start "npx tsx server.ts" --name "kamiii-love-app"
pm2 save

SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "YOUR_VPS_IP")

echo ""
echo "=========================================================="
echo "🎉 SUCCESS! Your Love App is LIVE on your VPS!"
echo "=========================================================="
echo "🌐 Public Share Link (For Her - Zero Login):"
echo "   http://${SERVER_IP}:3001/"
echo ""
echo "🔒 Admin Login (Kamran Only):"
echo "   Passcode: 987778899"
echo "   Direct Admin Link: http://${SERVER_IP}:3001/?pin=987778899"
echo "=========================================================="
