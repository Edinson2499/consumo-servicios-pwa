$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$reportDir = Join-Path $root 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$target = 'http://127.0.0.1:4173'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host 'Docker no está disponible. Instala Docker Desktop o OWASP ZAP para ejecutar este análisis.'
  Write-Host 'Comando manual recomendado:'
  Write-Host "docker run --rm -u root -v \"$root:/zap/wrk:rw\" owasp/zap2docker-stable zap-baseline.py -t $target -g gen.conf -J zap-report.json -r zap-report.html"
  exit 0
}

$reportJson = Join-Path $reportDir 'zap-report.json'
$reportHtml = Join-Path $reportDir 'zap-report.html'

Write-Host "Ejecutando escaneo OWASP ZAP contra $target"

docker run --rm -u root -v "$root:/zap/wrk:rw" owasp/zap2docker-stable zap-baseline.py -t $target -g gen.conf -J $reportJson -r $reportHtml

if (Test-Path $reportJson) {
  Write-Host "Reporte JSON generado: $reportJson"
}

if (Test-Path $reportHtml) {
  Write-Host "Reporte HTML generado: $reportHtml"
}
