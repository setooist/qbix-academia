# PowerShell script to start Stripe CLI listener
$StripePath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe\stripe.exe"

if (-not (Test-Path $StripePath)) {
    Write-Host "Error: Stripe CLI not found at $StripePath" -ForegroundColor Red
    Write-Host "Please install it or check the path."
    exit 1
}

Write-Host "Starting Stripe Listener..." -ForegroundColor Green
Write-Host "1. Copy the 'whsec_...' key below."
Write-Host "2. Paste it into your backend .env file as STRIPE_WEBHOOK_SECRET."
Write-Host "3. Restart your backend server."
Write-Host "---------------------------------------------------" -ForegroundColor Cyan

& $StripePath listen --forward-to http://127.0.0.1:1337/api/subscription/webhook
