param()

Add-Type -AssemblyName System.Drawing

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$iconDirectory = Join-Path $repositoryRoot 'dist\icons'
New-Item -ItemType Directory -Force -Path $iconDirectory | Out-Null

function Add-RoundedRectangle {
  param(
    [System.Drawing.Drawing2D.GraphicsPath]$Path,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )
  $diameter = $Radius * 2
  $Path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $Path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $Path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $Path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $Path.CloseFigure()
}

function New-PwaIcon {
  param(
    [int]$Size,
    [string]$FileName,
    [bool]$Maskable = $false
  )

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bounds = [System.Drawing.Rectangle]::new(0, 0, $Size, $Size)
  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $bounds,
    [System.Drawing.ColorTranslator]::FromHtml('#213641'),
    [System.Drawing.ColorTranslator]::FromHtml('#0d1820'),
    45
  )
  $graphics.FillRectangle($background, $bounds)

  $outerMargin = if ($Maskable) { [int]($Size * 0.16) } else { [int]($Size * 0.105) }
  $cornerRadius = [float]($Size * 0.155)
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  Add-RoundedRectangle -Path $path -X $outerMargin -Y $outerMargin -Width ($Size - 2 * $outerMargin) -Height ($Size - 2 * $outerMargin) -Radius $cornerRadius

  $gold = [System.Drawing.ColorTranslator]::FromHtml('#e1c18b')
  $border = [System.Drawing.Pen]::new($gold, [Math]::Max(3, $Size * 0.02))
  $graphics.DrawPath($border, $path)

  $linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(118, $gold), [Math]::Max(1, $Size * 0.008))
  $lineStart = [float]($outerMargin * 1.55)
  $lineEnd = [float]($Size - $outerMargin * 1.55)
  $graphics.DrawLine($linePen, $lineStart, [float]($Size * 0.245), $lineEnd, [float]($Size * 0.245))
  $graphics.DrawLine($linePen, $lineStart, [float]($Size * 0.755), $lineEnd, [float]($Size * 0.755))

  $fontSize = if ($Maskable) { [float]($Size * 0.45) } else { [float]($Size * 0.49) }
  try {
    $font = [System.Drawing.Font]::new('Batang', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  } catch {
    $font = [System.Drawing.Font]::new([System.Drawing.FontFamily]::GenericSerif, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  }
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f1d69c'))
  $textBounds = [System.Drawing.RectangleF]::new(0, [float]($Size * 0.025), $Size, [float]($Size * 0.92))
  $graphics.DrawString('史', $font, $textBrush, $textBounds, $format)

  $outputPath = Join-Path $iconDirectory $FileName
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $textBrush.Dispose()
  $format.Dispose()
  $font.Dispose()
  $linePen.Dispose()
  $border.Dispose()
  $path.Dispose()
  $background.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-PwaIcon -Size 180 -FileName 'apple-touch-icon.png'
New-PwaIcon -Size 192 -FileName 'icon-192.png'
New-PwaIcon -Size 512 -FileName 'icon-512.png'
New-PwaIcon -Size 512 -FileName 'icon-maskable-512.png' -Maskable $true

Write-Output "Generated PWA icons in $iconDirectory"
