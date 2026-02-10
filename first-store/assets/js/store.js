/**
 * ============================================
 * Alpine.js Global Store - Refactored
 * Clean Architecture with Map-based Cart
 * ============================================
 */

document.addEventListener('alpine:init', () => {
    Alpine.store('shop', {
        // ============ State ============
        products: [],
        cart: new Map(), // Object Map instead of Array
        filters: {
            search: '',
            category: 'all',
            brand: 'all',
        },
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
        },
        ui: {
            loading: false,
            cartOpen: false,
            mobileMenuOpen: false,
            mobileSearchOpen: false,
            toast: {
                show: false,
                message: '',
                type: 'success' // success, error, info
            }
        },

        // ============ Computed Properties ============
        get featuredProducts() {
            return this.products.filter(p => p.is_offer && p.is_available).slice(0, 6);
        },

        get newArrivals() {
            return this.products.filter(p => p.is_new && p.is_available).slice(0, 6);
        },

        get filteredProducts() {
            return this.products.filter(product => {
                if (!product.is_available) return false;

                const searchMatch = !this.filters.search ||
                    product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    product.brand.toLowerCase().includes(this.filters.search.toLowerCase());

                const categoryMatch = this.filters.category === 'all' ||
                    (this.filters.category === 'new' && product.condition === 'New') ||
                    (this.filters.category === 'used' && product.condition === 'Used');

                const brandMatch = this.filters.brand === 'all' ||
                    product.brand === this.filters.brand;

                return searchMatch && categoryMatch && brandMatch;
            });
        },

        get cartItems() {
            return Array.from(this.cart.values());
        },

        get cartTotal() {
            return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        get cartCount() {
            return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        },

        get availableBrands() {
            return [...new Set(this.products.map(p => p.brand))].sort();
        },

        get hasMore() {
            return this.products.length < this.pagination.total;
        },

        // ============ Lifecycle ============
        async init() {
            console.log('[Store] Initializing Rehba Store...');
            StoreUtils.initThemeVariables();
            this.loadCart();
            await this.fetchProducts(true);
            console.log('[Store] Ready');
        },

        // ============ Data Fetching ============
        async fetchProducts(reset = false) {
            if (reset) this.pagination.page = 1;

            this.ui.loading = true;
            try {
                const result = await StoreDatabase.getProducts(
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
                console.log(`[Store] Loaded ${result.data.length} products`);
            } catch (error) {
                console.error('[Store] Fetch Error:', error);
            } finally {
                this.ui.loading = false;
            }
        },

        async loadMore() {
            if (this.ui.loading || !this.hasMore) return;
            this.pagination.page++;
            await this.fetchProducts(false);
        },

        async refreshProducts() {
            await this.fetchProducts(true);
        },

        // ============ Cart Management (Map-based) ============
        addToCart(product) {
            const existing = this.cart.get(product.id);

            if (existing) {
                existing.quantity++;
                this.showToast(`تم تحديث الكمية: ${product.name}`, 'success');
            } else {
                this.cart.set(product.id, {
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                this.showToast(`تمت الإضافة: ${product.name}`, 'success');
            }

            this.saveCart();
            console.log(`[Cart] Added ${product.name}`);
        },

        showToast(message, type = 'success') {
            this.ui.toast.message = message;
            this.ui.toast.type = type;
            this.ui.toast.show = true;

            // Auto hide after 3 seconds
            setTimeout(() => {
                this.ui.toast.show = false;
            }, 3000);
        },

        removeFromCart(productId) {
            this.cart.delete(productId);
            this.saveCart();
        },

        updateQuantity(productId, quantity) {
            const item = this.cart.get(productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                this.saveCart();
            }
        },

        clearCart() {
            this.cart.clear();
            this.saveCart();
        },

        loadCart() {
            const saved = StoreUtils.storage.get('cart', []);
            this.cart = new Map(saved.map(item => [item.id, item]));
        },

        saveCart() {
            StoreUtils.storage.set('cart', this.cartItems);
        },

        // ============ Filters ============
        setFilter(type, value) {
            this.filters[type] = value;
            this.fetchProducts(true);
        },

        clearFilters() {
            this.filters = { search: '', category: 'all', brand: 'all' };
            this.fetchProducts(true);
        },

        // ============ WhatsApp ============
        sendWhatsApp(product) {
            window.open(StoreUtils.getWhatsAppLink(
                StoreThemeConfig.store.contact.phone,
                product
            ), '_blank');
        },

        sendCartWhatsApp() {
            if (this.cartCount === 0) return;

            let msg = 'طلب جديد\n\n';
            this.cartItems.forEach((item, i) => {
                msg += `${i + 1}. ${item.brand} ${item.name}\n`;
                msg += `   ${StoreUtils.formatCurrency(item.price)} × ${item.quantity}\n\n`;
            });
            msg += `الإجمالي: ${StoreUtils.formatCurrency(this.cartTotal)}`;

            window.open(
                `https://wa.me/${StoreThemeConfig.store.contact.phone}?text=${encodeURIComponent(msg)}`,
                '_blank'
            );
        }
    });

    // ============ Admin Store ============
    Alpine.store('admin', {
        products: [],
        loading: false,
        showAddForm: false,
        editMode: false,
        saving: false,
        uploading: false,

        formData: {
            id: null,
            name: '',
            brand: '',
            price: 0,
            condition: 'New',
            description: '',
            image: '',
            is_available: true,
            is_offer: false,
            is_new: false
        },

        async init() {
            console.log('[Admin] Initializing...');

            // Initialize Database Connection
            if (!StoreDatabase.client) {
                const dbInit = StoreDatabase.init();
                if (!dbInit) {
                    alert('فشل الاتصال بقاعدة البيانات. تحقق من إعدادات Supabase.');
                    this.loading = false;
                    return;
                }
            }

            StoreUtils.initThemeVariables();
            await this.fetchProducts();
        },

        async fetchProducts() {
            this.loading = true;
            console.log('[Admin] Fetching products...');

            try {
                // Ensure database is initialized
                if (!StoreDatabase.client) {
                    throw new Error('Database not initialized');
                }

                const result = await StoreDatabase.getProducts(1, 999);

                if (!result || !result.data) {
                    throw new Error('Invalid response from database');
                }

                this.products = result.data || [];
                console.log(`[Admin] Fetched ${this.products.length} products`);

                if (this.products.length === 0) {
                    console.warn('[Admin] No products found in database');
                }
            } catch (error) {
                console.error('[Admin] Fetch Error:', error);
                alert(`حدث خطأ في جلب المنتجات: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        resetForm() {
            this.formData = {
                id: null,
                name: '',
                brand: '',
                price: 0,
                condition: 'New',
                description: '',
                image: '',
                is_available: true,
                is_offer: false,
                is_new: false
            };
            this.editMode = false;
        },

        async uploadImage(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.uploading = true;
            try {
                this.formData.image = await StoreDatabase.uploadImage(file);
                console.log('[Admin] Image Uploaded');
            } catch (error) {
                alert('فشل رفع الصورة');
            } finally {
                this.uploading = false;
            }
        },

        editProduct(product) {
            this.formData = { ...product };
            this.editMode = true;
            this.showAddForm = true;
        },

        async submitProduct() {
            this.saving = true;
            try {
                if (this.editMode) {
                    await StoreDatabase.updateProduct(this.formData.id, this.formData);
                    alert('تم تحديث المنتج بنجاح');
                } else {
                    await StoreDatabase.addProduct(this.formData);
                    alert('تم إضافة المنتج بنجاح');
                }

                this.showAddForm = false;
                this.resetForm();
                await this.fetchProducts();
            } catch (error) {
                console.error('[Admin] Save Error:', error);
                alert('حدث خطأ في حفظ المنتج');
            } finally {
                this.saving = false;
            }
        },

        async deleteProduct(id) {
            if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

            try {
                await StoreDatabase.deleteProduct(id);
                alert('تم حذف المنتج بنجاح');
                await this.fetchProducts();
            } catch (error) {
                console.error('[Admin] Delete Error:', error);
                alert('حدث خطأ في حذف المنتج');
            }
        }
    });
});
