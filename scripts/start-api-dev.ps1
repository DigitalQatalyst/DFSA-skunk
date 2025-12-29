# PowerShell script to start Vercel dev server with workaround for port detection timeout
# Usage: .\scripts\start-api-dev.ps1

# Set environment variable to help with port detection
$env:VERCEL_DEBUG = "1"

# Try to kill any stuck processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Vercel dev server
Write-Host "Starting Vercel dev server on port 3001..." -ForegroundColor Green
vercel dev --listen 3001



