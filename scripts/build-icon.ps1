Add-Type -AssemblyName System.Drawing

function Create-QevraBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $scale = $size / 256.0

    # Rounded Squircle Background
    $rect = New-Object System.Drawing.RectangleF (10 * $scale), (10 * $scale), (236 * $scale), (236 * $scale)
    $radius = 54.0 * $scale
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($rect.X, $rect.Y, $radius, $radius, 180, 90)
    $path.AddArc($rect.Right - $radius, $rect.Y, $radius, $radius, 270, 90)
    $path.AddArc($rect.Right - $radius, $rect.Bottom - $radius, $radius, $radius, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $radius, $radius, $radius, 90, 90)
    $path.CloseFigure()

    # Fill background with sleek obsidian dark tone (#090a0f to #14151c)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, 0)),
        (New-Object System.Drawing.PointF($size, $size)),
        [System.Drawing.Color]::FromArgb(255, 10, 11, 15),
        [System.Drawing.Color]::FromArgb(255, 22, 24, 31)
    )
    $g.FillPath($bgBrush, $path)

    # Subtle premium border (#27272a)
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 39, 39, 42), [Math]::Max(1.0, 2.0 * $scale))
    $g.DrawPath($borderPen, $path)

    # Draw QEVRA 'Q' glyph:
    # Outer circular ring for Q
    $ringRect = New-Object System.Drawing.RectangleF (56 * $scale), (52 * $scale), (144 * $scale), (144 * $scale)
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 244, 244, 245), [Math]::Max(2.0, 14.0 * $scale))
    $ringPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $ringPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    # Arc leaves gap at bottom right (~40 deg to 345 deg)
    $g.DrawArc($ringPen, $ringRect, 40, 290)

    # Diagonal action tail for Q
    $tailPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 244, 244, 245), [Math]::Max(2.0, 15.0 * $scale))
    $tailPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $tailPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($tailPen, (146 * $scale), (142 * $scale), (198 * $scale), (194 * $scale))

    # Center voice activity wave (3 vertical bars)
    $barPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 161, 161, 170), [Math]::Max(1.5, 7.5 * $scale))
    $barPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $barPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Center bar
    $g.DrawLine($barPen, (128 * $scale), (98 * $scale), (128 * $scale), (150 * $scale))
    # Left bar
    $g.DrawLine($barPen, (108 * $scale), (110 * $scale), (108 * $scale), (138 * $scale))
    # Right bar
    $g.DrawLine($barPen, (148 * $scale), (112 * $scale), (148 * $scale), (136 * $scale))

    $barPen.Dispose()
    $tailPen.Dispose()
    $ringPen.Dispose()
    $borderPen.Dispose()
    $bgBrush.Dispose()
    $path.Dispose()
    $g.Dispose()

    return $bmp
}

$resourcesDir = Join-Path $PSScriptRoot "..\resources"
if (-not (Test-Path $resourcesDir)) {
    New-Item -ItemType Directory -Path $resourcesDir | Out-Null
}

$sizes = @(256, 128, 64, 48, 32, 16)
$pngBytesList = @()

foreach ($s in $sizes) {
    $bmp = Create-QevraBitmap -size $s
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()
    $pngBytesList += ,@($s, $bytes)
}

# Save 256x256 PNG as icon.png
$pngPath = Join-Path $resourcesDir "icon.png"
[System.IO.File]::WriteAllBytes($pngPath, $pngBytesList[0][1])
Write-Host "Saved icon.png ($pngPath)"

# Construct multi-size ICO file with PNG streams
$icoPath = Join-Path $resourcesDir "icon.ico"
$icoStream = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($icoStream)

# ICONDIR header (6 bytes)
$bw.Write([UInt16]0)                # Reserved
$bw.Write([UInt16]1)                # Image type: 1 = ICO
$bw.Write([UInt16]$sizes.Count)     # Number of images

# Calculate offset for first image data
# Header = 6 bytes + (16 bytes * count)
$offset = 6 + (16 * $sizes.Count)

foreach ($entry in $pngBytesList) {
    $s = $entry[0]
    $data = $entry[1]
    
    $w = if ($s -ge 256) { [byte]0 } else { [byte]$s }
    $h = if ($s -ge 256) { [byte]0 } else { [byte]$s }
    
    $bw.Write([byte]$w)             # Width
    $bw.Write([byte]$h)             # Height
    $bw.Write([byte]0)              # Colors (0 = >=8bpp)
    $bw.Write([byte]0)              # Reserved
    $bw.Write([UInt16]1)            # Color planes
    $bw.Write([UInt16]32)           # Bits per pixel
    $bw.Write([UInt32]$data.Length) # Size of image data in bytes
    $bw.Write([UInt32]$offset)      # Offset of image data
    
    $offset += $data.Length
}

# Write PNG payloads
foreach ($entry in $pngBytesList) {
    $data = $entry[1]
    $bw.Write($data)
}

$bw.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $icoStream.ToArray())
$bw.Dispose()
$icoStream.Dispose()

Write-Host "Saved icon.ico ($icoPath) with sizes: $($sizes -join ', ')"
