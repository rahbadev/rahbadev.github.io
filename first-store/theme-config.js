/**
 * ============================================
 * ملف إعدادات المتجر الرئيسي
 * Theme Configuration File
 * ============================================
 * 
 * هذا الملف يحتوي على جميع الإعدادات القابلة للتخصيص
 * لتسهيل نسخ المتجر لعملاء مختلفين
 * 
 * للتخصيص: قم بتعديل القيم أدناه فقط
 */

const StoreThemeConfig = {
    // ============ معلومات المتجر الأساسية ============
    store: {
        name: 'متجر الهواتف الذكية',           // اسم المتجر
        tagline: 'أفضل الأجهزة بأفضل الأسعار',  // الشعار/الوصف القصير
        description: 'أفضل الأجهزة الجديدة والمستعملة بضمان وأسعار تنافسية', // الوصف الكامل
        logo: 'ri-smartphone-line',              // أيقونة من Remix Icons (أو يمكن وضع رابط صورة)

        // معلومات التواصل
        contact: {
            phone: '966500000000',               // رقم WhatsApp (بصيغة دولية بدون +)
            displayPhone: '+966 50 000 0000',    // رقم العرض
            email: 'info@store.com',             // البريد الإلكتروني
            address: 'الرياض، المملكة العربية السعودية', // العنوان
            workingHours: 'السبت - الخميس: 9 صباحاً - 9 مساءً', // أوقات العمل

            // وسائل التواصل الاجتماعي (اتركها فارغة إذا لم تكن متوفرة)
            social: {
                facebook: 'www.facebook.com/rahbadev',         // رابط الفيسبوك
                instagram: 'www.instagram.com',        // رابط الانستقرام
                twitter: '',          // رابط تويتر/X
                youtube: '',          // رابط يوتيوب
                tiktok: '',           // رابط تيك توك
                telegramChannel: '',  // رابط قناة تيليجرام
                telegramContact: '',  // رابط حساب تيليجرام للتواصل
            },

            // خريطة Google Maps
            mapUrl: 'https://maps.app.goo.gl/Fo5ZwGFASqZHqPyo8',  // رابط Google Maps (مثال: https://maps.app.goo.gl/xxxxx)
        }
    },

    // ============ الألوان والتصميم ============
    theme: {
        colors: {
            primary: '#3b82f6',
            primaryDark: '#2563eb',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            newBadge: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            usedBadge: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            offerBadge: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            whatsappGreen: '#25D366',
        },

        fonts: {
            primary: 'Tajawal',
            secondary: 'Cairo',
            googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700;800;900&display=swap'
        }
    },

    // ============ إعدادات Supabase ============
    supabase: {
        url: 'https://prkvgvvshqenwvsibvct.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3ZndnZzaHFlbnd2c2lidmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzI0NTcsImV4cCI6MjA4NjIwODQ1N30.DQbj1AxwPt7CpddX--izQpS2MdpPFoMq7Toxig8PPmg',
        table: 'products'                // اسم الجدول
    },

    // ============ إعدادات Cloudinary ============
    cloudinary: {
        cloudName: 'dyokwginp',
        uploadPreset: 'first-store',
        imageOptimization: {
            quality: 75,
            format: 'webp',
            maxWidth: 1200,
            maxHeight: 1200,
            thumbnailWidth: 400,
        }
    },

    // ============ إعدادات المنتجات ============
    products: {
        categories: [
            { id: 'all', name: 'الكل', icon: 'ri-grid-fill' },
            { id: 'new', name: 'جديد', icon: 'ri-sparkling-fill' },
            { id: 'used', name: 'مستعمل', icon: 'ri-refresh-line' }
        ]
    }
};

// جعل الكائن متاح عالمياً
if (typeof window !== 'undefined') {
    window.StoreThemeConfig = StoreThemeConfig;
}
