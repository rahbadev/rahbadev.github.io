/**
 * ============================================
 * CORE APPLICATION
 * ============================================
 * 
 * Main application logic and state management using Alpine.js
 * 
 * FEATURES:
 * ✅ Centralized state management
 * ✅ Product loading and filtering
 * ✅ Cart management with localStorage
 * ✅ Search and pagination
 * ✅ Error handling
 * ✅ Lazy loading
 * 
 * ============================================
 */

document.addEventListener('alpine:init', () => {
    // ============================================
    // Main Store (Global State)
    // ============================================
    Alpine.store('shop', {
        // State
        products: [],
        cart: [],
        filters: {
            search: '',
            category: 'all',
            brand: 'all'
        },
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0
        },
        ui: {
            loading: false,
            error: null,
            cartOpen: false,
            currentProduct: null
        },

        // ============================================
        // Computed Properties
        // ============================================
        get featuredProducts() {
            const count = StoreConfig.business?.featuredProductsCount || 6;
            return this.products
                .filter(p => p.isOffer && p.is_available)
                .slice(0, count);
        },

        get newArrivals() {
            const count = StoreConfig.business?.newArrivalsCount || 6;
            return this.products
                .filter(p => p.is_new && p.is_available)
                .slice(0, count);
        },

        get filteredProducts() {
            return this.products.filter(product => {
                // Show out of stock based on config
                if (!product.is_available && !StoreConfig.business?.showOutOfStock) {
                    return false;
                }

                // Search filter
                if (this.filters.search) {
                    const search = this.filters.search.toLowerCase();
                    const matchName = product.name.toLowerCase().includes(search);
                    const matchBrand = product.brand.toLowerCase().includes(search);
                    const matchDesc = product.description?.toLowerCase().includes(search);

                    if (!matchName && !matchBrand && !matchDesc) {
                        return false;
                    }
                }

                // Category filter
                if (this.filters.category !== 'all') {
                    const condition = this.filters.category === 'new' ? 'New' : 'Used';
                    if (product.condition !== condition) {
                        return false;
                    }
                }

                // Brand filter
                if (this.filters.brand !== 'all') {
                    if (product.brand !== this.filters.brand) {
                        return false;
                    }
                }

                return true;
            });
        },

        get availableBrands() {
            const brands = [...new Set(this.products.map(p => p.brand))];
            return brands.sort();
        },

        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        // ============================================
        // Initialization
        // ============================================
        async init() {
            console.log('🚀 Store initialization started...');

            try {
                // Load cart from localStorage
                this.loadCart();

                // Fetch products
                await this.fetchProducts();

                // Apply default sort
                this.applySorting(StoreConfig.business?.defaultSort || 'newest');

                console.log('✅ Store ready');
            } catch (error) {
                console.error('❌ Store initialization failed:', error);
                this.ui.error = 'فشل تحميل المتجر. يرجى تحديث الصفحة.';
            }
        },

        // ============================================
        // Data Operations
        // ============================================
        async fetchProducts(reset = false) {
            if (reset) {
                this.pagination.page = 1;
            }

            this.ui.loading = true;
            this.ui.error = null;

            try {
                const result = await DatabaseService.getProducts(
                    this.pagination.page,
                    this.pagination.limit,
                    this.filters
                );

                if (reset) {
                    this.products = result.data;
                } else {
                    this.products = [...this.products, ...result.data];
                }

                this.pagination.total = result.count;
                this.pagination.totalPages = result.totalPages;

                console.log(`✅ Loaded ${result.data.length} products`);
            } catch (error) {
                console.error('❌ Failed to fetch products:', error);
                this.ui.error = 'فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.';
                throw error;
            } finally {
                this.ui.loading = false;
            }
        },

        async loadMore() {
            if (this.ui.loading || !this.hasMore()) {
                return;
            }

            this.pagination.page++;
            await this.fetchProducts(false);
        },

        hasMore() {
            return this.pagination.page < this.pagination.totalPages;
        },

        async refreshProducts() {
            DatabaseService.clearCache();
            await this.fetchProducts(true);
        },

        // ============================================
        // Filtering & Sorting
        // ============================================
        async applyFilter(type, value) {
            this.filters[type] = value;
            await this.fetchProducts(true);
        },

        async clearFilters() {
            this.filters = {
                search: '',
                category: 'all',
                brand: 'all'
            };
            await this.fetchProducts(true);
        },

        applySorting(sortBy) {
            switch (sortBy) {
                case 'newest':
                    this.products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'oldest':
                    this.products.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                case 'price-low':
                    this.products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    this.products.sort((a, b) => b.price - a.price);
                    break;
                case 'name-az':
                    this.products.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                    break;
                case 'name-za':
                    this.products.sort((a, b) => b.name.localeCompare(a.name, 'ar'));
                    break;
            }
        },

        // ============================================
        // Cart Management
        // ============================================
        addToCart(productId) {
            const product = this.products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return;
            }

            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    condition: product.condition,
                    quantity: 1
                });
            }

            this.saveCart();
            this.showNotification('success', `تمت إضافة ${product.name} للسلة`);
        },

        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.showNotification('info', 'تم إزالة المنتج من السلة');
        },

        updateQuantity(productId, quantity) {
            const item = this.cart.find(i => i.id === productId);
            if (item) {
                if (quantity <= 0) {
                    this.removeFromCart(productId);
                } else {
                    item.quantity = quantity;
                    this.saveCart();
                }
            }
        },

        clearCart() {
            if (confirm('هل أنت متأكد من مسح السلة؟')) {
                this.cart = [];
                this.saveCart();
                this.showNotification('info', 'تم مسح السلة');
            }
        },

        checkoutCart() {
            if (this.cart.length === 0) {
                this.showNotification('warning', 'السلة فارغة');
                return;
            }

            const url = WhatsAppService.orderCart(this.cart);
            WhatsAppService.open(url);

            // Optionally clear cart after checkout
            // this.clearCart();
        },

        saveCart() {
            try {
                localStorage.setItem('cart', JSON.stringify(this.cart));
            } catch (error) {
                console.error('Failed to save cart:', error);
            }
        },

        loadCart() {
            try {
                const saved = localStorage.getItem('cart');
                if (saved) {
                    this.cart = JSON.parse(saved);
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
                this.cart = [];
            }
        },

        // ============================================
        // UI Helpers
        // ============================================
        showNotification(type, message) {
            // Simple notification (can be enhanced with a toast library)
            console.log(`[${type.toUpperCase()}] ${message}`);

            // If you want to show visual notifications, integrate here
            // For now, we'll use browser alerts for important messages
            if (type === 'error') {
                alert(message);
            }
        },

        openCart() {
            this.ui.cartOpen = true;
        },

        closeCart() {
            this.ui.cartOpen = false;
        },

        viewProductDetails(productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                this.ui.currentProduct = product;
                // Trigger modal or page navigation based on config
                // This will be handled in the HTML template
            }
        },

        closeProductDetails() {
            this.ui.currentProduct = null;
        }
    });
});

/**
 * ============================================
 * Product Actions (Global utilities)
 * ============================================
 */
window.ProductActions = {
    addToCart(productId) {
        if (window.Alpine && window.Alpine.store) {
            window.Alpine.store('shop').addToCart(productId);
        }
    },

    viewDetails(productId) {
        if (window.Alpine && window.Alpine.store) {
            window.Alpine.store('shop').viewProductDetails(productId);
        }
    }
};

/**
 * ============================================
 * Initialization
 * ============================================
 */
console.log('📦 Core app module loaded');
