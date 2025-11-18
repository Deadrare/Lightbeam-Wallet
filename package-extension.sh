#!/bin/bash

# Package Lightbeam Wallet Chrome Extension
# Usage: ./package-extension.sh

set -e

echo "🔧 Installing dependencies..."
yarn install --frozen-lockfile

echo "📝 Generating GraphQL types..."
yarn schema

echo "🏗️  Building extension..."
yarn build

echo "📦 Creating ZIP package..."
PACKAGE_DIR="packages"
mkdir -p $PACKAGE_DIR
cd dist
ZIP_NAME="lightbeam-wallet-$(date +%Y%m%d-%H%M%S).zip"
zip -r ../$PACKAGE_DIR/$ZIP_NAME . -x "*.map"
cd ..

echo "✅ Package created: $PACKAGE_DIR/$ZIP_NAME"
echo ""
echo "📤 Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Select your extension"
echo "3. Click 'Package' tab"
echo "4. Upload: $PACKAGE_DIR/$ZIP_NAME"
echo ""
ls -lh $PACKAGE_DIR/$ZIP_NAME
