$css = Get-Content 'style.css' -Raw -Encoding UTF8

# Fix hero float tags - reduce top margin
$css = $css.Replace('margin: 28px 0;', 'margin: 18px 0;')

# Fix the spotlight section margin-top inside slider-container
$css = $css.Replace('margin-top: 50px;', 'margin-top: 28px;')

# Reduce section-header margin-bottom from 50 to 28
$css = $css.Replace('margin-bottom: 50px;', 'margin-bottom: 28px;')

# Reduce slider dots margin-top
$css = $css.Replace('margin-top: 30px;', 'margin-top: 18px;')

Set-Content 'style.css' $css -Encoding UTF8
Write-Host 'Extra spacing fixed'
