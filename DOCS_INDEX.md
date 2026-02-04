# 📚 فهرس التوثيق - رحبة للتطوير

## 🎯 ابدأ من هنا

### للمبتدئين
1. **[README.md](README.md)** - نظرة عامة على المشروع
2. **[QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md)** - كيفية إجراء التعديلات الشائعة
3. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - الانتقال من البنية القديمة

### للمطورين
1. **[DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md)** - مرجع المطور السريع
2. **[shared_core/README.md](shared_core/README.md)** - شرح البنية المشتركة
3. **[COMPARISON.md](COMPARISON.md)** - مقارنة قبل/بعد

---

## 📖 دليل التوثيق

### 1. README.md
**الجمهور:** الجميع  
**الغرض:** نظرة عامة شاملة على المشروع

**محتويات:**
- هيكل المشروع
- الميزات الرئيسية
- البدء السريع
- التعديلات الشائعة
- معلومات النشر

**متى تقرأه:** عند البدء مع المشروع لأول مرة

---

### 2. QUICK_EDIT_GUIDE.md
**الجمهور:** غير المبرمجين، المحررين  
**الغرض:** تعديلات سريعة بدون معرفة برمجية

**محتويات:**
- تغيير رقم الواتساب
- تحديث روابط السوشيال
- تعديل الخدمات
- تغيير الألوان
- إضافة مشاريع

**متى تقرأه:** عند الحاجة لتعديل بسيط

---

### 3. DEVELOPER_REFERENCE.md
**الجمهور:** المطورين  
**الغرض:** مرجع تقني سريع

**محتويات:**
- الملفات الأساسية
- المتغيرات المتاحة
- المكونات الجاهزة
- استخدام DataLoader
- أمثلة برمجية
- أفضل الممارسات

**متى تقرأه:** عند البرمجة والتطوير

---

### 4. shared_core/README.md
**الجمهور:** المطورين المتقدمين  
**الغرض:** شرح تفصيلي للبنية المركزية

**محتويات:**
- شرح البيانات المركزية
- شرح الأنماط المشتركة
- كيفية استخدام DataLoader
- بنية الملفات
- أمثلة تطبيقية

**متى تقرأه:** عند تطوير ميزات جديدة

---

### 5. COMPARISON.md
**الجمهور:** متخذي القرار، المطورين  
**الغرض:** مقارنة تفصيلية بين البنية القديمة والجديدة

**محتويات:**
- حجم الملفات
- التكرار
- الأداء
- الصيانة
- الإحصائيات
- أمثلة مقارنة

**متى تقرأه:** لفهم فوائد البنية الجديدة

---

### 6. MIGRATION_GUIDE.md
**الجمهور:** من يريد الانتقال من البنية القديمة  
**الغرض:** خطوات تفصيلية للانتقال

**محتويات:**
- الاختبار
- النسخ الاحتياطي
- التفعيل
- استكشاف الأخطاء
- قائمة التحقق

**متى تقرأه:** عند الانتقال من البنية القديمة

---

### 7. CHANGELOG.md
**الجمهور:** الجميع  
**الغرض:** ملخص التغييرات

**محتويات:**
- ما تم إنجازه
- الملفات الجديدة
- الإحصائيات
- التحسينات

**متى تقرأه:** لمعرفة ما تم تغييره

---

### 8. STRUCTURE_README.md (قديم)
**الجمهور:** مرجع تاريخي  
**الغرض:** توثيق البنية القديمة

**حالته:** محفوظ كمرجع

---

## 🗺️ خريطة التوثيق

```
بدء المشروع
    ↓
README.md (نظرة عامة)
    ↓
    ├── أريد تعديلات بسيطة → QUICK_EDIT_GUIDE.md
    ├── أريد البرمجة → DEVELOPER_REFERENCE.md
    ├── أريد الانتقال → MIGRATION_GUIDE.md
    └── أريد المقارنة → COMPARISON.md
```

---

## 📂 التوثيق حسب المهمة

### تغيير معلومات الشركة
1. [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) - القسم 1
2. [shared_core/data/company-info.json](shared_core/data/company-info.json)

### إضافة صفحة جديدة
1. [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - أمثلة
2. [shared_core/README.md](shared_core/README.md) - استخدام الموارد

### تخصيص التصميم
1. [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) - تغيير الألوان
2. [shared_core/css/variables.css](shared_core/css/variables.css)
3. [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - المتغيرات

### إضافة مشروع/خدمة
1. [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) - القسم 6-7
2. [main_site/data/projects.json](main_site/data/projects.json)
3. [main_site/data/services.json](main_site/data/services.json)

### الانتقال من البنية القديمة
1. [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - كامل
2. [COMPARISON.md](COMPARISON.md) - لفهم الفوائد
3. [CHANGELOG.md](CHANGELOG.md) - ملخص التغييرات

---

## 🎓 مسارات التعلم

### المسار 1: مستخدم عادي (30 دقيقة)
1. اقرأ [README.md](README.md) - 10 دقائق
2. اقرأ [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) - 20 دقيقة
3. جرّب تعديل بسيط

### المسار 2: مطور جديد (1 ساعة)
1. اقرأ [README.md](README.md) - 10 دقائق
2. اقرأ [shared_core/README.md](shared_core/README.md) - 20 دقيقة
3. اقرأ [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - 30 دقيقة
4. جرّب الأمثلة البرمجية

### المسار 3: الانتقال (1.5 ساعة)
1. اقرأ [COMPARISON.md](COMPARISON.md) - 20 دقيقة
2. اقرأ [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - 30 دقيقة
3. اتبع الخطوات - 40 دقيقة

---

## 🔍 البحث السريع

### أين أجد معلومات عن...

| الموضوع | الملف | القسم |
|---------|------|-------|
| تغيير رقم الواتساب | QUICK_EDIT_GUIDE.md | القسم 1 |
| الألوان المتاحة | DEVELOPER_REFERENCE.md | المتغيرات |
| المكونات الجاهزة | DEVELOPER_REFERENCE.md | المكونات |
| استخدام DataLoader | shared_core/README.md | تحميل البيانات |
| النسخ الاحتياطي | MIGRATION_GUIDE.md | المرحلة 3 |
| إضافة مشروع | QUICK_EDIT_GUIDE.md | القسم 6 |
| هيكل المشروع | README.md | الهيكل |

---

## 📝 ملاحظات مهمة

### للقراءة دائماً
- ⭐ [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) - الأكثر استخداماً
- ⭐ [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - للمطورين

### للرجوع عند الحاجة
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - عند الانتقال فقط
- [COMPARISON.md](COMPARISON.md) - للمقارنة والفهم
- [CHANGELOG.md](CHANGELOG.md) - لمعرفة التغييرات

---

## 🔗 روابط سريعة

### ملفات البيانات
- [company-info.json](shared_core/data/company-info.json)
- [services-summary.json](shared_core/data/services-summary.json)
- [projects.json](main_site/data/projects.json)
- [services.json](main_site/data/services.json)

### ملفات CSS
- [variables.css](shared_core/css/variables.css)
- [components.css](shared_core/css/components.css)

### ملفات JavaScript
- [data-loader.js](shared_core/js/data-loader.js)
- [main-site-helper.js](shared_core/js/main-site-helper.js)

### الصفحات
- [Bio الجديد](bio_portfolio/index-new.html)
- [الموقع الرئيسي](main_site/index.html)

---

## 🆘 المساعدة

### لا تجد ما تبحث عنه؟

1. **ابحث في الفهرس أعلاه** باستخدام Ctrl+F
2. **راجع خريطة التوثيق** لمعرفة أي ملف يناسبك
3. **اختر المسار التعليمي** المناسب لمستواك
4. **استخدم جدول البحث السريع** للمواضيع الشائعة

### لا زلت محتاراً؟
- 📧 اتصل بالدعم: info@rehbadev.com
- 💬 واتساب: [تواصل معنا](https://wa.me/966XXXXXXXXX)

---

## ✅ قائمة التحقق

قبل البدء، تأكد أنك:
- [ ] قرأت [README.md](README.md)
- [ ] اخترت المسار التعليمي المناسب
- [ ] لديك نسخة احتياطية من الملفات
- [ ] تفهم البنية الأساسية

---

## 📊 إحصائيات التوثيق

| الملف | الصفحات | الوقت المتوقع | الصعوبة |
|-------|---------|---------------|---------|
| README.md | 4 | 10 دقائق | سهل |
| QUICK_EDIT_GUIDE.md | 3 | 20 دقيقة | سهل |
| DEVELOPER_REFERENCE.md | 5 | 30 دقيقة | متوسط |
| shared_core/README.md | 4 | 20 دقيقة | متوسط |
| MIGRATION_GUIDE.md | 4 | 30 دقيقة | متوسط |
| COMPARISON.md | 3 | 15 دقيقة | سهل |
| CHANGELOG.md | 2 | 10 دقيقة | سهل |

**المجموع:** ~2 ساعة للقراءة الكاملة

---

## 🎯 توصيات

### للمستخدم العادي
1. اقرأ: README.md + QUICK_EDIT_GUIDE.md
2. الوقت: 30 دقيقة
3. ستتمكن من: إجراء التعديلات الأساسية

### للمطور
1. اقرأ: جميع الملفات ماعدا MIGRATION_GUIDE
2. الوقت: 1.5 ساعة
3. ستتمكن من: تطوير ميزات جديدة

### للانتقال من القديم
1. اقرأ: COMPARISON + MIGRATION_GUIDE + QUICK_EDIT_GUIDE
2. الوقت: 1 ساعة
3. ستتمكن من: الانتقال بنجاح

---

**آخر تحديث:** فبراير 2026  
**إصدار التوثيق:** 1.0  
**الحالة:** ✅ كامل ومحدّث
