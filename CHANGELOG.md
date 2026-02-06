# تنظيم المشروع - سجل التغييرات

## التغييرات المنفذة (2026-02-06)

### 1. إعادة تنظيم الملفات
- ✅ نقل `package.json` من `apps/` إلى الجذر
- ✅ حذف `apps/package.json` القديم
- ✅ حذف المجلد `site/data/` وملف `projects.json` القديم منه

### 2. توحيد مسارات البيانات
جميع ملفات البيانات الآن في مكان واحد:
```
site/assets/data/
├── company.json     (معلومات الشركة)
├── services.json    (الخدمات)
└── projects.json    (المشاريع - يتم توليده تلقائياً)
```

### 3. تحديث ملفات البناء

#### `apps/build.js`
- تحديث مسار OUTPUT_JSON من `site/data/projects.json` إلى `site/assets/data/projects.json`
- إضافة التحقق من وجود المجلد قبل الكتابة باستخدام `fs.mkdirSync(outputDir, { recursive: true })`

#### `build.js` (الجذر)
- تحديث مسار PROJECTS_JSON من `site/data/projects.json` إلى `site/assets/data/projects.json`
- تحويل الخطأ إلى تحذير عند عدم وجود projects.json (بدلاً من إيقاف البناء)

#### `site/assets/js/data-service.js`
- توحيد المسارات في دالة `reload()`:
  - `company.json` → `${this.dataPath}company.json`
  - `services.json` → `${this.dataPath}services.json`
  - `projects.json` → `${this.dataPath}projects.json`

### 4. تحديث package.json
```json
{
  "scripts": {
    "start": "start index.html",
    "build": "node build.js",
    "build:apps": "node apps/build.js",
    "screenshot": "node apps/screenshot.js"
  }
}
```

## البنية النهائية للمشروع

```
rehbadev-website/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── publish-apk.yml
├── apps/                      # تطبيقات المشاريع
│   ├── build.js              # بناء صفحات المشاريع
│   ├── screenshot.js         # التقاط صور الشاشة
│   ├── alqayimm_app/
│   ├── rh_video_splitter/
│   └── templates/
├── bio/                       # السيرة الذاتية
├── projects/                  # صفحات الهبوط (auto-generated)
├── site/                      # الموقع الرئيسي
│   ├── index.html
│   └── assets/
│       ├── css/
│       ├── data/             # ✨ جميع البيانات هنا
│       │   ├── company.json
│       │   ├── services.json
│       │   └── projects.json (auto-generated)
│       ├── fonts/
│       ├── images/
│       └── js/
├── build.js                   # سكريبت البناء الرئيسي
├── package.json              # ✨ في الجذر (مكانه الصحيح)
└── index.html                # الصفحة الرئيسية

```

## نتائج الإصلاح

✅ **إصلاح خطأ ENOENT**: المجلد يتم إنشاؤه تلقائياً قبل الكتابة
✅ **توحيد المسارات**: جميع البيانات في `site/assets/data/`
✅ **تنظيف الملفات**: حذف الملفات المكررة والقديمة
✅ **اختبار البناء**: `node build.js` يعمل بنجاح ✨
✅ **GitHub Actions**: جاهز للنشر بدون أخطاء

## الأوامر المتاحة

```bash
# بناء كامل (تحديث المشاريع + صفحات الهبوط)
npm run build

# بناء صفحات المشاريع فقط
npm run build:apps

# التقاط صور للمشاريع
npm run screenshot

# فتح الموقع محلياً
npm start
```

## ملاحظات مهمة

1. **projects.json**: يتم توليده تلقائياً من `apps/build.js` - لا تعدله يدوياً
2. **site/assets/data/**: المكان الوحيد لجميع بيانات JSON
3. **package.json**: الآن في الجذر (مكانه الصحيح حسب معايير Node.js)
4. **GitHub Actions**: لا تحتاج إلى تعديل، تعمل مع البنية الجديدة

---

**تاريخ التحديث**: 2026-02-06  
**الحالة**: ✅ مكتمل ومختبر
