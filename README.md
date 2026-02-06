# 🌟 موقع رحبة التطوير | Rehba Dev Website

موقع احترافي لعرض الخدمات والمشاريع الرقمية مع نظام بناء تلقائي متكامل.

[![Deploy Website](https://github.com/rahbadev/rahbadev.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/rahbadev/rahbadev.github.io/actions/workflows/deploy.yml)

## 🚀 المزايا الرئيسية

- ✨ **تصميم متجاوب 100%** - يعمل على جميع الأجهزة
- 🎨 **واجهة عربية أنيقة** - مع دعم RTL كامل
- 📊 **حاسبة تفاعلية** - لتقدير تكلفة المشاريع
- 🔄 **نظام بناء تلقائي** - توليد صفحات المشاريع تلقائياً
- 🎯 **SEO محسّن** - معد لمحركات البحث
- ⚡ **أداء عالي** - تحميل سريع وكاش ذكي

## 📁 بنية المشروع

```
rehbadev-website/
├── 📦 apps/                    # تطبيقات المشاريع
│   ├── build.js               # بناء صفحات المشاريع
│   ├── screenshot.js          # التقاط صور الشاشة
│   ├── alqayimm_app/         # مشروع 1
│   ├── rh_video_splitter/    # مشروع 2
│   └── templates/            # قوالب HTML
│
├── 🌐 site/                    # الموقع الرئيسي
│   └── assets/
│       ├── css/              # ملفات التنسيق
│       ├── data/             # 📊 جميع البيانات JSON
│       │   ├── company.json
│       │   ├── services.json
│       │   └── projects.json (auto-generated)
│       ├── fonts/            # الخطوط
│       ├── images/           # الصور
│       └── js/               # ملفات JavaScript
│           ├── app.js
│           ├── data-service.js
│           └── unified-services-calculator.js
│
├── 🎯 projects/               # صفحات هبوط (auto-generated)
├── 👤 bio/                     # السيرة الذاتية
├── 🔧 build.js                 # سكريبت البناء الرئيسي
└── 📦 package.json            # إعدادات المشروع

```

## 🛠️ التثبيت والإعداد

### المتطلبات
- Node.js 20.x أو أحدث
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/rahbadev/rahbadev.github.io.git
cd rahbadev.github.io

# 2. تثبيت الحزم (اختياري للـ screenshots فقط)
npm install

# 3. بناء المشروع
npm run build

# 4. فتح الموقع
npm start
```

## 📜 الأوامر المتاحة

| الأمر | الوصف |
|------|-------|
| `npm run build` | بناء كامل (تحديث المشاريع + صفحات الهبوط) |
| `npm run build:apps` | بناء صفحات المشاريع فقط |
| `npm run screenshot` | التقاط صور للمشاريع بشكل تلقائي |
| `npm start` | فتح الموقع في المتصفح |

## 🔄 نظام البناء التلقائي

### كيف يعمل؟

1. **apps/build.js**: 
   - يقرأ ملفات `info.json` من كل مشروع
   - يولد صفحات HTML من القوالب
   - يحدث ملف `projects.json` في `site/assets/data/`

2. **build.js** (الجذر):
   - يشغل `apps/build.js`
   - يولد صفحات هبوط في `projects/`
   - ينشئ روابط تحويل للمشاريع

3. **GitHub Actions**:
   - يُشغل تلقائياً عند كل push
   - ينفذ البناء الكامل
   - ينشر على GitHub Pages

### إضافة مشروع جديد

```bash
# 1. إنشاء مجلد المشروع
cd apps
mkdir my_new_project

# 2. إنشاء info.json
cp templates/info.json.example my_new_project/info.json

# 3. تعديل البيانات في info.json

# 4. إضافة ملفات المشروع
# - logo.webp (شعار المشروع)
# - screens/ (صور الشاشات)

# 5. بناء المشروع
npm run build
```

## 🎨 التخصيص

### تعديل البيانات

جميع البيانات في `site/assets/data/`:

- **company.json**: معلومات الشركة والتواصل
- **services.json**: الخدمات المقدمة
- **projects.json**: يتم توليده تلقائياً (لا تعدله يدوياً)

### تعديل التصميم

- **الألوان**: `site/assets/css/variables.css`
- **التنسيق**: `site/assets/css/main.css`
- **الخطوط**: `site/assets/fonts/`

### تعديل الحاسبة

```javascript
// site/assets/js/unified-services-calculator.js
// قم بتعديل الأسعار والخيارات حسب الحاجة
```

## 🌐 النشر

### GitHub Pages (تلقائي)

عند كل push إلى `main`:
1. يُشغل GitHub Actions
2. يبني المشروع
3. ينشر على `gh-pages`

### النشر اليدوي

```bash
# بناء المشروع
npm run build

# رفع التغييرات
git add .
git commit -m "Update website"
git push origin main
```

## 🔧 التقنيات المستخدمة

- **HTML5** - البنية
- **CSS3** - التنسيق والرسوم المتحركة
- **JavaScript (Vanilla)** - بدون مكتبات ثقيلة
- **Bootstrap 5 RTL** - الشبكة والمكونات
- **Font Awesome 6** - الأيقونات
- **Tippy.js** - التلميحات
- **Google Fonts (Cairo)** - الخطوط العربية

## 📊 إحصائيات الأداء

- ⚡ سرعة التحميل: < 2 ثانية
- 📦 حجم الصفحة: < 500 KB
- 🎯 نقاط SEO: 95/100
- 📱 متوافق مع الجوال: 100%

## 🤝 المساهمة

نرحب بجميع المساهمات! الرجاء:

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع غير مرخص للاستخدام العام (UNLICENSED).  
جميع الحقوق محفوظة © 2026 رحبة التطوير

## 📞 التواصل

- **الموقع**: [rehbadev.com](https://rehbadev.com)
- **البريد**: info@rehbadev.com
- **GitHub**: [@rahbadev](https://github.com/rahbadev)

---

صُنع بـ ❤️ من فريق رحبة التطوير
