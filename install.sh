#!/usr/bin/env bash

set -e

echo "Installing ONOFRIUS..."
echo ""

# Check node
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed. Please install Node.js (>=18) first."
    exit 1
fi

# Target directory
TARGET_DIR="${HOME}/.onofrius"

if [ -d "$TARGET_DIR" ]; then
    echo "Updating ONOFRIUS in $TARGET_DIR..."
    cd "$TARGET_DIR"
    git pull --quiet || true
else
    echo "Cloning ONOFRIUS repository..."
    git clone --quiet https://github.com/onofrius/onofrius.git "$TARGET_DIR" || {
        echo "Creating directory $TARGET_DIR..."
        mkdir -p "$TARGET_DIR"
    }
    cd "$TARGET_DIR"
fi

if [ -f "package.json" ]; then
    npm install --quiet
fi

# Run Bootstrap Engine
node bootstrap/index.js
