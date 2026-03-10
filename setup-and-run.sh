#!/bin/bash

echo "==================================================="
echo "  NGO Fund Blockchain - Setup & Run Script"
echo "==================================================="
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 1. Install dependencies if needed
echo "[1/3] Checking dependencies..."

# Blockchain dependencies
if [ ! -d "$PROJECT_ROOT/blockchain/node_modules" ]; then
    echo "Installing Blockchain dependencies..."
    cd "$PROJECT_ROOT/blockchain" && npm install
fi

# Backend dependencies
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo "Installing Backend dependencies..."
    cd "$PROJECT_ROOT/backend" && npm install
fi

# Frontend dependencies
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "Installing Frontend dependencies..."
    cd "$PROJECT_ROOT" && npm install
fi

cd "$PROJECT_ROOT"

echo ""
echo "[2/3] Setting up VS Code Tasks..."

mkdir -p "$PROJECT_ROOT/.vscode"
cat > "$PROJECT_ROOT/.vscode/tasks.json" << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "1. Blockchain Node (Ganache)",
            "type": "shell",
            "command": "npm run start-node",
            "options": {
                "cwd": "${workspaceFolder}/blockchain"
            },
            "isBackground": true,
            "problemMatcher": {
                "pattern": {
                    "regexp": "^RPC Listening on.*"
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": ".*",
                    "endsPattern": ".*RPC Listening on.*"
                }
            },
            "presentation": {
                "reveal": "always",
                "panel": "dedicated",
                "group": "services"
            }
        },
        {
            "label": "2. Deploy Smart Contracts",
            "type": "shell",
            "command": "npm run deploy:ganache",
            "options": {
                "cwd": "${workspaceFolder}/blockchain"
            },
            "problemMatcher": [],
            "presentation": {
                "reveal": "always",
                "panel": "shared",
                "group": "build"
            }
        },
        {
            "label": "3. Backend Server",
            "type": "shell",
            "command": "npm start",
            "options": {
                "cwd": "${workspaceFolder}/backend"
            },
            "isBackground": true,
            "problemMatcher": [],
            "presentation": {
                "reveal": "always",
                "panel": "dedicated",
                "group": "services"
            }
        },
        {
            "label": "4. Next.js Frontend",
            "type": "shell",
            "command": "npm run dev",
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "isBackground": true,
            "problemMatcher": [],
            "presentation": {
                "reveal": "always",
                "panel": "dedicated",
                "group": "services"
            }
        },
        {
            "label": "Start All Services",
            "dependsOn": [
                "1. Blockchain Node (Ganache)",
                "3. Backend Server",
                "4. Next.js Frontend"
            ],
            "dependsOrder": "parallel",
            "problemMatcher": [],
            "presentation": {
                "reveal": "always"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
EOF

echo ""
echo "[3/3] Ready to start services!"
echo ""
echo "==================================================="
echo "  To start the application:"
echo "  1. Press Cmd+Shift+P"
echo "  2. Select 'Tasks: Run Task'"
echo "  3. Select 'Start All Services'"
echo "==================================================="
