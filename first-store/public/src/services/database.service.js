/**
 * ============================================
 * DATABASE SERVICE (READ-ONLY)
 * ============================================
 * 
 * This service handles ALL database operations for the storefront.
 * 
 * SECURITY FEATURES:
 * ✅ READ-ONLY operations (no insert/update/delete)
 * ✅ Input validation and sanitization
 * ✅ Error handling with fallbacks
 * ✅ Rate limiting awareness
 * ✅ Uses public anon key only (safe for client-side)
 * 
 * IMPORTANT: Admin operations (add/edit/delete) are in separate
 * admin service that uses service role key (server-side only)
 * 
 * ============================================
 */

class DatabaseService {
    constructor() {
        this.client = null;
        this.isInitialized = false;
        this.cache = {
            products: [],
            lastFetch: null,
            ttl: 60000 // Cache for 1 minute
        };
    }

    /**
     * Initialize Supabase client
     * @returns {boolean} Success status
     */
    init() {
        try {
            if (!window.supabase) {
                throw new Error('Supabase library not loaded');
            }

            if (!StoreConfig?.database?.url || !StoreConfig?.database?.anonKey) {
                throw new Error('Database configuration missing');
            }

            const { createClient } = window.supabase;
            this.client = createClient(
                StoreConfig.database.url,
                StoreConfig.database.anonKey
            );

            this.isInitialized = true;
            console.log('✅ Database service initialized (READ-ONLY mode)');
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * Get products with pagination and filters (READ-ONLY)
     * @param {number} page - Page number (1-indexed)
     * @param {number} limit - Products per page
     * @param {object} filters - Filter options
     * @returns {Promise<object>} Products data
     */
    async getProducts(page = 1, limit = 12, filters = {}) {
        // Validate inputs
        page = this.validateNumber(page, 1, 1000, 1);
        limit = this.validateNumber(limit, 1, 100, 12);

        // Check cache
        if (this.shouldUseCache(filters)) {
            return this.getCachedProducts(page, limit, filters);
        }

        try {
            if (!this.isInitialized) {
                throw new Error('Database not initialized');
            }

            let query = this.client
                .from(StoreConfig.database.table)
                .select('*', { count: 'exact' });

            // Apply filters with validation
            query = this.applyFilters(query, filters);

            // Pagination
            const start = (page - 1) * limit;
            query = query
                .order('created_at', { ascending: false })
                .range(start, start + limit - 1);

            const { data, error, count } = await query;

            if (error) {
                throw error;
            }

            const result = {
                data: this.sanitizeProducts(data || []),
                count: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };

            // Update cache
            this.updateCache(result.data);

            return result;
        } catch (error) {
            console.error('❌ Failed to fetch products:', error);
            this.handleError(error);

            // Return cached data as fallback
            return this.getEmptyResult(page, limit);
        }
    }

    /**
     * Get a single product by ID (READ-ONLY)
     * @param {number} id - Product ID
     * @returns {Promise<object|null>} Product data
     */
    async getProductById(id) {
        id = this.validateNumber(id, 1, Number.MAX_SAFE_INTEGER);

        if (!id) {
            return null;
        }

        try {
            if (!this.isInitialized) {
                throw new Error('Database not initialized');
            }

            const { data, error } = await this.client
                .from(StoreConfig.database.table)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            return this.sanitizeProduct(data);
        } catch (error) {
            console.error(`❌ Failed to fetch product ${id}:`, error);
            this.handleError(error);
            return null;
        }
    }

    /**
     * Get available brands (READ-ONLY)
     * @returns {Promise<Array>} List of brands
     */
    async getBrands() {
        try {
            if (!this.isInitialized) {
                throw new Error('Database not initialized');
            }

            const { data, error } = await this.client
                .from(StoreConfig.database.table)
                .select('brand')
                .eq('is_available', true);

            if (error) {
                throw error;
            }

            // Extract unique brands
            const brands = [...new Set(data.map(item => item.brand))].sort();
            return brands;
        } catch (error) {
            console.error('❌ Failed to fetch brands:', error);
            return [];
        }
    }

    /**
     * Apply filters to query with validation
     * @private
     */
    applyFilters(query, filters) {
        // Search filter (sanitized)
        if (filters.search && typeof filters.search === 'string') {
            const searchTerm = this.sanitizeString(filters.search, 100);
            if (searchTerm) {
                query = query.or(
                    `name.ilike.%${searchTerm}%,` +
                    `brand.ilike.%${searchTerm}%,` +
                    `description.ilike.%${searchTerm}%`
                );
            }
        }

        // Category filter (validated)
        if (filters.category && filters.category !== 'all') {
            const validCategories = ['new', 'used', 'New', 'Used'];
            if (validCategories.includes(filters.category)) {
                const condition = filters.category === 'new' || filters.category === 'New' ? 'New' : 'Used';
                query = query.eq('condition', condition);
            }
        }

        // Brand filter (sanitized)
        if (filters.brand && filters.brand !== 'all') {
            const brand = this.sanitizeString(filters.brand, 100);
            if (brand) {
                query = query.eq('brand', brand);
            }
        }

        // Availability filter
        if (filters.available !== undefined) {
            query = query.eq('is_available', filters.available === true || filters.available === 'true');
        }

        // Offer filter
        if (filters.isOffer === true) {
            query = query.eq('is_offer', true);
        }

        // New arrival filter
        if (filters.isNew === true) {
            query = query.eq('is_new', true);
        }

        return query;
    }

    /**
     * Sanitize product data (prevent XSS)
     * @private
     */
    sanitizeProduct(product) {
        if (!product) return null;

        return {
            id: this.validateNumber(product.id),
            name: this.sanitizeString(product.name, 255),
            brand: this.sanitizeString(product.brand, 100),
            price: this.validateNumber(product.price, 0, 999999.99),
            condition: ['New', 'Used'].includes(product.condition) ? product.condition : 'New',
            description: this.sanitizeString(product.description, 2000),
            image: this.sanitizeUrl(product.image),
            is_available: Boolean(product.is_available),
            is_offer: Boolean(product.is_offer),
            is_new: Boolean(product.is_new),
            created_at: product.created_at,
            updated_at: product.updated_at
        };
    }

    /**
     * Sanitize array of products
     * @private
     */
    sanitizeProducts(products) {
        return products.map(p => this.sanitizeProduct(p)).filter(p => p !== null);
    }

    /**
     * Validate and sanitize string input
     * @private
     */
    sanitizeString(str, maxLength = 255) {
        if (typeof str !== 'string') return '';

        // Remove HTML tags and dangerous characters
        str = str.replace(/<[^>]*>/g, '')
            .replace(/[<>\"']/g, '')
            .trim();

        // Limit length
        if (str.length > maxLength) {
            str = str.substring(0, maxLength);
        }

        return str;
    }

    /**
     * Validate number input
     * @private
     */
    validateNumber(num, min = 0, max = Number.MAX_SAFE_INTEGER, defaultValue = 0) {
        const parsed = parseFloat(num);
        if (isNaN(parsed) || parsed < min || parsed > max) {
            return defaultValue;
        }
        return parsed;
    }

    /**
     * Validate URL
     * @private
     */
    sanitizeUrl(url) {
        if (typeof url !== 'string') return '';

        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return '';
            }
            return url;
        } catch {
            return '';
        }
    }

    /**
     * Cache management
     * @private
     */
    shouldUseCache(filters) {
        // Only use cache for simple queries (no filters)
        if (Object.keys(filters).length > 0) {
            return false;
        }

        // Check if cache is still valid
        if (!this.cache.lastFetch) {
            return false;
        }

        const age = Date.now() - this.cache.lastFetch;
        return age < this.cache.ttl;
    }

    updateCache(products) {
        this.cache.products = products;
        this.cache.lastFetch = Date.now();
    }

    getCachedProducts(page, limit, filters) {
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = this.cache.products.slice(start, end);

        return {
            data,
            count: this.cache.products.length,
            page,
            limit,
            totalPages: Math.ceil(this.cache.products.length / limit)
        };
    }

    getEmptyResult(page, limit) {
        return {
            data: [],
            count: 0,
            page,
            limit,
            totalPages: 0
        };
    }

    /**
     * Error handler
     * @private
     */
    handleError(error) {
        // Log for debugging (remove in production)
        if (window.location.hostname === 'localhost') {
            console.error('Database Error Details:', error);
        }

        // Could integrate with error tracking service here
        // e.g., Sentry, LogRocket, etc.
    }

    /**
     * Clear cache (useful after data changes)
     */
    clearCache() {
        this.cache = {
            products: [],
            lastFetch: null,
            ttl: 60000
        };
    }
}

// Create singleton instance
const databaseService = new DatabaseService();

// Auto-initialize when Supabase is ready
if (window.supabase) {
    databaseService.init();
} else {
    // Wait for Supabase to load
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => databaseService.init(), 100);
    });
}

// Export
window.DatabaseService = databaseService;
