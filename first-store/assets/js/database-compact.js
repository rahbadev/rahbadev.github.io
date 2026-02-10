/**
 * Database & Image Upload - Compact Version
 * Supabase + Cloudinary
 */

const StoreDatabase = {
    client: null,

    init() {
        try {
            const { createClient } = supabase;
            this.client = createClient(StoreThemeConfig.supabase.url, StoreThemeConfig.supabase.anonKey);
            console.log('✅ DB Connected');
            return true;
        } catch (error) {
            console.error('❌ DB Error:', error);
            return false;
        }
    },

    /**
     * Upload & Compress Image to Cloudinary
     */
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', StoreThemeConfig.cloudinary.uploadPreset);
            formData.append('cloud_name', StoreThemeConfig.cloudinary.cloudName);

            // Compression settings
            const { quality, format, maxWidth, maxHeight } = StoreThemeConfig.cloudinary.imageOptimization;
            formData.append('transformation', JSON.stringify([
                { width: maxWidth, height: maxHeight, crop: 'limit' },
                { quality: quality, fetch_format: format }
            ]));

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${StoreThemeConfig.cloudinary.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            return data.secure_url;
        } catch (error) {
            console.error('❌ Upload Error:', error);
            throw error;
        }
    },

    async getProducts() {
        try {
            const { data, error } = await this.client
                .from(StoreThemeConfig.supabase.table)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ Fetch Error:', error);
            return [];
        }
    },

    async addProduct(product) {
        try {
            if (!product.name || !product.price) throw new Error('Name & Price required');

            const { data, error } = await this.client
                .from(StoreThemeConfig.supabase.table)
                .insert([{ ...product, created_at: new Date().toISOString() }])
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Product Added');
            return data;
        } catch (error) {
            console.error('❌ Add Error:', error);
            throw error;
        }
    },

    async updateProduct(id, updates) {
        try {
            const { data, error } = await this.client
                .from(StoreThemeConfig.supabase.table)
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Product Updated');
            return data;
        } catch (error) {
            console.error('❌ Update Error:', error);
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const { error } = await this.client
                .from(StoreThemeConfig.supabase.table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Product Deleted');
            return true;
        } catch (error) {
            console.error('❌ Delete Error:', error);
            throw error;
        }
    }
};

// Auto-init when Supabase is loaded
if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
    StoreDatabase.init();
}
