/**
 * ============================================
 * Database Layer - Refactored with Pagination
 * Supabase + Cloudinary
 * ============================================
 */

const StoreDatabase = {
    client: null,

    init() {
        try {
            const { createClient } = supabase;
            this.client = createClient(
                StoreThemeConfig.supabase.url,
                StoreThemeConfig.supabase.anonKey
            );
            console.log('[DB] Connected');
            return true;
        } catch (error) {
            console.error('[DB] Error:', error);
            return false;
        }
    },

    /**
     * Get Products with Server-side Pagination & Filtering
     */
    async getProducts(page = 1, limit = 12, filters = {}) {
        try {
            let query = this.client
                .from(StoreThemeConfig.supabase.table)
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(
                    `name.ilike.%${filters.search}%,` +
                    `brand.ilike.%${filters.search}%,` +
                    `description.ilike.%${filters.search}%`
                );
            }

            if (filters.category !== 'all') {
                const condition = filters.category === 'new' ? 'New' : 'Used';
                query = query.eq('condition', condition);
            }

            if (filters.brand !== 'all') {
                query = query.eq('brand', filters.brand);
            }

            // Pagination
            const start = (page - 1) * limit;
            query = query
                .order('created_at', { ascending: false })
                .range(start, start + limit - 1);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                data: data || [],
                count: count || 0,
                page,
                limit
            };
        } catch (error) {
            console.error('[DB] Fetch Error:', error);
            return { data: [], count: 0, page: 1, limit };
        }
    },

    /**
     * Upload Image to Cloudinary with Compression
     */
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', StoreThemeConfig.cloudinary.uploadPreset);

            const { quality, format, maxWidth, maxHeight } =
                StoreThemeConfig.cloudinary.imageOptimization;

            formData.append('transformation', JSON.stringify([
                { width: maxWidth, height: maxHeight, crop: 'limit' },
                { quality, fetch_format: format }
            ]));

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${StoreThemeConfig.cloudinary.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            return data.secure_url;
        } catch (error) {
            console.error('[DB] Upload Error:', error);
            throw error;
        }
    },

    async addProduct(product) {
        try {
            if (!product.name || !product.price) {
                throw new Error('Name and Price required');
            }

            const { data, error } = await this.client
                .from(StoreThemeConfig.supabase.table)
                .insert([{ ...product, created_at: new Date().toISOString() }])
                .select()
                .single();

            if (error) throw error;
            console.log('[DB] Product Added');

            // Notify store to refresh
            if (window.Alpine?.store('shop')) {
                window.Alpine.store('shop').refreshProducts();
            }

            return data;
        } catch (error) {
            console.error('[DB] Add Error:', error);
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
            console.log('[DB] Product Updated');

            // Notify store to refresh
            if (window.Alpine?.store('shop')) {
                window.Alpine.store('shop').refreshProducts();
            }

            return data;
        } catch (error) {
            console.error('[DB] Update Error:', error);
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
            console.log('[DB] Product Deleted');

            // Notify store to refresh
            if (window.Alpine?.store('shop')) {
                window.Alpine.store('shop').refreshProducts();
            }

            return true;
        } catch (error) {
            console.error('[DB] Delete Error:', error);
            throw error;
        }
    }
};

// Auto-initialize
if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
    StoreDatabase.init();
}
