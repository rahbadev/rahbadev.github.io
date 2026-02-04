# 🔧 مرجع المطور السريع

## 📚 الملفات الأساسية

| الملف | الوصف | متى تعدّله |
|-------|-------|------------|
| `shared_core/data/company-info.json` | معلومات الشركة | عند تغيير معلومات الاتصال |
| `shared_core/data/services-summary.json` | ملخص الخدمات | عند إضافة/تعديل خدمة |
| `shared_core/css/variables.css` | المتغيرات العامة | عند تغيير الألوان/الخطوط |
| `shared_core/css/components.css` | المكونات المشتركة | عند إنشاء مكون جديد |
| `shared_core/js/data-loader.js` | تحميل البيانات | نادراً (API مستقر) |

---

## 🎨 المتغيرات المتاحة

### الألوان الأساسية
```css
--primary-color: #2d6ac8;      /* اللون الأساسي */
--secondary-color: #3d7fd9;    /* اللون الثانوي */
--accent-color: #5ca3e8;       /* لون التأكيد */
```

### ألوان الحالة
```css
--success-color: #10b981;      /* أخضر - نجاح */
--warning-color: #f59e0b;      /* برتقالي - تحذير */
--danger-color: #ef4444;       /* أحمر - خطر */
```

### الخلفيات
```css
--dark-bg: #0f172a;            /* خلفية داكنة */
--card-bg: #1e293b;            /* خلفية البطاقات */
--card-hover: #334155;         /* hover للبطاقات */
```

### النصوص
```css
--text-primary: #ffffff;       /* نص أساسي */
--text-secondary: #cbd5e1;     /* نص ثانوي */
--text-muted: #94a3b8;         /* نص باهت */
```

---

## 🧩 المكونات الجاهزة

### الأزرار
```html
<!-- أزرار أساسية -->
<button class="btn btn-primary">زر أساسي</button>
<button class="btn btn-secondary">زر ثانوي</button>

<!-- في CSS -->
.btn { /* أنماط الزر الأساسية */ }
.btn-primary { /* أنماط الزر الأساسي */ }
.btn-secondary { /* أنماط الزر الثانوي */ }
```

### البطاقات
```html
<div class="card">
    <h3 class="card-title">عنوان البطاقة</h3>
    <p class="card-description">وصف البطاقة</p>
</div>
```

### الأيقونات الاجتماعية
```html
<div class="social-links">
    <a href="#" class="social-btn whatsapp"><i class="fab fa-whatsapp"></i></a>
    <a href="#" class="social-btn twitter"><i class="fab fa-twitter"></i></a>
    <a href="#" class="social-btn github"><i class="fab fa-github"></i></a>
</div>
```

### الشبكات
```html
<!-- شبكة 2 أعمدة -->
<div class="grid-2">...</div>

<!-- شبكة 3 أعمدة -->
<div class="grid-3">...</div>

<!-- شبكة 4 أعمدة -->
<div class="grid-4">...</div>
```

### الرسوم المتحركة
```html
<!-- إضافة كلاسات الأنيميشن -->
<div class="fade-in">يظهر تدريجياً</div>
<div class="fade-in-up">يظهر من الأسفل</div>
<div class="fade-in-down">يظهر من الأعلى</div>
<div class="scale-in">يكبر تدريجياً</div>
<div class="slide-in-right">ينزلق من اليمين</div>
```

### أدوات النصوص
```html
<h1 class="text-gradient">نص بتدرج لوني</h1>
<p class="text-center">نص في المنتصف</p>
<p class="text-muted">نص باهت</p>
<p class="text-secondary">نص ثانوي</p>
```

### الشارات (Badges)
```html
<span class="badge badge-success">مكتمل</span>
<span class="badge badge-warning">قيد التطوير</span>
<span class="badge badge-primary">جديد</span>
```

---

## 💻 استخدام DataLoader

### التهيئة
```javascript
const dataLoader = new DataLoader();
// أو مع مسار مخصص
const dataLoader = new DataLoader('path/to/data');
```

### تحميل البيانات
```javascript
// معلومات الشركة
const companyInfo = await dataLoader.getCompanyInfo();

// ملخص الخدمات
const services = await dataLoader.getServicesSummary();

// المشاريع (من main_site)
const projects = await dataLoader.getProjects();

// المشاريع مع حد أقصى
const limitedProjects = await dataLoader.getProjectsSummary(6);

// الخدمات الكاملة
const fullServices = await dataLoader.getFullServices();

// خدمات الحاسبة
const calcServices = await dataLoader.getCalculatorServices();
```

### التخزين المؤقت
```javascript
// مسح الكاش
dataLoader.clearCache();

// إعادة تحميل ملف محدد
const newData = await dataLoader.reload('company-info.json');
```

---

## 🎯 أمثلة شائعة

### مثال 1: صفحة جديدة بسيطة
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <link href="../shared_core/fonts/cairo.css" rel="stylesheet">
    <link rel="stylesheet" href="../shared_core/css/variables.css">
    <link rel="stylesheet" href="../shared_core/css/components.css">
</head>
<body>
    <div class="container">
        <h1 class="text-gradient">عنوان الصفحة</h1>
        <div class="grid-3">
            <div class="card">محتوى 1</div>
            <div class="card">محتوى 2</div>
            <div class="card">محتوى 3</div>
        </div>
    </div>

    <script src="../shared_core/js/data-loader.js"></script>
    <script>
        const dataLoader = new DataLoader();
        // استخدم البيانات...
    </script>
</body>
</html>
```

### مثال 2: عرض الخدمات ديناميكياً
```javascript
async function displayServices() {
    const dataLoader = new DataLoader();
    const services = await dataLoader.getServicesForBio();
    
    const container = document.getElementById('services');
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        `;
        container.appendChild(card);
    });
}
```

### مثال 3: تحديث معلومات الشركة
```javascript
async function updateCompanyInfo() {
    const dataLoader = new DataLoader();
    const info = await dataLoader.getCompanyInfo();
    
    // تحديث العنوان
    document.querySelector('h1').textContent = info.name;
    
    // تحديث الشعار
    document.querySelector('img.logo').src = info.logo;
    
    // تحديث الواتساب
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    whatsappBtn.href = `https://wa.me/${info.contact.whatsapp}`;
}
```

---

## 🔍 التنقيح (Debugging)

### فحص البيانات المحملة
```javascript
const dataLoader = new DataLoader();

// تحميل البيانات
const data = await dataLoader.getCompanyInfo();

// طباعة في Console
console.log('Company Info:', data);
console.table(data.contact);
```

### فحص التخزين المؤقت
```javascript
// عرض الكاش
console.log('Cache:', dataLoader.cache);

// عرض ملف محدد
console.log('Company Info Cache:', dataLoader.cache['company-info.json']);
```

### معالجة الأخطاء
```javascript
try {
    const data = await dataLoader.getCompanyInfo();
    if (!data) {
        console.error('Failed to load company info');
        return;
    }
    // استخدم البيانات...
} catch (error) {
    console.error('Error:', error);
}
```

---

## 📱 التصميم المتجاوب

### نقاط التوقف (Breakpoints)
```css
/* موبايل (افتراضي) */
.element { ... }

/* تابلت وأكبر */
@media (min-width: 768px) {
    .element { ... }
}

/* كمبيوتر */
@media (min-width: 1024px) {
    .element { ... }
}

/* شاشات كبيرة */
@media (min-width: 1280px) {
    .element { ... }
}
```

### إخفاء/إظهار حسب الحجم
```css
/* إخفاء في الموبايل */
@media (max-width: 767px) {
    .hide-mobile { display: none; }
}

/* إخفاء في الكمبيوتر */
@media (min-width: 768px) {
    .hide-desktop { display: none; }
}
```

---

## ⚡ نصائح للأداء

### 1. استخدم التخزين المؤقت
```javascript
// لا تفعل هذا (يحمل في كل مرة)
async function getData() {
    const loader = new DataLoader();
    return await loader.getCompanyInfo();
}

// افعل هذا (يحمل مرة واحدة)
const dataLoader = new DataLoader();
async function getData() {
    return await dataLoader.getCompanyInfo();
}
```

### 2. تحميل البيانات مرة واحدة
```javascript
// في بداية الصفحة
const dataLoader = new DataLoader();
let companyInfo, services;

async function init() {
    [companyInfo, services] = await Promise.all([
        dataLoader.getCompanyInfo(),
        dataLoader.getServicesSummary()
    ]);
}
```

### 3. استخدم المكونات الجاهزة
```html
<!-- بدلاً من كتابة CSS جديد -->
<button class="btn btn-primary">زر</button>

<!-- استخدم المكونات الموجودة -->
```

---

## 🚫 الأخطاء الشائعة

### ❌ خطأ: مسار خاطئ
```javascript
const loader = new DataLoader('/shared_core/data'); // ✗ مطلق
```
```javascript
const loader = new DataLoader('../shared_core/data'); // ✓ نسبي
```

### ❌ خطأ: نسيان await
```javascript
const data = dataLoader.getCompanyInfo(); // ✗ Promise
console.log(data.name); // undefined
```
```javascript
const data = await dataLoader.getCompanyInfo(); // ✓
console.log(data.name); // رحبة للتطوير
```

### ❌ خطأ: تكرار استيراد المكتبات
```html
<!-- في كل صفحة -->
<link href="../shared_core/css/variables.css"> <!-- ✓ -->
<link href="../shared_core/css/components.css"> <!-- ✓ -->
<link href="custom-styles.css"> <!-- ✓ فقط للأنماط الخاصة -->
```

---

## 📦 الحزم والمكتبات المستخدمة

| المكتبة | الاستخدام | CDN/محلي |
|---------|-----------|----------|
| Cairo Font | الخط العربي | محلي |
| Font Awesome | الأيقونات | محلي |
| Bootstrap (اختياري) | الشبكات | محلي |

---

## 🔗 روابط مفيدة

- [دليل التعديلات السريعة](QUICK_EDIT_GUIDE.md)
- [شرح البنية](shared_core/README.md)
- [دليل الانتقال](MIGRATION_GUIDE.md)
- [المقارنة التفصيلية](COMPARISON.md)

---

## 💡 أفضل الممارسات

1. **استخدم المتغيرات دائماً**
   ```css
   /* ✗ */ color: #2d6ac8;
   /* ✓ */ color: var(--primary-color);
   ```

2. **استخدم المكونات الجاهزة**
   ```html
   <!-- ✗ --> <div style="...">
   <!-- ✓ --> <div class="card">
   ```

3. **حمّل البيانات مرة واحدة**
   ```javascript
   // ✓ في البداية فقط
   const dataLoader = new DataLoader();
   ```

4. **اختبر على أجهزة مختلفة**
   - Desktop
   - Tablet
   - Mobile

5. **استخدم Git**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```

---

**آخر تحديث:** فبراير 2026  
**للاستفسارات:** راجع التوثيق أو افتح issue
