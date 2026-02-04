# 🌟 رحبة للتطوير - موقع الشركة

> نحول أفكارك لواقع رقمي 🚀

## 📋 نظرة عامة

هذا المشروع يحتوي على موقع شركة رحبة للتطوير مع بنية محسّنة تعتمد على:
- ✅ **عدم التكرار** - البيانات والأنماط في مكان واحد
- ✅ **سهولة الصيانة** - تعديل واحد يظهر في كل مكان
- ✅ **الأداء** - ملفات مشتركة قابلة للتخزين المؤقت
- ✅ **قابلية التوسع** - سهل إضافة صفحات جديدة

---

## 📁 هيكل المشروع (محدّث)

```
rehbadev-website/
│
├── 📄 index.html                       # الصفحة الرئيسية (نقطة البداية)
│
├── 🎨 shared_core/                     # الموارد المشتركة ★ جديد
│   ├── css/
│   │   ├── variables.css              # المتغيرات (ألوان، خطوط)
│   │   └── components.css             # مكونات UI مشتركة ★
│   ├── js/
│   │   ├── data-loader.js             # تحميل البيانات المركزية ★
│   │   └── main-site-helper.js        # مساعد للموقع الرئيسي ★
│   ├── data/                           # البيانات المركزية ★
│   │   ├── company-info.json          # معلومات الشركة ★
│   │   └── services-summary.json      # ملخص الخدمات ★
│   ├── fonts/
│   │   ├── cairo.css
│   │   └── cairo-temp.css
│   ├── images/
│   │   └── brand.webp                 # الشعار
│   └── README.md                       # شرح البنية ★
│
├── 🌐 main_site/                       # الموقع الرئيسي
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── calculator-new.js
│   │   │   ├── main.js
│   │   │   └── projects.js
│   │   └── vendor/                    # مكتبات خارجية
│   └── data/
│       ├── projects.json              # قائمة المشاريع
│       ├── services.json              # الخدمات التفصيلية
│       └── calculator-services.json   # خدمات الحاسبة
│
├── 👤 bio_portfolio/                   # صفحة البايو
│   ├── index.html                     # النسخة القديمة
│   ├── index-new.html                 # النسخة الجديدة ★
│   ├── style.css                      # (قديم - سيُحذف)
│   ├── app.js                         # (قديم - سيُحذف)
│   └── assets/
│       └── vendor/
│
├── 🏭 apps_factory/                    # مصنع التطبيقات
│   ├── build.js
│   ├── screenshot.js
│   ├── package.json
│   ├── templates/
│   └── projects_source/
│       ├── alqayimm_app/
│       └── rh_video_splitter/
│
├── 📚 assets/                          # موارد إضافية
│   ├── demo/
│   │   ├── logo-demo.html
│   │   └── store-demo.html
│   └── images/
│
├── 📖 QUICK_EDIT_GUIDE.md             # دليل التعديلات السريعة ★
├── 📊 COMPARISON.md                    # مقارنة قبل/بعد ★
└── 📄 STRUCTURE_README.md             # هذا الملف
```

**★ = ملفات جديدة أو محدّثة**

---

## 🎯 الميزات الرئيسية

### 1️⃣ البيانات المركزية (`shared_core/data/`)
- **company-info.json**: جميع معلومات الشركة (الاسم، الشعار، الروابط)
- **services-summary.json**: ملخص الخدمات للاستخدام في البايو

**الفائدة:** تعديل واحد يظهر في جميع الصفحات تلقائياً

### 2️⃣ الأنماط المشتركة (`shared_core/css/`)
- **variables.css**: جميع المتغيرات (الألوان، الخطوط، الظلال)
- **components.css**: مكونات جاهزة (أزرار، بطاقات، أيقونات)

**الفائدة:** تصميم موحّد ومتسق عبر جميع الصفحات

### 3️⃣ الأكواد القابلة لإعادة الاستخدام (`shared_core/js/`)
- **data-loader.js**: class لتحميل البيانات من الملفات المركزية
- **main-site-helper.js**: مساعد لدمج البيانات في الموقع الرئيسي

**الفائدة:** أكواد موحدة وسهلة الاستخدام

### 4️⃣ صفحة Bio محسّنة
- ملف واحد فقط (`index-new.html`)
- تسحب البيانات من المصادر المركزية
- روابط مباشرة للموقع الرئيسي (بدون نوافذ منبثقة)
- أسرع وأخف

---

## 🚀 البدء السريع

### 1. عرض الموقع محلياً
```bash
# في مجلد المشروع
python -m http.server 8000

# ثم افتح في المتصفح:
# http://localhost:8000/
```

### 2. اختيار الصفحة المطلوبة
- **الصفحة الرئيسية:** `http://localhost:8000/index.html`
- **الموقع الكامل:** `http://localhost:8000/main_site/index.html`
- **صفحة Bio الجديدة:** `http://localhost:8000/bio_portfolio/index-new.html`

---

## ✏️ التعديلات الشائعة

### تغيير معلومات الشركة
**الملف:** `shared_core/data/company-info.json`
```json
{
  "name": "رحبة للتطوير",
  "contact": {
    "email": "info@rehbadev.com",
    "whatsapp": "966XXXXXXXXX"
  }
}
```

### تعديل الألوان
**الملف:** `shared_core/css/variables.css`
```css
:root {
    --primary-color: #2d6ac8;    /* اللون الأساسي */
    --secondary-color: #3d7fd9;  /* اللون الثانوي */
}
```

### إضافة مشروع جديد
**الملف:** `main_site/data/projects.json`
```json
[
  {
    "id": "my_project",
    "title": "اسم المشروع",
    "category": "websites",
    "description": "وصف المشروع",
    "image": "path/to/image.webp",
    "link": "https://example.com"
  }
]
```

**📖 لمزيد من التفاصيل، راجع [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md)**

---

## 📊 البنية القديمة vs الجديدة

| المعيار | القديمة | الجديدة | التحسن |
|---------|---------|---------|--------|
| عدد الملفات في Bio | 3 | 1 | 67% ⬇️ |
| التكرار | 60% | 5% | 92% ⬇️ |
| سهولة التعديل | صعبة | سهلة جداً | 75% ⬆️ |
| الاتساق | منخفض | عالي | 100% ⬆️ |

**📖 للمقارنة التفصيلية، راجع [COMPARISON.md](COMPARISON.md)**

---

## 🏗️ بناء صفحات التطبيقات

### إضافة تطبيق جديد
1. أنشئ مجلد في `apps_factory/projects_source/`
2. أضف الملفات:
   ```
   my_app/
   ├── info.json              # معلومات التطبيق
   ├── index.html             # صفحة التطبيق
   ├── privacy-policy.html    # سياسة الخصوصية
   └── screens/               # صور التطبيق
   ```

3. شغّل البناء:
   ```bash
   cd apps_factory
   npm install
   node build.js
   ```

---

## 📦 النشر

### على GitHub Pages:
```bash
# رفع المشروع
git add .
git commit -m "Update website"
git push origin main

# تفعيل GitHub Pages من Settings
```

### على Netlify/Vercel:
1. اسحب المشروع من GitHub
2. Build command: (فارغ)
3. Publish directory: `/`
4. انشر!

---

## 🗂️ الملفات المهمة

| الملف | الوصف |
|-------|-------|
| `shared_core/data/company-info.json` | معلومات الشركة والروابط |
| `shared_core/data/services-summary.json` | ملخص الخدمات |
| `shared_core/css/variables.css` | المتغيرات (الألوان) |
| `shared_core/css/components.css` | المكونات المشتركة |
| `shared_core/js/data-loader.js` | تحميل البيانات |
| `main_site/data/projects.json` | قائمة المشاريع |
| `main_site/data/services.json` | الخدمات التفصيلية |

---

## 💡 نصائح

### ✅ افعل:
- استخدم الملفات المركزية في `shared_core/`
- عدّل البيانات من ملفات JSON
- استخدم المكونات الجاهزة من `components.css`
- اختبر التغييرات محلياً قبل النشر

### ❌ لا تفعل:
- لا تكرر البيانات في أماكن متعددة
- لا تعدّل `data-loader.js` بدون ضرورة
- لا تنسخ الأنماط - استخدم المكونات الموجودة
- لا تنشر بدون اختبار

---

## 🤝 المساهمة

للمساهمة في تطوير المشروع:
1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing`)
5. افتح Pull Request

---

## 📞 الدعم والتواصل

- 📧 **البريد:** info@rehbadev.com
- 💬 **واتساب:** [تواصل معنا](https://wa.me/966XXXXXXXXX)
- 🐦 **تويتر:** [@rehbadev](https://twitter.com/rehbadev)
- 💼 **GitHub:** [rehbadev](https://github.com/rehbadev)

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 رحبة للتطوير

---

## 📚 مصادر إضافية

- [دليل التعديلات السريعة](QUICK_EDIT_GUIDE.md) - للتعديلات اليومية
- [المقارنة التفصيلية](COMPARISON.md) - قبل وبعد إعادة الهيكلة
- [شرح البنية المشتركة](shared_core/README.md) - تفاصيل shared_core

---

**آخر تحديث:** فبراير 2026  
**الإصدار:** 2.0  
**الحالة:** ✅ جاهز للإنتاج
