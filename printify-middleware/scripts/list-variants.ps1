# list-variants.ps1
# Usage: $env:PRINTIFY_TOKEN='yourtoken'; .\list-variants.ps1 28715716
param(
  [string]$ShopId = '28715716',
  [int]$Limit = 50,
  [string]$OutFile = "..\output\mapping.json"
)

if (-not $env:PRINTIFY_TOKEN) {
  Write-Error "PRINTIFY_TOKEN environment variable is required"
  exit 1
}

$token = $env:PRINTIFY_TOKEN
$outDir = Join-Path -Path $PSScriptRoot -ChildPath "..\output" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $outDir) { New-Item -Path (Join-Path $PSScriptRoot '..\output') -ItemType Directory -Force | Out-Null }

$page = 1
$results = @()

while ($true) {
  $uri = "https://api.printify.com/v1/shops/$ShopId/products.json?page=$page&limit=$Limit"
  try {
    $resp = Invoke-RestMethod -Uri $uri -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  } catch {
    Write-Error "Printify API error: $_"
    exit 2
  }

  # Printify pagina al estilo Laravel: { data: [...], current_page, last_page }, no un array plano.
  $products = $resp.data
  if (-not $products -or $products.Count -eq 0) { break }

  foreach ($p in $products) {
    $variants = @()
    if ($p.variants) {
      foreach ($v in $p.variants) {
        $variants += [PSCustomObject]@{ variant_id = $v.id; sku = $v.sku; title = $v.title }
      }
    }
    $results += [PSCustomObject]@{ product_id = $p.id; title = $p.title; variants = $variants }
  }

  if ($resp.current_page -ge $resp.last_page) { break }
  $page++
}

$final = $results | ConvertTo-Json -Depth 5
$target = Join-Path $PSScriptRoot '..\output\mapping.json'
Set-Content -Path $target -Value $final -Encoding UTF8
Write-Output "Wrote mapping to $target ($($results.Count) products)"
