$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path "$Root\backend\.env")) {
    Copy-Item "$Root\backend\.env.example" "$Root\backend\.env"
}

if (-not (Test-Path "$Root\backend\node_modules")) {
    Write-Host "Installing backend deps..." -ForegroundColor Cyan
    Set-Location "$Root\backend"; npm install --silent
}
if (-not (Test-Path "$Root\frontend\node_modules")) {
    Write-Host "Installing frontend deps..." -ForegroundColor Cyan
    Set-Location "$Root\frontend"; npm install --silent
}

Write-Host "Starting backend + frontend in same terminal..." -ForegroundColor Green

$backend = Start-Job -ScriptBlock {
    Set-Location $using:Root\backend
    node server.js
}

Start-Sleep -Seconds 2

Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop both." -ForegroundColor Gray

Set-Location "$Root\frontend"
try {
    npm run dev
} finally {
    Stop-Job $backend
    Remove-Job $backend
    Write-Host "Both servers stopped." -ForegroundColor Red
}
