# ⚠️ مهم جداً: تعليمات الحفاظ على التنسيقات

## المشكلة
عند رفع الكود، بعض أدوات التنسيق التلقائي (Prettier, Beautify, etc.) تفسد القوالب بفصل الأقواس `{{PRIMARY_COLOR}}` مما يكسر عملية البناء.

## الحل
تم إضافة الحمايات التالية:

### 1. ملف `.prettierignore`
يمنع Prettier من تنسيق القوالب والملفات المولدة

### 2. ملف `.editorconfig`
يمنع أي محرر نصوص من التعديل التلقائي على القوالب

### 3. ملف `.gitattributes`
يعلّم القوالب المولدة كـ "generated files"

### 4. تعليق `/* prettier-ignore */`
في القالب نفسه لحماية السطر الحرج

## التعليمات

### ❌ لا تفعل أبداً:
- تشغيل Format Document على ملفات `_templates/`
- تعديل الملفات المولدة في `projects/*/index.html` مباشرة
- حذف ملفات الحماية (`.prettierignore`, `.editorconfig`)

### ✅ الطريقة الصحيحة:
1. عدّل ملف `_templates/project-template.html` بحذر
2. عدّل ملف `info.json` للمشروع
3. شغّل `node build.js` لإعادة البناء
4. ارفع الملفات بدون تشغيل format

## البناء
```bash
node build.js
```

هذا الأمر يقرأ القوالب ويستبدل المتغيرات بالقيم الصحيحة لكل مشروع.

## إذا فسدت التنسيقات
إذا لاحظت اختفاء:
- الألوان الديناميكية
- التوهج
- أيقونة الـ APK
- تنسيق اسم التطبيق

**الحل:**
```bash
# تأكد أن القالب صحيح
# السطر المهم في _templates/project-template.html:
# /* prettier-ignore */
# :root{--primary:{{PRIMARY_COLOR}};--primary-rgb:{{PRIMARY_RGB}};...}

# ثم أعد البناء
node build.js
```

---
✨ **نصيحة:** استخدم VS Code Extension "Format on Save" ولكن أضف القوالب للاستثناء
