param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

Add-Type -AssemblyName System.Drawing

$fontPath = "C:\Windows\Fonts\NotoSansSC-VF.ttf"
if (-not (Test-Path $fontPath)) {
  $fontPath = "C:\Windows\Fonts\msyh.ttc"
}

$privateFonts = New-Object System.Drawing.Text.PrivateFontCollection
$privateFonts.AddFontFile($fontPath)
$fontFamily = $privateFonts.Families[0]

function New-Font($size, $style = [System.Drawing.FontStyle]::Regular) {
  return New-Object System.Drawing.Font($fontFamily, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-CenteredText($graphics, $text, $rect, $font, $brush) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  $graphics.DrawString($text, $font, $brush, $rect, $format)
}

function Draw-CaptionBox($graphics, $text, $rect, $font, $brush, $pen) {
  $bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 255, 252, 242))
  $graphics.FillRectangle($bg, $rect)
  $graphics.DrawRectangle($pen, [int]$rect.X, [int]$rect.Y, [int]$rect.Width, [int]$rect.Height)
  Draw-CenteredText $graphics $text $rect $font $brush
  $bg.Dispose()
}

function Auto-FitFont($graphics, $text, $rect, $baseFont, $minSize) {
  $size = [int]$baseFont.Size
  $style = $baseFont.Style
  while ($size -ge $minSize) {
    $font = New-Font $size $style
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $measured = $graphics.MeasureString($text, $font, [int]$rect.Width, $stringFormat)
    $stringFormat.Dispose()
    if ($measured.Width -le ($rect.Width + 2) -and $measured.Height -le ($rect.Height + 2)) {
      return $font
    }
    $font.Dispose()
    $size -= 1
  }
  return New-Font $minSize $style
}

function T($base64) {
  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($base64))
}

$image = [System.Drawing.Image]::FromFile($InputPath)
$bitmap = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)

$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(48, 39, 31))
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 82, 65, 51), 2)

$titleFont = New-Font 34 ([System.Drawing.FontStyle]::Bold)
$bubbleFont = New-Font 22 ([System.Drawing.FontStyle]::Bold)
$smallBubbleFont = New-Font 20 ([System.Drawing.FontStyle]::Bold)
$captionFont = New-Font 18 ([System.Drawing.FontStyle]::Regular)

$items = @(
  @{ Text = T "5YWt5LiA56S854mp5Yiw5ZWm"; X = 70; Y = 16; W = 725; H = 56; Font = $titleFont },
  @{ Text = T "5rSe5rSe6Z6L4oCm4oCmCuS4jeS4gOagt++8gQ=="; X = 514; Y = 132; W = 115; H = 78; Font = $smallBubbleFont },
  @{ Text = T "5aSP5aSp5Yiw5LqG77yMCue7mea7oeS5sOWPjArmtJ7mtJ7pnovlkKfvvJ8="; X = 62; Y = 442; W = 117; H = 87; Font = $smallBubbleFont },
  @{ Text = T "6L+Z5Y+M6ZW/6aKI6bm/55qE77yMCuWlueiCr+WumuWWnOasouOAgg=="; X = 666; Y = 441; W = 137; H = 86; Font = $smallBubbleFont },
  @{ Text = T "5ZOm772e5Zac5qyi772e"; X = 581; Y = 720; W = 132; H = 71; Font = $bubbleFont },
  @{ Text = T "54i354i355yL77yB"; X = 75; Y = 1034; W = 104; H = 61; Font = $bubbleFont },
  @{ Text = T "5ZOO5ZGA77yMCuecn+elnuawlO+8gQ=="; X = 724; Y = 1029; W = 101; H = 63; Font = $smallBubbleFont },
  @{ Text = T "6KaB56m/77yBCuWlveeOqe+8gQ=="; X = 71; Y = 1302; W = 119; H = 72; Font = $bubbleFont },
  @{ Text = T "5rSX5r6h5Lmf6KaBCuepv+WRgO+8nw=="; X = 730; Y = 1310; W = 104; H = 67; Font = $smallBubbleFont },
  @{ Text = T "5b+r6YCS5aeQ5aeQ77yBCuW/q+mAkuWnkOWnkO+8gQ=="; X = 48; Y = 1594; W = 121; H = 84; Font = $smallBubbleFont }
)

foreach ($item in $items) {
  $rect = New-Object System.Drawing.RectangleF($item.X, $item.Y, $item.W, $item.H)
  if ($item.Font -eq $titleFont) {
    Draw-CenteredText $graphics $item.Text $rect $item.Font $textBrush
  } else {
    $font = Auto-FitFont $graphics $item.Text $rect $item.Font 14
    Draw-CenteredText $graphics $item.Text $rect $font $textBrush
    $font.Dispose()
  }
}

$captionRect = New-Object System.Drawing.RectangleF(545, 1743, 282, 54)
Draw-CaptionBox $graphics (T "5aW55piv5LiN5piv5Lul5Li677yMCuaLv+W/q+mAkuWwseacieaWsOeOqeWFt++8nw==") $captionRect $captionFont $textBrush $pen

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$titleFont.Dispose()
$bubbleFont.Dispose()
$smallBubbleFont.Dispose()
$captionFont.Dispose()
$textBrush.Dispose()
$pen.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
$image.Dispose()
$privateFonts.Dispose()
