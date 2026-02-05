# =====================================================
# CSS Splitter Script
# سكريبت تقسيم ملف CSS الكبير
# =====================================================

$mainCssPath = "d:\_Dev-Projects\web-projects\rehbadev-website\site\assets\css\main.css"
$modulesPath = "d:\_Dev-Projects\web-projects\rehbadev-website\site\assets\css\modules"

# قراءة الملف الكامل
$content = Get-Content $mainCssPath -Raw

# تعريف أقسام الملفات مع المسارات
$sections = @{
    "Sections Common Styles" = "sections/common.css"
    "About Section" = "sections/about.css"
    "Services Section" = "sections/services.css"
    "Projects Section" = "sections/projects.css"
    "Calculator Section" = "sections/calculator.css"
    "FAQ Section" = "sections/faq.css"
    "Contact Section" = "sections/contact.css"
    "Footer" = "sections/footer.css"
    "Bio/Info Section" = "sections/bio.css"
    "Scroll to Top Button" = "components/scroll-to-top.css"
    "Progress Bar" = "components/progress.css"
    "Utility Classes" = "utilities/helpers.css"
    "Responsive Design" = "utilities/responsive.css"
    "Animations" = "utilities/animations.css"
}

Write-Host "✅ تم إنشاء الهيكل الأساسي مسبقاً" -ForegroundColor Green
Write-Host "📝 لإكمال التقسيم يدوياً، راجع الملفات في:" -ForegroundColor Yellow
Write-Host "   $modulesPath" -ForegroundColor Cyan
Write-Host "`n🎯 الملفات الموجودة:" -ForegroundColor Green
Get-ChildItem $modulesPath -Recurse -Filter "*.css" | ForEach-Object {
    Write-Host "   ✓ $($_.FullName.Replace($modulesPath, ''))" -ForegroundColor Gray
}
