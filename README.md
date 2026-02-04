# 🌟 رحبة التطوير - Rehba Dev

موقع احترافي لشركة رحبة التطوير - حلول رقمية متكاملة

## 📁 بنية المشروع

```
rehbadev-website/
├── shared/                    # الموارد المشتركة
│   ├── data/
│   │   └── company-info.json # 🎯 مصدر البيانات المركزي
│   ├── css/                  # الأنماط المشتركة
│   ├── js/                   # السكريبتات المشتركة
│   ├── images/               # الصور والأيقونات
│   ├── fonts/                # الخطوط
│   └── vendor/               # المكتبات الخارجية
│
├── site/                      # الموقع الرئيسي
│   ├── index.html
│   ├── assets/
│   │   ├── css/main.css
│   │   └── js/
│   │       ├── app.js
│   │       ├── calculator-new.js
│   │       └── projects.js
│   └── data/
│       ├── services.json
│       ├── calculator-services.json
│       └── projects.json
│
├── bio/                       # صفحة البايو
│   └── index.html
│
├── apps/                      # مشاريع التطبيقات
│   ├── build.js              # سكريبت بناء المشاريع
│   ├── screenshot.js         # سكريبت لقطات الشاشة
│   ├── alqayimm_app/
│   ├── rh_video_splitter/
│   └── templates/
│
├── build.js                   # 🔨 سكريبت البناء الرئيسي
└── .gitignore
```

## 🎯 البيانات المشتركة

### shared/data/company-info.json

**المصدر الوحيد للحقيقة** - جميع معلومات الشركة مركزية هنا:

```json
{
  "company": {
    "name": "رحبة التطوير",
    "tagline": "نحول أفكارك إلى واقع رقمي"
  },
  "contact": {
    "email": "rahbadev@gmail.com",
    "whatsapp": "963000000000",
    "whatsappLink": "https://wa.me/963000000000",
    "telegram": "@rahbadev",
    "telegramLink": "https://t.me/rahbadev"
  },
  "social": {
    "facebook": "...",
    "twitter": "...",
    "github": "...",
    "playstore": "..."
  }
}
```

### كيفية الاستخدام

**في أي صفحة HTML:**

```javascript
fetch('../shared/data/company-info.json')
  .then(res => res.json())
  .then(data => {
    // استخدم البيانات
    document.getElementById('email').href = `mailto:${data.contact.email}`;
    document.getElementById('whatsapp').href = data.contact.whatsappLink;
  });
```

**الصفحات المتصلة:**
- ✅ `site/index.html` - الموقع الرئيسي
- ✅ `bio/index.html` - صفحة البايو

## 🔨 عملية البناء

```bash
# بناء المشروع محلياً
node build.js

# سيقوم بـ:
# 1. تشغيل apps/build.js (تحديث المشاريع)
# 2. إنشاء projects/ (صفحات Landing)
```

### GitHub Actions

عند الدفع إلى `main`:
1. يشغل `node build.js`
2. يولد `projects/` directory
3. ينشر على GitHub Pages

## 📝 إضافة مشروع جديد

1. **أنشئ مجلد في `apps/`:**
   ```bash
   apps/my_new_project/
   ├── info.json
   ├── index.html (optional)
   ├── icon.png
   ├── logo.webp
   └── screens/
   ```

2. **املأ `info.json`:**
   ```json
   {
     "title": "اسم المشروع",
     "tagline": "وصف قصير",
     "colors": {"primary": "#2d6ac8"},
     "features": ["..."],
     "downloads": [...]
   }
   ```

3. **شغل البناء:**
   ```bash
   node build.js
   ```

## 🎨 التصميم

### الألوان الرئيسية
```css
--primary-color: #2d6ac8;    /* أزرق */
--secondary-color: #f472b6;  /* وردي */
--dark-bg: #0f172a;          /* داكن */
```

### الخطوط
- العربية: Cairo
- الإنجليزية: Cairo

## 🚀 النشر

### محلياً
```bash
# في مجلد site/
python -m http.server 8000
# افتح http://localhost:8000
```

### الإنتاج
```bash
git add .
git commit -m "your message"
git push
# GitHub Actions ستبني وتنشر تلقائياً
```

## 📊 الأداء

### التحسينات المطبقة:
- ✅ تحميل البيانات بشكل غير متزامن
- ✅ CSS محسّن (إزالة backdrop-filter الثقيل)
- ✅ صور WebP بدلاً من PNG
- ✅ تحميل السكريبتات بشكل defer
- ✅ تقليل حجم الملفات

### السرعة:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

## 🔄 التحديثات المستقبلية

### لتحديث معلومات الاتصال:
1. افتح `shared/data/company-info.json`
2. عدّل القيم المطلوبة
3. احفظ - كل الصفحات ستتحدث تلقائياً!

### لإضافة خدمة جديدة:
1. افتح `site/data/services.json`
2. أضف الخدمة في الفئة المناسبة
3. أضف أيضاً في `calculator-services.json` للحاسبة

## 📞 الدعم

للمساعدة أو الاستفسارات:
- 📧 Email: rahbadev@gmail.com
- 💬 WhatsApp: +963000000000
- 📱 Telegram: @rahbadev

## 📄 الترخيص

© 2026 رحبة التطوير - جميع الحقوق محفوظة

---

صُنع بـ ❤️ في سوريا
