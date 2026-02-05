# =====================================================
# CSS Auto-Splitter - تقسيم CSS تلقائياً
# =====================================================

$mainCss = "d:\_Dev-Projects\web-projects\rehbadev-website\site\assets\css\main.css"
$modulesDir = "d:\_Dev-Projects\web-projects\rehbadev-website\site\assets\css\modules"

# قراءة المحتوى
$lines = Get-Content $mainCss

# تعريف ن

قاط التقسيم والملفات المستهدفة
$mappings = @{
    "Hero Section" = "sections/hero.css"
    "Sections Common" = "sections/common.css"
    "About Section" = "sections/about.css"
    "Services Section" = "sections/services.css"
    "Projects Section" = "sections/projects.css"  
    "Calculator Section" = "sections/calculator.css"
    "FAQ Section" = "sections/faq.css"
    "Contact Section" = "sections/contact.css"
    "Footer" = "sections/footer.css"
    "Bio" = "sections/bio.css"
    "Scroll to Top" = "components/scroll-to-top.css"
    "Progress Bar" = "components/progress.css"
    "Utility Classes" = "utilities/helpers.css"
    "Responsive Design" = "utilities/responsive.css"
    "Animations" = "utilities/animations.css"
    "Calculator - Modern" = "sections/calculator.css"
    "Calculator Design" = "sections/calculator.css"
    "Service Cards" = "sections/services.css"
    "Floating WhatsApp" = "components/floating-whatsapp.css"
}

# متغيرات التتبع
$currentSection = ""
$currentContent = @()
$sectionStart = 0

Write-Host "🚀 بدء تقسيم ملف CSS..." -ForegroundColor Cyan
Write-Host "📄 الملف: main.css ($($lines.Count) سطر)" -ForegroundColor Gray

for ($i = 0; $i < $lines.Count; $i++) {
    $line = $lines[$i]
    
    # البحث عن بداية قسم جديد
    if ($line -match "^\s*/\*\s*={3,}") {
        # حفظ القسم السابق
        if ($currentSection -and $currentContent.Count -gt 0) {
            $targetFile = $null
            foreach ($key in $mappings.Keys) {
                if ($currentSection -like "*$key*") {
                    $targetFile = Join-Path $modulesDir $mappings[$key]
                    break
                }
            }
            
            if ($targetFile) {
                $header = "/**`n * $currentSection`n * المصدر: main.css (السطور $sectionStart-$i)`n */`n`n"
                $fullContent = $header + ($currentContent -join "`n")
                
                # إضافة المحتوى للملف (append mode)
                Add-Content -Path $targetFile -Value $fullContent -Encoding UTF8
                Write-Host "   ✓ تم إضافة: $currentSection → $($mappings[$key.Split('*')[0]])" -ForegroundColor Green
            }
        }
        
        # بداية قسم جديد
        if ($i + 1 -lt $lines.Count) {
            $currentSection = $lines[$i + 1] -replace '^\s*', '' -replace '\s*=+\s*\*\/\s*$', ''
            $currentContent = @()
            $sectionStart = $i
        }
    }
    else {
        # إضافة السطر للمحتوى الحالي
        $currentContent += $line
    }
}

# حفظ القسم الأخير
if ($currentSection -and $currentContent.Count -gt 0) {
    $targetFile = $null
    foreach ($key in $mappings.Keys) {
        if ($currentSection -like "*$key*") {
            $targetFile = Join-Path $modulesDir $mappings[$key]
            break
        }
    }
    
    if ($targetFile) {
        $header = "/**`n * $currentSection`n * المصدر: main.css (السطور $sectionStart-$($lines.Count))`n */`n`n"
        $fullContent = $header + ($currentContent -join "`n")
        Add-Content -Path $targetFile -Value $fullContent -Encoding UTF8
        Write-Host "   ✓ تم إضافة: $currentSection → $targetFile" -ForegroundColor Green
    }
}

Write-Host "`n✅ اكتمل التقسيم!" -ForegroundColor Green
Write-Host "📊 الإحصائيات:" -ForegroundColor Yellow
Get-ChildItem $modulesDir -Recurse -Filter "*.css" | Where-Object { $_.Length -gt 0 } | ForEach-Object {
    $lineCount = (Get-Content $_.FullName | Measure-Object -Line).Lines
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "   📄 $($_.Name): $lineCount سطر ($size KB)" -ForegroundColor Gray
}
