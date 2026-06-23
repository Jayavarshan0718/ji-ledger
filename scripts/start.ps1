$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Ji Ledger backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm install; if (-not (Test-Path .env)) { Copy-Item .env.example .env }; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Ji Ledger frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm install; npm run dev"

Write-Host "Done. Backend: http://127.0.0.1:8000  Frontend: http://localhost:3000"
Write-Host "Open VS Code: code '$Root\defi-forge-lab.code-workspace'"
