# 🚀 RahbaDev Website - موقع رحبة التطوير

موقع احترافي متعدد الصفحات لعرض الخدمات والمشاريع مع حاسبة ذكية لتقدير التكاليف.

<div dir="rtl">

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات الرئيسية](#-المميزات-الرئيسية)
- [البنية والهيكلة](#-البنية-والهيكلة)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [البدء السريع](#-البدء-السريع)
- [الصفحات](#-الصفحات)
- [الخدمات](#-الخدمات)
- [التوثيق](#-التوثيق)
- [الترخيص](#-الترخيص)

---

## 🎯 نظرة عامة

موقع **رحبة التطوير** هو موقع احترافي لشركة تطوير برمجيات متخصصة في:
- تطبيقات الجوال
- تطوير المواقع
- الهويات البصرية
- أتمتة الأعمال

### الهدف
تقديم تجربة مستخدم سلسة لعرض الخدمات وحساب التكاليف والتواصل المباشر.

---

## ✨ المميزات الرئيسية

### 🎨 التصميم
- ✅ تصميم عصري Dark Mode
- ✅ متجاوب 100% (Mobile-First)
- ✅ CSS Modular Architecture (21 ملف)
- ✅ Animations & Transitions ناعمة
- ✅ RTL Support كامل

### 🧮 الحاسبة الذكية
- ✅ واجهة موحدة للخدمات والحاسبة
- ✅ اختيار متعدد مع الإضافات
- ✅ حساب تلقائي للسعر
- ✅ إرسال مباشر لواتساب
- ✅ Sticky Sidebar للمتابعة

### ⚡ الأداء
- ✅ DataService مع تخزين مؤقت (5 دقائق)
- ✅ Logger موحد (5 مستويات)
- ✅ Lazy Loading للصور
- ✅ Async/Defer للسكريبتات
- ✅ CSS Minification

### 🔒 الجودة
- ✅ Error Handling شامل
- ✅ Console Logging منظم
- ✅ توثيق كامل للكود
- ✅ Comments عربي/إنجليزي

---

## 📂 البنية والهيكلة

```
rehbadev-website/
│
├── 📄 index.html                    # الصفحة الرئيسية (redirect)
├── 📄 build.js                      # Build automation
│
├── 📁 site/                         # الموقع الرئيسي
│   ├── index.html                   # الصفحة الرئيسية
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css            # CSS الرئيسي (imports)
│   │   │   └── modules/
│   │   │       ├── base/           # Reset, Typography
│   │   │       ├── components/     # Buttons, Cards, Forms
│   │   │       ├── sections/       # Hero, Services, Footer
│   │   │       └── utilities/      # Helpers, Animations
│   │   └── js/
│   │       ├── app.js              # App initialization
│   │       └── unified-services-calculator.js
│   └── data/
│       ├── services.json           # بيانات الخدمات
│       ├── calculator-services.json
│       └── projects.json
│
├── 📁 bio/                          # صفحة البايو
│   └── index.html
│
├── 📁 projects/                     # صفحات المشاريع
│   ├── alqayimm_app/
│   │   └── index.html
│   └── rh_video_splitter/
│       └── index.html
│
├── 📁 apps/                         # قسم التطبيقات
│   ├── alqayimm_app/
│   ├── rh_video_splitter/
│   └── templates/
│
└── 📁 shared/                       # الموارد المشتركة
    ├── css/
    │   ├── variables.css           # CSS Variables
    │   └── components.css
    ├── js/
    │   ├── data-service.js         # خدمة البيانات
    │   ├── logger.js               # نظام التسجيل
    │   ├── data-loader.js
    │   └── main-site-helper.js
    ├── data/
    │   └── company.json            # معلومات الشركة
    ├── images/                     # الصور والأيقونات
    ├── fonts/                      # الخطوط العربية
    └── vendor/                     # المكتبات الخارجية
        ├── bootstrap.rtl.min.css
        ├── fontawesome/
        └── tippy.js
```

---

## 🛠 التقنيات المستخدمة

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern features, Grid, Flexbox
- **JavaScript (ES6+)** - Async/await, Classes, Modules
- **Bootstrap 5 RTL** - Grid system only
- **Font Awesome 6** - Icons

### Fonts
- **Cairo** - Arabic font (Google Fonts)

### Architecture
- **Vanilla JS** - No frameworks
- **Modular CSS** - 21 organized files
- **DataService** - Centralized data access
- **Logger** - Production-ready logging

### Tools
- **Live Server** - Development server
- **Build.js** - Automation script (optional)

---

## 🚀 البدء السريع

### المتطلبات
- متصفح حديث (Chrome, Firefox, Edge, Safari)
- HTTP Server (Live Server, Python SimpleHTTPServer, etc.)

### التشغيل

#### Option 1: VS Code Live Server
```bash
1. افتح المجلد في VS Code
2. اضغط F1 → "Live Server: Open with Live Server"
3. سيفتح الموقع على http://127.0.0.1:5500
```

#### Option 2: Python Server
```bash
cd rehbadev-website
python -m http.server 8000
# افتح: http://localhost:8000
```

#### Option 3: Node.js http-server
```bash
npm install -g http-server
cd rehbadev-website
http-server -p 8000
```

### الوصول للصفحات
```
الموقع الرئيسي:    http://localhost:5500/site/
البايو:            http://localhost:5500/bio/
المشاريع:          http://localhost:5500/projects/
التطبيقات:         http://localhost:5500/apps/
```

---

## 📄 الصفحات

### 1. الصفحة الرئيسية (`site/index.html`)

#### الأقسام:
- **Hero Section**: عنوان رئيسي + أزرار CTA
- **Services Section**: عرض الخدمات مع الحاسبة الموحدة
- **Bio Section**: معلومات الشركة والتواصل
- **Footer**: روابط سريعة ومعلومات التواصل

#### المميزات:
- Progress bar للتمرير
- Floating WhatsApp button
- Smooth scroll navigation
- Tooltips تفاعلية

### 2. صفحة البايو (`bio/index.html`)

#### المحتوى:
- شعار الشركة
- وصف مختصر
- أزرار التواصل (WhatsApp, Email, Telegram)
- الروابط الاجتماعية (Facebook, GitHub, Play Store)

#### التكامل:
- يستخدم DataService لقراءة معلومات الشركة
- تحديث ديناميكي للروابط
- إخفاء الأيقونات غير المتوفرة

### 3. صفحات المشاريع

#### الهيكل:
```
projects/
├── alqayimm_app/        # تطبيق القائم
└── rh_video_splitter/   # تطبيق تقسيم الفيديو
```

#### المحتوى:
- معلومات المشروع
- Screenshots
- روابط التحميل
- الخصائص والمميزات

---

## 🎯 الخدمات

### الفئات المتاحة

#### 1. تطبيقات الجوال 📱
- تطبيقات Android و iOS
- تطوير Cross-Platform
- تكامل مع APIs
- نشر على المتاجر

#### 2. تطوير المواقع 💻
- مواقع شخصية
- مواقع شركات
- متاجر إلكترونية
- لوحات تحكم

#### 3. الهويات البصرية 🎨
- تصميم الشعارات
- هوية بصرية كاملة
- بطاقات عمل
- ملفات تعريفية

#### 4. أتمتة الأعمال 🤖
- Excel automation
- Web scraping
- تكامل APIs
- Bots ذكية

### إضافة خدمة جديدة

#### 1. افتح `site/data/services.json`
```json
{
  "categories": [
    {
      "id": "mobile",
      "title": "تطبيقات الجوال",
      "services": [
        {
          "id": "android_app",
          "title": "تطبيق أندرويد",
          "description": "...",
          "price": 500,
          "icon": "fas fa-mobile-alt",
          "addons": [
            {"name": "Admin panel", "price": 200}
          ],
          "urgent": 100,
          "exampleUrl": "/projects/example"
        }
      ]
    }
  ]
}
```

#### 2. أعد تحميل الصفحة
الخدمة ستظهر تلقائياً! 🎉

---

## 🎨 التخصيص

### الألوان (`shared/css/variables.css`)
```css
:root {
    --primary-color: #2d6ac8;
    --primary-dark: #1e4a8a;
    --primary-light: #4a90e2;
    
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
}
```

### الخطوط
```css
:root {
    --font-primary: 'Cairo', sans-serif;
    --font-size-base: 16px;
    --font-weight-normal: 400;
    --font-weight-bold: 700;
}
```

### المسافات
```css
:root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;
    --spacing-xl: 5rem;
}
```

---

## 📊 DataService API

### استخدام الخدمة

```javascript
// تحميل معلومات الشركة
const company = await dataService.getCompanyInfo();
console.log(company.name);
console.log(company.contact.whatsapp);

// تحميل الخدمات
const services = await dataService.getServices();
services.categories.forEach(cat => {
    console.log(cat.title);
});

// حساب التكلفة
const result = await dataService.calculateCost(
    'android_app',     // serviceId
    ['admin_panel'],   // addons
    true              // urgent
);
console.log(result.total); // 800
```

### التخزين المؤقت
- مدة التخزين: **5 دقائق**
- يتم التحديث تلقائياً عند انتهاء المدة
- يمكن مسح الكاش يدوياً

---

## 🔧 Logger API

### المستويات

```javascript
logger.debug('رسالة debug');    // 🐛 أزرق
logger.info('رسالة info');      // ℹ️ أبيض
logger.success('رسالة نجاح');   // ✅ أخضر
logger.warn('تحذير');           // ⚠️ أصفر
logger.error('خطأ', error);     // ❌ أحمر
```

### التوقيت
```javascript
logger.time('عملية معينة');
// ... code ...
logger.timeEnd('عملية معينة');
// ⏱️ عملية معينة: 234ms
```

### السجل
```javascript
const history = logger.getHistory();
console.log(history.length); // عدد الرسائل
```

---

## 📚 التوثيق

### الأدلة المتاحة

1. **REFACTORING-CHANGELOG.md** - سجل التحديثات الكامل
2. **QUICK-START-GUIDE.md** - دليل البدء السريع
3. **TESTING-CHECKLIST.md** - قائمة الاختبارات
4. **CSS-MODULAR-README.md** - دليل CSS المعياري
5. **PERFORMANCE-GUIDE.md** - دليل الأداء
6. **SEO-GUIDE.md** - دليل SEO
7. **PROJECT-STATUS.md** - حالة المشروع
8. **UNIFIED-SERVICES-CHANGELOG.md** - تحديثات الواجهة الموحدة

### الأمثلة

في مجلد `site/demos/`:
- **bio-demo.html** - مثال صفحة بايو
- **store-demo.html** - مثال متجر

---

## 🧪 الاختبار

### Checklist
```
✅ الصفحة الرئيسية تحمل بدون أخطاء
✅ الحاسبة تعمل بشكل صحيح
✅ البايو يظهر البيانات
✅ المشاريع تفتح بدون مشاكل
✅ الموقع responsive على جميع الشاشات
✅ الروابط تعمل (داخلية + خارجية)
✅ WhatsApp يفتح برسالة صحيحة
```

### Console Checks
```javascript
// افتح Console (F12)
// تحقق من:
1. لا توجد أخطاء حمراء
2. رسائل Logger منظمة
3. DataService يحمل البيانات
4. لا توجد 404 errors
```

---

## 🚀 النشر (Deployment)

### GitHub Pages
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Enable GitHub Pages
Settings → Pages → Source: main → Save

# 3. الرابط سيكون:
https://yourusername.github.io/rehbadev-website/site/
```

### Netlify
```bash
# 1. سجل دخول Netlify
# 2. New site from Git
# 3. اختر الريبو
# 4. Build settings:
#    Publish directory: ./
# 5. Deploy!
```

### Vercel
```bash
npm install -g vercel
cd rehbadev-website
vercel
# اتبع التعليمات
```

---

## 🐛 المشاكل الشائعة

### 1. الخدمات لا تظهر
```javascript
// تحقق من Console
// هل يوجد خطأ في services.json؟
// تأكد من صحة JSON syntax
```

### 2. البايو يظهر "لا توجد بيانات"
```javascript
// تحقق من:
1. ملف company.json موجود
2. المسار صحيح: ../shared/data/company.json
3. dataService يعمل
```

### 3. الحاسبة لا تحسب
```javascript
// تحقق من:
1. unified-services-calculator.js محمل
2. لا توجد أخطاء في Console
3. الأسعار في services.json أرقام (ليس نص)
```

### 4. الصور لا تظهر
```bash
# تأكد من المسارات:
../shared/images/logo.webp  # ✅
/shared/images/logo.webp    # ❌ مطلق
```

---

## 🔄 التحديثات المستقبلية

### Phase 1 (قريباً)
- [ ] نظام CMS بسيط
- [ ] Blog section
- [ ] Portfolio gallery
- [ ] Testimonials

### Phase 2 (متوسط المدى)
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Advanced filtering
- [ ] Search functionality

### Phase 3 (طويل المدى)
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] User accounts
- [ ] Project tracking

---

## 🤝 المساهمة

نرحب بالمساهمات! 🎉

### كيفية المساهمة:
1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing`)
3. Commit تعديلاتك (`git commit -m 'Add amazing feature'`)
4. Push للbranch (`git push origin feature/amazing`)
5. افتح Pull Request

### إرشادات:
- اتبع نمط الكود الموجود
- أضف comments للكود الجديد
- اختبر تعديلاتك جيداً
- حدّث التوثيق

---

## 📞 التواصل

### رحبة التطوير
- **الموقع**: [rahbadev.com](https://rahbadev.com)
- **الإيميل**: rahbadev@gmail.com
- **واتساب**: [انقر هنا](https://wa.me/963000000000)
- **تيليجرام**: [@rahbadev](https://t.me/rahbadev)
- **GitHub**: [@RahbaDev](https://github.com/RahbaDev)

### الدعم الفني
لأي استفسارات أو مشاكل:
1. افتح Issue على GitHub
2. راسلنا على الإيميل
3. تواصل عبر واتساب

---

## 📜 الترخيص

© 2026 رحبة التطوير. جميع الحقوق محفوظة.

هذا المشروع خاص ولا يمكن استخدامه تجارياً دون إذن.

---

## 🙏 شكر وتقدير

### المكتبات المستخدمة:
- [Bootstrap 5](https://getbootstrap.com/) - CSS Framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [Tippy.js](https://atomiks.github.io/tippyjs/) - Tooltips
- [Cairo Font](https://fonts.google.com/specimen/Cairo) - Arabic Typography

### الأدوات:
- [VS Code](https://code.visualstudio.com/) - Code Editor
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - Development Server
- [GitHub Copilot](https://github.com/features/copilot) - AI Assistant

---

<div align="center">

**صنع بـ ❤️ في سوريا 🇸🇾**

[⬆️ العودة للأعلى](#-rahbadev-website---موقع-رحبة-التطوير)

</div>

</div>
