# دليل النشر

## GitHub Pages (مجاني)

```bash
git init
git add .
git commit -m "v2.0"
git remote add origin https://github.com/USERNAME/rehbadev-website.git
git push -u origin main
```

في GitHub: Settings → Pages → Source: main branch → Save

الموقع: `https://USERNAME.github.io/rehbadev-website/`

## Vercel (سريع)

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Netlify

اسحب المجلد على [netlify.com/drop](https://app.netlify.com/drop)
# اتبع التعليمات لإضافة DNS records
```

---

## 🟩 الخيار 3: Netlify (شامل)

### المزايا
- ✅ **مجاني للمشاريع الشخصية**
- ✅ نماذج اتصال مدمجة
- ✅ دوال Serverless مجانية
- ✅ نشر من Git أو يدوي
- ✅ إعادات توجيه وheaders مخصصة

### خطوات النشر

#### 1. عبر الويب (الأسهل)

1. اذهب إلى [netlify.com](https://www.netlify.com)
2. اضغط "Add new site" → "Deploy manually"
3. اسحب مجلد المشروع بالكامل
4. انتظر الرفع (30 ثانية)

**الموقع متاح على:**
```
https://random-name-123.netlify.app
```

#### 2. عبر Netlify CLI

```bash
# تثبيت CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
netlify deploy

# للإنتاج
netlify deploy --prod
```

#### 3. (اختياري) النشر التلقائي من Git

1. في Netlify Dashboard: "Add new site" → "Import from Git"
2. اختر GitHub/GitLab/Bitbucket
3. اختر المستودع
4. Build settings:
   ```
   Build command: (leave empty)
   Publish directory: ./
   ```
5. Deploy!

كل push لـ `main` سيُنشر تلقائياً.

---

## 📋 ملف التكوين (اختياري)

### netlify.toml

أنشئ ملف `netlify.toml` في الجذر:

```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/app/*"
  to = "/apps/:splat"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    
[[headers]]
  for = "/shared/data/*.json"
  [headers.values]
    Cache-Control = "public, max-age=300"
```

---

## 🔍 التحقق بعد النشر

### 1. اختبار الصفحات الرئيسية

```bash
✅ / (الصفحة الرئيسية)
✅ /site/ (الموقع)
✅ /bio/ (البايو)
✅ /apps/ (التطبيقات)
✅ /projects/alqayimm_app/ (مشروع 1)
✅ /projects/rh_video_splitter/ (مشروع 2)
```

### 2. اختبار البيانات

افتح Developer Tools → Console:

```javascript
// يجب أن تعمل بدون أخطاء
✅ services.json يُحمّل
✅ company.json يُحمّل
✅ لا أخطاء 404
✅ لا أخطاء CORS
```

### 3. اختبار الوظائف

```bash
✅ الخدمات تُعرض بشكل صحيح
✅ الحاسبة تعمل
✅ إضافة خدمة للحاسبة
✅ إضافة إضافات
✅ حساب الإجمالي
✅ زر WhatsApp يفتح برقم صحيح
✅ البايو يعرض الاسم والبيانات
✅ صفحات التطبيقات تعمل
```

### 4. اختبار الأداء

استخدم [PageSpeed Insights](https://pagespeed.web.dev/):

```bash
✅ Performance: >90
✅ Accessibility: >85
✅ Best Practices: >90
✅ SEO: >90
✅ Load Time: <2s
```

---

## 🔧 استكشاف الأخطاء

### مشكلة: 404 للملفات

**السبب:** مسارات خاطئة  
**الحل:**
```html
<!-- تأكد من المسارات النسبية -->
<link rel="stylesheet" href="../shared/css/variables.css">
<script src="../shared/js/data-service.js"></script>
```

### مشكلة: company.json لا يُحمّل

**السبب:** مسار خاطئ في DataService  
**الحل:**
```javascript
// في data-service.js
const basePath = window.location.pathname.includes('/site/') 
  ? '../shared/data/' 
  : 'shared/data/';
```

### مشكلة: CORS errors

**السبب:** محاولة فتح `file://` محلياً  
**الحل:**
```bash
# استخدم خادم محلي
npx serve .
# أو
python -m http.server 8000
```

### مشكلة: الخطوط لا تظهر

**السبب:** مسار `cairo.css` خاطئ  
**الحل:**
```html
<!-- في كل HTML -->
<link rel="stylesheet" href="../shared/fonts/cairo.css">
```

---

## 📊 مراقبة الأداء

### Google Analytics (اختياري)

أضف في `<head>` لكل صفحة:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Hotjar (اختياري)

لتتبع سلوك المستخدمين:

```html
<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HJID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 🔐 الأمان

### Headers الموصى بها

إذا كنت تستخدم Netlify، أضف في `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self';"
```

### HTTPS

- ✅ GitHub Pages: تلقائي
- ✅ Vercel: تلقائي
- ✅ Netlify: تلقائي

---

## 📝 Checklist النشر النهائي

قبل النشر، تأكد من:

```bash
□ تحديث company.json بالبيانات الحقيقية
□ تحديث رقم WhatsApp
□ تحديث روابط social media
□ تحديث services.json بالأسعار الحالية
□ اختبار جميع الروابط
□ اختبار جميع الصفحات
□ اختبار responsive على mobile
□ فحص console للأخطاء
□ فحص Network للـ 404s
□ اختبار أداء PageSpeed
□ إضافة favicon.ico
□ إضافة robots.txt (اختياري)
□ إضافة sitemap.xml (اختياري)
□ Git commit وpush
□ النشر!
```

---

## 🎉 بعد النشر

### 1. شارك الموقع

```
🌐 الموقع الآن متاح على:
https://your-domain.com

📱 شارك على:
- WhatsApp Status
- LinkedIn
- Twitter
- Facebook
```

### 2. راقب الأداء

- افتح Google Analytics يومياً
- راقب سرعة التحميل
- تحقق من الأخطاء في Console
- اقرأ تعليقات المستخدمين

### 3. التحديثات المستقبلية

```bash
# لكل تحديث:
git add .
git commit -m "Update: [وصف التحديث]"
git push

# سيُنشر تلقائياً على:
# - GitHub Pages (بعد 2-3 دقائق)
# - Vercel (فوري)
# - Netlify (فوري)
```

---

## 📞 الدعم

إذا واجهت مشاكل:

1. راجع [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. افحص console للأخطاء
3. راجع [FINAL-AUDIT-REPORT.md](FINAL-AUDIT-REPORT.md)
4. تواصل مع الدعم الفني للمنصة

---

**الموقع جاهز للنشر! 🚀**

للمزيد من التفاصيل:
- [QUICK-START.md](QUICK-START.md) - البدء السريع
- [PROJECT-STATUS.md](PROJECT-STATUS.md) - حالة المشروع
- [CHANGELOG.md](CHANGELOG.md) - سجل التغييرات
