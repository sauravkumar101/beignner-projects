# Setup script for Windows PowerShell
# Creates virtual environment, installs dependencies, and copies .env

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Copied .env.example to .env — please review it if needed."
} else {
  Write-Host ".env already exists"
}

Write-Host "Setup complete. To seed and run, run: .\run-dev.ps1"}EOF