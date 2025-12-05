#!/bin/bash

set -e

echo "=================================="
echo "Personal Smart Dashboard Installer"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "Please do not run as root. Run as a regular user with sudo access."
  exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

# Check for .env file
if [ ! -f .env ]; then
  echo ""
  echo "Creating .env file..."
  echo ""
  
  read -p "Enter PostgreSQL DATABASE_URL (e.g., postgresql://user:pass@localhost:5432/dashboard): " DB_URL
  read -p "Enter Unifi Protect Host IP (e.g., 192.168.1.1): " UNIFI_HOST
  read -p "Enter Unifi Protect Username: " UNIFI_USER
  read -sp "Enter Unifi Protect Password: " UNIFI_PASS
  echo ""
  
  cat > .env << EOF
DATABASE_URL=${DB_URL}
UNIFI_PROTECT_HOST=${UNIFI_HOST}
UNIFI_PROTECT_USERNAME=${UNIFI_USER}
UNIFI_PROTECT_PASSWORD=${UNIFI_PASS}
NODE_ENV=production
PORT=5000
EOF

  echo ".env file created!"
else
  echo ".env file already exists, skipping..."
fi

# Run database migrations
echo ""
echo "Setting up database..."
npm run db:push

# Build the application
echo ""
echo "Building application..."
npm run build

echo ""
echo "=================================="
echo "Installation Complete!"
echo "=================================="
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "To run with PM2 (recommended for production):"
echo "  sudo npm install -g pm2"
echo "  pm2 start dist/index.js --name smart-dashboard"
echo "  pm2 save"
echo "  pm2 startup"
echo ""
echo "The app will be available at http://localhost:5000"
echo ""
