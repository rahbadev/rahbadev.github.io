# 🚀 Quick Start Guide - DataService & Logger

## إعداد سريع (30 ثانية)

### 1. أضف في HTML
```html
<!-- قبل إغلاق </body> -->
<script src="../shared/js/logger.js" defer></script>
<script src="../shared/js/data-service.js" defer></script>
<script src="assets/js/app.js" defer></script>
```

### 2. استخدم في JavaScript
```javascript
document.addEventListener('DOMContentLoaded', async () => {
    logger.info('بدء التطبيق');
    
    const services = await dataService.getServices();
    const company = await dataService.getCompanyInfo();
    
    logger.success('تم التحميل بنجاح');
});
```

---

## 📚 DataService API

### جلب البيانات

```javascript
// معلومات الشركة
const company = await dataService.getCompanyInfo();
// { name, description, contact, social, ... }

// جميع الخدمات
const allServices = await dataService.getServices();
// { version, categories: [...] }

// خدمة محددة
const logoService = await dataService.getServiceById('logo');
// { id, title, description, price, ... }

// خدمات حسب الفئة
const designServices = await dataService.getServicesByCategory('design');
// [{ id, title, ... }, ...]
```

### حساب التكلفة

```javascript
// حساب تكلفة خدمات متعددة
const total = await dataService.calculateCost(
    ['logo', 'website', 'hosting'],  // الخدمات المختارة
    true                             // عاجل؟ (اختياري)
);
// { base: 200, urgent: 100, total: 300 }
```

### التحكم في Cache

```javascript
// مسح التخزين المؤقت (لإعادة التحميل)
dataService.clearCache();

// تحديث يدوي
dataService.clearCache();
const freshData = await dataService.getServices();
```

---

## 🎨 Logger API

### المستويات الخمسة

```javascript
// 1. DEBUG - معلومات تفصيلية للتطوير
logger.debug('قيمة المتغير', { user: 'test' });

// 2. INFO - معلومات عامة
logger.info('تحميل الصفحة');

// 3. SUCCESS - عمليات ناجحة (أخضر)
logger.success('تم الحفظ بنجاح');

// 4. WARN - تحذيرات (برتقالي)
logger.warn('البيانات قديمة، يفضل التحديث');

// 5. ERROR - أخطاء (أحمر)
logger.error('فشل التحميل', error);
```

### قياس الأداء

```javascript
// بداية القياس
logger.time('تحميل البيانات');

// العملية المراد قياسها
await dataService.getServices();

// نهاية القياس وعرض النتيجة
logger.timeEnd('تحميل البيانات');
// ⏱️ تحميل البيانات: 125ms
```

### تجميع السجلات

```javascript
logger.group('معالجة الطلبات');
logger.info('طلب 1: جاري المعالجة');
logger.success('طلب 1: تم بنجاح');
logger.info('طلب 2: جاري المعالجة');
logger.success('طلب 2: تم بنجاح');
logger.groupEnd();
```

### عرض جداول

```javascript
const users = [
    { name: 'أحمد', age: 25 },
    { name: 'فاطمة', age: 30 }
];
logger.table(users);
```

---

## 🎯 أمثلة عملية

### مثال 1: تحميل وعرض الخدمات

```javascript
async function displayServices() {
    try {
        logger.time('تحميل الخدمات');
        const data = await dataService.getServices();
        logger.timeEnd('تحميل الخدمات');

        const container = document.getElementById('services');
        
        data.categories.forEach(category => {
            category.services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <span class="price">${service.price}$</span>
                `;
                container.appendChild(card);
            });
        });

        logger.success(`تم عرض ${data.categories.length} فئات`);
    } catch (error) {
        logger.error('فشل تحميل الخدمات', error);
    }
}
```

### مثال 2: حاسبة التكلفة

```javascript
async function calculateTotal() {
    const selectedServices = ['logo', 'website'];
    const isUrgent = document.getElementById('urgent').checked;

    logger.group('حساب التكلفة');
    logger.info('الخدمات المختارة:', selectedServices);
    logger.info('عاجل:', isUrgent);

    try {
        const cost = await dataService.calculateCost(
            selectedServices, 
            isUrgent
        );

        logger.table([
            { البند: 'التكلفة الأساسية', القيمة: `${cost.base}$` },
            { البند: 'رسوم العجلة', القيمة: `${cost.urgent}$` },
            { البند: 'الإجمالي', القيمة: `${cost.total}$` }
        ]);

        document.getElementById('total').textContent = `${cost.total}$`;
        
        logger.success('تم الحساب بنجاح');
    } catch (error) {
        logger.error('خطأ في الحساب', error);
    }
    
    logger.groupEnd();
}
```

### مثال 3: تحميل معلومات الشركة

```javascript
async function loadCompanyInfo() {
    try {
        const info = await dataService.getCompanyInfo();
        
        document.getElementById('company-name').textContent = info.name;
        document.getElementById('company-email').textContent = info.contact.email;
        document.getElementById('company-phone').textContent = info.contact.phone;

        // روابط التواصل الاجتماعي
        if (info.social.twitter) {
            document.getElementById('twitter-link').href = info.social.twitter;
        }
        
        logger.success('تم تحميل معلومات الشركة');
    } catch (error) {
        logger.error('فشل تحميل معلومات الشركة', error);
    }
}
```

---

## ⚙️ الإعدادات المتقدمة

### تعطيل Logger في الإنتاج

```javascript
// في بيئة الإنتاج، Logger يتوقف تلقائياً إذا كان:
// - location.hostname !== 'localhost'
// - location.hostname !== '127.0.0.1'

// للتحكم اليدوي:
logger.isEnabled = false;  // تعطيل
logger.isEnabled = true;   // تفعيل
```

### تخصيص مدة Cache

```javascript
// في data-service.js (سطر 4)
static CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق (افتراضي)

// للتغيير:
static CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: "dataService is not defined"

**الحل:**
```html
<!-- تأكد من ترتيب التحميل -->
<script src="../shared/js/data-service.js" defer></script>
<script src="app.js" defer></script>
```

### المشكلة: البيانات لا تتحدث

**الحل:**
```javascript
// امسح Cache
dataService.clearCache();
location.reload();
```

### المشكلة: "Failed to fetch"

**الحل:**
- تأكد من وجود ملف `services.json` في `site/data/`
- تأكد من صحة المسار النسبي
- افتح Console وتحقق من الأخطاء

---

## 💡 نصائح الأداء

1. **استخدم Cache بذكاء**
   ```javascript
   // ✅ جيد - استفد من Cache
   const services = await dataService.getServices();
   
   // ❌ سيء - لا تمسح Cache بدون سبب
   dataService.clearCache();
   const services = await dataService.getServices();
   ```

2. **قس ما يهم فقط**
   ```javascript
   // ✅ جيد
   logger.time('عملية مهمة');
   await heavyOperation();
   logger.timeEnd('عملية مهمة');
   
   // ❌ سيء - قياس كل شيء يزعج
   logger.time('شيء صغير');
   const x = 1 + 1;
   logger.timeEnd('شيء صغير');
   ```

3. **استخدم المستوى المناسب**
   ```javascript
   logger.debug();   // فقط أثناء التطوير
   logger.info();    // معلومات عامة
   logger.success(); // عند نجاح عملية مهمة
   logger.warn();    // تحذيرات يجب الانتباه لها
   logger.error();   // أخطاء فقط
   ```

---

## 📖 روابط مفيدة

- [REFACTORING-CHANGELOG.md](./REFACTORING-CHANGELOG.md) - سجل التغييرات الكامل
- [shared/js/data-service.js](./shared/js/data-service.js) - الكود المصدري
- [shared/js/logger.js](./shared/js/logger.js) - الكود المصدري
- [site/data/services.json](./site/data/services.json) - هيكل البيانات

---

**آخر تحديث:** 2026-02-05  
**الإصدار:** v4.0  
**بواسطة:** GitHub Copilot
