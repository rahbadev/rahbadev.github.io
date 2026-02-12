// assets/js/database.js

// تهيئة عميل Supabase (يفترض وجود المكتبة في HTML)
// سنضيف رابط المكتبة لاحقاً في ملف index.html
const supabaseClient = supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

const DB = {
    // جلب إعدادات المتجر (واتساب، روابط)
    async getSettings() {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('*')
            .single(); // لأننا نعلم أنه صف واحد فقط

        if (error) {
            console.error("خطأ في جلب الإعدادات:", error);
            return null;
        }
        return data;
    },

    // جلب التصنيفات (التي تحتوي على منتجات فقط - منطق ذكي)
    // ملاحظة: لجلب الأقسام الفارغة أيضاً، احذف الفلترة اليدوية لاحقاً
    async getCategories() {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('id, name');

        if (error) {
            console.error("خطأ في جلب التصنيفات:", error);
            return [];
        }
        return data;
    },

    // جلب المنتجات (مع دعم الفلترة)
    async getProducts(categoryId = null) {
        let query = supabaseClient
            .from('products')
            .select('*')
            .order('is_featured', { ascending: false }) // المميز أولاً
            .order('created_at', { ascending: false }); // ثم الجديد

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("خطأ في جلب المنتجات:", error);
            return [];
        }
        return data;
    },

    // دالة خاصة بلوحة التحكم (تحديث الإعدادات)
    async updateSettings(newSettings) {
        // حماية إضافية: نسمح بتحديث حقول محددة فقط
        const allowedUpdates = {
            whatsapp_number: newSettings.whatsapp_number,
            social_links: newSettings.social_links
        };

        const { data, error } = await supabaseClient
            .from('settings')
            .update(allowedUpdates)
            .eq('id', 1) // الصف الأول دائماً
            .select();

        return { data, error };
    }
};