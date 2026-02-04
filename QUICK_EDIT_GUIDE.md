# دليل التعديلات السريعة 🚀

## للتعديلات الشائعة

### 1️⃣ تغيير رقم الواتساب أو البريد الإلكتروني
**الملف:** `shared_core/data/company-info.json`

```json
{
  "contact": {
    "email": "info@rehbadev.com",        ← عدّل هنا
    "phone": "966XXXXXXXXX",             ← عدّل هنا
    "whatsapp": "966XXXXXXXXX"           ← عدّل هنا
  }
}
```

### 2️⃣ تحديث روابط السوشيال ميديا
**الملف:** `shared_core/data/company-info.json`

```json
{
  "social": {
    "twitter": "https://twitter.com/rehbadev",     ← عدّل هنا
    "github": "https://github.com/rehbadev",       ← عدّل هنا
    "linkedin": "",                                ← أضف رابطك
    "instagram": ""                                ← أضف رابطك
  }
}
```

### 3️⃣ تغيير الشعار أو الاسم
**الملف:** `shared_core/data/company-info.json`

```json
{
  "name": "رحبة للتطوير",              ← الاسم بالعربي
  "nameEn": "Rehba Dev",              ← الاسم بالإنجليزي
  "tagline": "نحول أفكارك لواقع رقمي", ← الشعار
  "logo": "../shared_core/images/brand.webp"  ← مسار الشعار
}
```

### 4️⃣ تعديل الخدمات في صفحة Bio
**الملف:** `shared_core/data/services-summary.json`

```json
{
  "services": [
    {
      "id": "design",
      "title": "التصميم",              ← العنوان الكامل
      "titleShort": "التصميم",         ← العنوان المختصر
      "icon": "fas fa-palette",        ← أيقونة Font Awesome
      "description": "شعارات، هويات"   ← الوصف المختصر
    }
  ]
}
```

### 5️⃣ تغيير الألوان الأساسية
**الملف:** `shared_core/css/variables.css`

```css
:root {
    --primary-color: #2d6ac8;      ← اللون الأساسي
    --secondary-color: #3d7fd9;    ← اللون الثانوي
    --success-color: #10b981;      ← لون النجاح (أخضر)
    --warning-color: #f59e0b;      ← لون التنبيه (برتقالي)
    --danger-color: #ef4444;       ← لون الخطر (أحمر)
}
```

### 6️⃣ إضافة مشروع جديد
**الملف:** `main_site/data/projects.json`

```json
[
  {
    "id": "my_project",                  ← معرّف فريد
    "title": "اسم المشروع",
    "category": "websites",              ← websites, stores, apps, branding
    "description": "وصف المشروع",
    "image": "assets/images/project.webp",
    "link": "https://example.com",
    "badge": "مكتمل",                    ← مكتمل، قيد التطوير، عرض تجريبي
    "technologies": ["HTML", "CSS"]
  }
]
```

### 7️⃣ إضافة خدمة في الحاسبة
**الملف:** `main_site/data/calculator-services.json`

```json
{
  "services": [
    {
      "id": "my_service",
      "category": "design",             ← design, websites, apps
      "name": "اسم الخدمة",
      "description": "وصف الخدمة",
      "icon": "fa-star",
      "basePrice": 100,                 ← السعر بالريال
      "delivery": {
        "normal": "3-5 أسابيع",
        "urgent": "1-2 أسابيع",
        "urgentFee": 50
      }
    }
  ]
}
```

---

## 🎨 تخصيص التصميم

### تغيير الخطوط
**الملف:** `shared_core/css/variables.css`
```css
body {
    font-family: 'Cairo', sans-serif;  ← غيّر اسم الخط
}
```

### تغيير الظلال
```css
:root {
    --shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 25px 80px -15px rgba(0, 0, 0, 0.5);
}
```

### تغيير الانحناءات (Border Radius)
**الملف:** `shared_core/css/components.css`
```css
.card {
    border-radius: 16px;  ← عدّل هنا
}
```

---

## ⚡ نصائح سريعة

### ✅ افعل:
- عدّل الملفات في `shared_core/data` للبيانات
- استخدم المتغيرات من `variables.css`
- استخدم المكونات من `components.css`

### ❌ لا تفعل:
- لا تكرر البيانات في ملفات متعددة
- لا تنسخ/ألصق الأنماط - استخدم المكونات الجاهزة
- لا تعدّل `data-loader.js` إلا للضرورة

---

## 🔍 أين أجد ماذا؟

| أريد تعديل... | الملف |
|---------------|------|
| معلومات الشركة | `shared_core/data/company-info.json` |
| الخدمات (ملخص) | `shared_core/data/services-summary.json` |
| الخدمات (تفصيلي) | `main_site/data/services.json` |
| المشاريع | `main_site/data/projects.json` |
| الحاسبة | `main_site/data/calculator-services.json` |
| الألوان | `shared_core/css/variables.css` |
| الأزرار والبطاقات | `shared_core/css/components.css` |

---

## 🧪 الاختبار

بعد أي تعديل:
```bash
# شغّل سيرفر محلي
python -m http.server 8000

# افتح المتصفح
http://localhost:8000/bio_portfolio/index-new.html
http://localhost:8000/main_site/index.html
```

---

## 💡 أمثلة سريعة

### مثال 1: إضافة LinkedIn
في `company-info.json`:
```json
{
  "social": {
    "linkedin": "https://linkedin.com/company/rehbadev"
  }
}
```

### مثال 2: تغيير اللون الأساسي للأزرق الداكن
في `variables.css`:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #3b82f6;
}
```

### مثال 3: إضافة خدمة "استشارات"
في `services-summary.json`:
```json
{
  "id": "consulting",
  "title": "الاستشارات",
  "titleShort": "استشارات",
  "icon": "fas fa-lightbulb",
  "description": "استشارات تقنية متخصصة",
  "color": "#f59e0b"
}
```

---

**آخر تحديث:** فبراير 2026
