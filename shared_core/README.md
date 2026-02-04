# البنية المحسّنة للموقع - Rehba Dev

## 📋 نظرة عامة
تم إعادة هيكلة المشروع لتجنب التكرار وتسهيل الصيانة من خلال:
- **ملفات بيانات مركزية** في `shared_core/data`
- **أنماط CSS مشتركة** في `shared_core/css`
- **أكواد JavaScript قابلة لإعادة الاستخدام** في `shared_core/js`
- **صفحة Bio موحدة** بدلاً من ملفات متعددة

---

## 📁 الهيكل الجديد

```
shared_core/
├── data/                          # البيانات المركزية
│   ├── company-info.json         # معلومات الشركة والروابط
│   └── services-summary.json     # ملخص الخدمات
│
├── css/                          # الأنماط المشتركة
│   ├── variables.css             # المتغيرات (الألوان، الخطوط)
│   └── components.css            # المكونات المتكررة (الأزرار، البطاقات)
│
├── js/                           # الأكواد المشتركة
│   └── data-loader.js            # تحميل البيانات المركزية
│
├── fonts/                        # الخطوط
│   ├── cairo.css
│   └── cairo-temp.css
│
└── images/                       # الصور المشتركة
    └── brand.webp
```

---

## 🎯 كيف تعمل البنية الجديدة

### 1. البيانات المركزية

#### **company-info.json**
يحتوي على جميع معلومات الشركة:
- الاسم والشعار
- معلومات التواصل (البريد، الواتساب، الهاتف)
- روابط السوشيال ميديا
- روابط التنقل بين الصفحات

**مثال:**
```json
{
  "name": "رحبة للتطوير",
  "tagline": "نحول أفكارك لواقع رقمي 🚀",
  "contact": {
    "email": "info@rehbadev.com",
    "whatsapp": "966XXXXXXXXX"
  }
}
```

#### **services-summary.json**
ملخص الخدمات المستخدم في صفحة Bio:
```json
{
  "services": [
    {
      "id": "design",
      "title": "التصميم",
      "icon": "fas fa-palette",
      "description": "شعارات، هويات بصرية، تصاميم"
    }
  ]
}
```

### 2. الأنماط المشتركة

#### **variables.css**
جميع المتغيرات (الألوان، الظلال، الخطوط):
```css
:root {
  --primary-color: #2d6ac8;
  --text-primary: #ffffff;
  --card-bg: #1e293b;
}
```

#### **components.css**
المكونات المتكررة:
- الأزرار (btn, btn-primary, btn-secondary)
- البطاقات (card)
- الأيقونات الاجتماعية (social-btn)
- الرسوم المتحركة (fadeIn, scaleIn)
- الشبكات (grid-2, grid-3, grid-4)

### 3. تحميل البيانات

**data-loader.js** يوفر class للتعامل مع البيانات:

```javascript
const dataLoader = new DataLoader();

// تحميل معلومات الشركة
const companyInfo = await dataLoader.getCompanyInfo();

// تحميل الخدمات
const services = await dataLoader.getServicesForBio();

// تحميل المشاريع
const projects = await dataLoader.getProjects();
```

---

## 🔄 صفحة Bio الجديدة

### المميزات:
✅ **ملف واحد فقط** (`index-new.html`) بدلاً من 3 ملفات
✅ **تسحب البيانات** من الملفات المركزية
✅ **الروابط تذهب** إلى أقسام الموقع الرئيسي
✅ **لا توجد نوافذ منبثقة** للمشاريع أو الحاسبة
✅ **أنماط مدمجة** في نفس الملف لسهولة النشر

### البنية:
```html
<!DOCTYPE html>
<html>
<head>
    <!-- Shared Resources -->
    <link href="../shared_core/fonts/cairo.css">
    <link rel="stylesheet" href="../shared_core/css/variables.css">
    <link rel="stylesheet" href="../shared_core/css/components.css">
    
    <style>
        /* أنماط خاصة بصفحة Bio فقط */
    </style>
</head>
<body>
    <!-- المحتوى -->
    
    <script src="../shared_core/js/data-loader.js"></script>
    <script>
        // كود بسيط لتحميل البيانات
        const dataLoader = new DataLoader();
        async function initPage() {
            const info = await dataLoader.getCompanyInfo();
            // استخدام البيانات...
        }
    </script>
</body>
</html>
```

---

## 📝 كيفية التعديل

### لتعديل معلومات الشركة:
1. افتح `shared_core/data/company-info.json`
2. عدّل البيانات المطلوبة
3. احفظ الملف
4. التغييرات ستظهر تلقائياً في Bio والموقع الرئيسي

### لتعديل الخدمات:
1. عدّل `shared_core/data/services-summary.json` للملخص في Bio
2. عدّل `main_site/data/services.json` للتفاصيل الكاملة

### لتعديل الألوان:
1. افتح `shared_core/css/variables.css`
2. عدّل المتغيرات:
```css
:root {
  --primary-color: #YOUR_COLOR;
}
```

### لتعديل المكونات المشتركة:
1. افتح `shared_core/css/components.css`
2. عدّل الأنماط المطلوبة

---

## 🎨 المزايا الجديدة

### 1. **لا تكرار**
- البيانات في مكان واحد
- الأنماط في مكان واحد
- الأكواد في مكان واحد

### 2. **سهولة الصيانة**
- تعديل واحد يظهر في كل مكان
- لا حاجة لتعديل ملفات متعددة

### 3. **أداء أفضل**
- ملفات CSS و JS مشتركة (تُخزّن مؤقتاً)
- تحميل البيانات مع Caching

### 4. **قابلية التوسع**
- سهل إضافة صفحات جديدة
- سهل إضافة خدمات أو مشاريع

---

## 🚀 الخطوات التالية

### للاستخدام:
1. انسخ `bio_portfolio/index-new.html` إلى `bio_portfolio/index.html`
2. احذف الملفات القديمة:
   - `bio_portfolio/style.css`
   - `bio_portfolio/app.js`

### للاختبار:
```bash
# في مجلد المشروع
python -m http.server 8000

# ثم افتح في المتصفح:
http://localhost:8000/bio_portfolio/index-new.html
```

---

## ⚠️ ملاحظات مهمة

1. **الملفات القديمة محفوظة** كنسخة احتياطية
2. **الموقع الرئيسي** (`main_site`) يمكن تحديثه لاستخدام نفس النظام
3. **البيانات المركزية** تحتاج تحديث أرقام الهواتف والروابط الفعلية

---

## 📞 للدعم
إذا كان لديك أي استفسار عن البنية الجديدة، راجع:
- `company-info.json` - لمعلومات الشركة
- `data-loader.js` - لطرق تحميل البيانات
- `components.css` - للمكونات المتاحة

---

**تم التحديث:** فبراير 2026
**الإصدار:** 2.0
