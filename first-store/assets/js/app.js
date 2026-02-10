/**
 * ============================================
 * Main Alpine.js Application Logic
 * Apple-Style Store Engine
 * ============================================
 */

function shopEngine() {
    return {
        // ============ State Management ============
        products: [],
        cart: [],
        filters: {
            search: '',
            category: 'all',  // all, new, used
            brand: 'all',     // all, Apple, Samsung, etc.
        },
        loading: false,
        cartOpen: false,
        mobileMenuOpen: false,
        mobileSearchOpen: false,
        navbarHeight: 80,

        // ============ Computed Properties ============
        get featuredProducts() {
            return this.products.filter(p => p.is_offer && p.is_available).slice(0, 8);
        },

        get newArrivals() {
            return this.products.filter(p => p.is_new && p.is_available).slice(0, 8);
        },

        get filteredProducts() {
            return this.products.filter(product => {
                if (!product.is_available) return false;

                // Search filter
                const searchMatch = !this.filters.search ||
                    product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    product.brand.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(this.filters.search.toLowerCase()));

                // Category filter
                const categoryMatch = this.filters.category === 'all' ||
                    (this.filters.category === 'new' && product.condition === 'New') ||
                    (this.filters.category === 'used' && product.condition === 'Used');

                // Brand filter
                const brandMatch = this.filters.brand === 'all' ||
                    product.brand === this.filters.brand;

                return searchMatch && categoryMatch && brandMatch;
            });
        },

        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        get availableBrands() {
            const brands = [...new Set(this.products.map(p => p.brand))];
            return brands.sort();
        },

        // ============ Lifecycle Methods ============
        async init() {
            console.log('🚀 تهيئة متجر رحبة...');

            // Initialize theme variables from config
            StoreUtils.initThemeVariables();

            // Load cart from localStorage
            this.loadCart();

            // Fetch products
            await this.fetchProducts();

            // Setup scroll spy for navbar
            this.setupScrollSpy();

            console.log('✅ تم تحميل المتجر بنجاح');
        },

        async fetchProducts() {
            this.loading = true;
            try {
                this.products = await StoreDatabase.getProducts();
                console.log(`✅ تم جلب ${this.products.length} منتج`);
            } catch (error) {
                console.error('❌ خطأ في جلب المنتجات:', error);
            } finally {
                this.loading = false;
            }
        },

        // ============ Cart Management ============
        addToCart(product) {
            const existingItem = this.cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            this.saveCart();
            this.showCartNotification(product);
        },

        removeFromCart(productId) {
            const index = this.cart.findIndex(item => item.id === productId);
            if (index !== -1) {
                this.cart.splice(index, 1);
                this.saveCart();
            }
        },

        updateCartQuantity(productId, newQuantity) {
            const item = this.cart.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, newQuantity);
                this.saveCart();
            }
        },

        clearCart() {
            this.cart = [];
            this.saveCart();
        },

        loadCart() {
            const saved = StoreUtils.storage.get('cart', []);
            this.cart = saved;
        },

        saveCart() {
            StoreUtils.storage.set('cart', this.cart);
        },

        showCartNotification(product) {
            // Simple notification using Alpine.js
            this.$dispatch('show-notification', {
                message: `تمت إضافة ${product.name} إلى السلة`,
                type: 'success'
            });
        },

        // ============ Filter Methods ============
        setFilter(type, value) {
            this.filters[type] = value;

            // Scroll to catalog section
            if (type === 'category' || type === 'brand') {
                this.$nextTick(() => {
                    StoreUtils.scrollToElement('catalog');
                });
            }
        },

        clearFilters() {
            this.filters = {
                search: '',
                category: 'all',
                brand: 'all'
            };
        },

        // ============ WhatsApp Integration ============
        sendWhatsApp(product) {
            const link = StoreUtils.getWhatsAppLink(
                StoreThemeConfig.store.contact.phone,
                product
            );
            window.open(link, '_blank');
        },

        requestVideo(product) {
            const link = StoreUtils.getVideoRequestLink(
                StoreThemeConfig.store.contact.phone,
                product
            );
            window.open(link, '_blank');
        },

        sendCartWhatsApp() {
            if (this.cart.length === 0) return;

            let message = '🛒 *طلب جديد من المتجر*\n\n';

            this.cart.forEach((item, index) => {
                message += `${index + 1}. ${item.brand} ${item.name}\n`;
                message += `   السعر: ${StoreUtils.formatCurrency(item.price)}\n`;
                message += `   الكمية: ${item.quantity}\n\n`;
            });

            message += `💰 *المجموع الكلي:* ${StoreUtils.formatCurrency(this.cartTotal)}`;

            const link = `https://wa.me/${StoreThemeConfig.store.contact.phone}?text=${encodeURIComponent(message)}`;
            window.open(link, '_blank');
        },

        // ============ UI Helpers ============
        scrollToSection(sectionId) {
            StoreUtils.scrollToElement(sectionId);
        },

        scrollHorizontal(containerId, direction) {
            StoreUtils.scrollContainer(containerId, direction, 300);
        },

        setupScrollSpy() {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY > 50;
                this.navbarHeight = scrolled ? 64 : 80;
            });
        },

        formatPrice(price) {
            return StoreUtils.formatCurrency(price, '$');
        }
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 متجر رحبة - Rehba Store');
    console.log('✨ Apple-Style Glassmorphism Design');
});
