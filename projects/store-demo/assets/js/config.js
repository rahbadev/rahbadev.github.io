// assets/js/config.js

const CONFIG = {
    // 1. مفاتيح الربط (Backend Keys)
    supabase: {
        url: "https://prkvgvvshqenwvsibvct.supabase.co", // استبدل هذا برابط مشروعك
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3ZndnZzaHFlbnd2c2lidmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzI0NTcsImV4cCI6MjA4NjIwODQ1N30.DQbj1AxwPt7CpddX--izQpS2MdpPFoMq7Toxig8PPmg" // استبدل هذا بالمفتاح العام (ANON)
    },

    cloudinary: {
        cloudName: "dyokwginp", // اسم السحابة من Cloudinary
        uploadPreset: "first-store" // اسم الـ Preset الذي أنشأته (مثلاً: my_store_preset)
    },

    // 2. الهوية البصرية الثابتة (Branding)
    // العميل لا يملك صلاحية تغيير هذه القيم من لوحة التحكم
    brand: {
        logoUrl: "assets/images/logo.webp", // رابط الشعار (يفضل رفعه على Cloudinary ووضع الرابط هنا)
        primaryColor: "#2563eb", // لون المتجر الأساسي (Tailwind Blue-600)
        currency: "ر.س" // العملة
    },

    // إعدادات التواصل الثابتة (التي لا يغيرها العميل من اللوحة)
    contact: {
        // ضع رابط جوجل مابس هنا (اتركه فارغاً '' لإخفاء الزر تلقائياً)
        mapUrl: "https://maps.app.goo.gl/YOUR_MAP_LINK_HERE",
        email: "contact@store.com" // اختياري
    },

    // 3. إعدادات النظام (System)
    system: {
        itemsPerPage: 12, // عدد المنتجات في كل تحميل
        allowVideo: true, // تفعيل ميزة الفيديو
    }
};

window.CONFIG = CONFIG;