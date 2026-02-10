/**
 * ADMIN DATABASE SERVICE
 * ====================
 * CRITICAL SECURITY: This service uses the SERVICE_ROLE key which bypasses RLS.
 * NEVER expose this in public-facing code. Only use on protected admin pages.
 * 
 * Capabilities:
 * - Create, Update, Delete products (CRUD operations)
 * - Full database access with validation
 * - Image upload coordination with Cloudinary
 * 
 * @requires Supabase Client Library
 * @requires config.js
 */

class AdminDatabaseService {
    constructor() {
        this.supabase = null;
        this.initialized = false;
    }

    /**
     * Initialize Supabase client with SERVICE_ROLE key
     * SECURITY: Only call this on password-protected admin pages
     */
    init() {
        if (this.initialized) return;

        const serviceRoleKey = window.StoreConfig?.database?.serviceRoleKey;
        const supabaseUrl = window.StoreConfig?.database?.supabaseUrl;

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('❌ Admin credentials missing in config.js');
        }

        // Initialize with SERVICE_ROLE key (bypasses RLS)
        this.supabase = supabase.createClient(supabaseUrl, serviceRoleKey);
        this.initialized = true;

        console.log('✅ Admin service initialized');
    }

    /**
     * Validate product data before database operations
     */
    validateProduct(product) {
        const errors = [];

        // Required fields
        if (!product.name || product.name.trim().length < 2) {
            errors.push('اسم المنتج مطلوب (حرفين على الأقل)');
        }

        if (!product.category || product.category.trim().length === 0) {
            errors.push('الفئة مطلوبة');
        }

        if (!product.brand || product.brand.trim().length === 0) {
            errors.push('الماركة مطلوبة');
        }

        // Price validation
        if (!product.price_new && !product.price_used) {
            errors.push('يجب إدخال سعر واحد على الأقل (جديد أو مستعمل)');
        }

        if (product.price_new && (isNaN(product.price_new) || product.price_new < 0)) {
            errors.push('السعر الجديد يجب أن يكون رقم موجب');
        }

        if (product.price_used && (isNaN(product.price_used) || product.price_used < 0)) {
            errors.push('السعر المستعمل يجب أن يكون رقم موجب');
        }

        // Image URL validation
        if (!product.image_url || !this.isValidUrl(product.image_url)) {
            errors.push('رابط الصورة غير صالح');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate URL format
     */
    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * Sanitize string input (prevent XSS)
     */
    sanitizeString(str) {
        if (!str) return '';
        return String(str)
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[<>\"']/g, '')  // Remove dangerous characters
            .trim();
    }

    /**
     * Get all products (admin view - includes unavailable)
     */
    async getAllProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return {
                success: true,
                products: data || []
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            return {
                success: false,
                error: error.message,
                products: []
            };
        }
    }

    /**
     * Get single product by ID
     */
    async getProductById(id) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                success: true,
                product: data
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create new product
     */
    async createProduct(productData) {
        try {
            // Validate data
            const validation = this.validateProduct(productData);
            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            // Sanitize inputs
            const sanitized = {
                name: this.sanitizeString(productData.name),
                description: this.sanitizeString(productData.description),
                category: this.sanitizeString(productData.category),
                brand: this.sanitizeString(productData.brand),
                price_new: productData.price_new ? parseFloat(productData.price_new) : null,
                price_used: productData.price_used ? parseFloat(productData.price_used) : null,
                image_url: productData.image_url.trim(),
                image_urls: productData.image_urls || [],
                features: productData.features || [],
                is_featured: productData.is_featured || false,
                is_available: productData.is_available !== false // Default true
            };

            // Insert into database
            const { data, error } = await this.supabase
                .from('products')
                .insert([sanitized])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Product created:', data.id);

            return {
                success: true,
                product: data
            };
        } catch (error) {
            console.error('Error creating product:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update existing product
     */
    async updateProduct(id, productData) {
        try {
            // Validate data
            const validation = this.validateProduct(productData);
            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            // Sanitize inputs
            const sanitized = {
                name: this.sanitizeString(productData.name),
                description: this.sanitizeString(productData.description),
                category: this.sanitizeString(productData.category),
                brand: this.sanitizeString(productData.brand),
                price_new: productData.price_new ? parseFloat(productData.price_new) : null,
                price_used: productData.price_used ? parseFloat(productData.price_used) : null,
                image_url: productData.image_url.trim(),
                image_urls: productData.image_urls || [],
                features: productData.features || [],
                is_featured: productData.is_featured || false,
                is_available: productData.is_available !== false,
                updated_at: new Date().toISOString()
            };

            // Update in database
            const { data, error } = await this.supabase
                .from('products')
                .update(sanitized)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Product updated:', data.id);

            return {
                success: true,
                product: data
            };
        } catch (error) {
            console.error('Error updating product:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete product
     */
    async deleteProduct(id) {
        try {
            const { error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            console.log('✅ Product deleted:', id);

            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting product:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Toggle product availability
     */
    async toggleAvailability(id, isAvailable) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update({
                    is_available: isAvailable,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Product availability toggled:', id, isAvailable);

            return {
                success: true,
                product: data
            };
        } catch (error) {
            console.error('Error toggling availability:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Toggle featured status
     */
    async toggleFeatured(id, isFeatured) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update({
                    is_featured: isFeatured,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Product featured status toggled:', id, isFeatured);

            return {
                success: true,
                product: data
            };
        } catch (error) {
            console.error('Error toggling featured:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get analytics data
     */
    async getAnalytics() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('category, brand, is_available, is_featured');

            if (error) throw error;

            // Calculate statistics
            const stats = {
                total: data.length,
                available: data.filter(p => p.is_available).length,
                featured: data.filter(p => p.is_featured).length,
                categories: [...new Set(data.map(p => p.category))].length,
                brands: [...new Set(data.map(p => p.brand))].length
            };

            // Category breakdown
            const categoryBreakdown = data.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {});

            // Brand breakdown
            const brandBreakdown = data.reduce((acc, product) => {
                acc[product.brand] = (acc[product.brand] || 0) + 1;
                return acc;
            }, {});

            return {
                success: true,
                stats,
                categoryBreakdown,
                brandBreakdown
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export as singleton
window.AdminDatabaseService = new AdminDatabaseService();
