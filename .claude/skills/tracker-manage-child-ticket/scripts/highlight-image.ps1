<#
.SYNOPSIS
  Draw a red highlight box on a copy of an existing PNG/JPG. Used for question
  screenshots when the image already exists (ticket attachment, earlier run evidence).

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File highlight-image.ps1 `
    -In  "qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step3-Decode_pass.png" `
    -Out "qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP-2533_Q-002_highlighted.png" `
    -Box "120,340,560,180"

  -Box is "x,y,width,height" in image pixels; repeat with ";" for several boxes:
    -Box "120,340,560,180;700,40,200,60"
  Prints the image size first when called with -Info, so boxes can be placed:
    highlight-image.ps1 -In <file> -Info
#>
param(
  [Parameter(Mandatory = $true)][string]$In,
  [string]$Out,
  [string]$Box,
  [int]$Thickness = 4,
  [switch]$Info
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile((Resolve-Path $In))
try {
  if ($Info) { "{0} x {1}" -f $src.Width, $src.Height; return }
  if (-not $Out -or -not $Box) { throw "-Out and -Box are required unless -Info is given" }

  $bmp = New-Object System.Drawing.Bitmap $src.Width, $src.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 230, 0, 0)), $Thickness

  foreach ($b in $Box.Split(';')) {
    $v = $b.Split(',') | ForEach-Object { [int]$_.Trim() }
    if ($v.Count -ne 4) { throw "Box '$b' must be x,y,width,height" }
    $g.DrawRectangle($pen, $v[0], $v[1], $v[2], $v[3])
  }
  $pen.Dispose(); $g.Dispose()

  $outDir = Split-Path -Parent $Out
  if ($outDir) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
  $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  "written $Out"
}
finally { $src.Dispose() }
