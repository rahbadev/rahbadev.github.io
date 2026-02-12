// لا تهيئة خارج Alpine.data('store')
// assets/js/app.js

document.addEventListener('alpine:init', () => {
    Alpine.data('store', () => ({
        // State (الحالة)
        loading: true,
        settings: {},
        categories: [],
        products: [],
        filteredProducts: [],
        activeCategory: null,
        cart: [],
        cartOpen: false, // للتحكم في ظهور السلة الجانبية
        modalOpen: false, // للتحكم في ظهور تفاصيل المنتج
        selectedProduct: null, // المنتج المعروض في الـ Modal
        searchQuery: '',
        productsLimit: 24, // عدد المنتجات المعروضة مبدئياً

        // Toast notifications
        toastMessage: '',
        toastIcon: '',
        toastColor: '',
        toastVisible: false,

        // Init (التشغيل عند البداية)
        async init() {
            console.log("Store Initializing...");

            // 1. تحميل السلة من الذاكرة
            this.cart = CartService.getCart();

            // 2. جلب البيانات من السيرفر
            try {
                // جلب الإعدادات أولاً لتحديث الألوان وأرقام الواتساب
                const settingsData = await DB.getSettings();
                if (settingsData) {
                    this.settings = settingsData;
                    // تحديث الـ Config بالبيانات الحقيقية من قاعدة البيانات
                    CONFIG.system.whatsappNumber = settingsData.whatsapp_number;
                    CONFIG.brand.storeName = settingsData.store_name;

                    // تحديث عنوان الصفحة
                    document.title = settingsData.store_name;
                }

                // جلب الأقسام والمنتجات بالتوازي لسرعة التحميل
                const [cats, prods] = await Promise.all([
                    DB.getCategories(),
                    DB.getProducts()
                ]);

                this.categories = cats;
                this.products = prods;
                this.filteredProducts = prods; // في البداية نعرض الكل

            } catch (error) {
                console.error("Initialization Failed:", error);
            } finally {
                this.loading = false;
            }

            // تفعيل التصفح اللانهائي
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY || window.pageYOffset;
                const windowHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;
                if (scrollY + windowHeight > docHeight - 300) {
                    if (this.productsLimit < this.filteredProducts.length) {
                        this.productsLimit += 16;
                    }
                }
            });
        },

        // Actions (الأوامر)

        filterByCategory(categoryId) {
            this.activeCategory = categoryId;
            if (categoryId === null) {
                this.filteredProducts = this.products;
            } else {
                this.filteredProducts = this.products.filter(p => p.category_id === categoryId);
            }
            this.productsLimit = 24; // إعادة ضبط الحد عند تغيير التصنيف
        },

        searchProducts() {
            if (this.searchQuery.trim() === '') {
                this.filterByCategory(this.activeCategory);
                return;
            }
            const query = this.searchQuery.toLowerCase();
            let baseProducts = this.products;

            // إذا كان هناك تصنيف مفعّل، فلتر المنتجات بناءً عليه أولاً
            if (this.activeCategory !== null) {
                baseProducts = this.products.filter(p => p.category_id === this.activeCategory);
            }

            // ثم طبّق البحث على النتائج
            this.filteredProducts = baseProducts.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
            this.productsLimit = 24; // إعادة ضبط الحد عند البحث
        },

        openProductModal(product) {
            this.selectedProduct = product;
            this.modalOpen = true;
        },

        closeProductModal() {
            this.modalOpen = false;
            setTimeout(() => { this.selectedProduct = null; }, 300); // تنظيف بعد الأنيميشن
        },

        // Toast notification helper
        showToast(message, icon = 'check-circle', color = 'green') {
            this.toastMessage = message;
            this.toastIcon = icon;
            this.toastColor = color;
            this.toastVisible = true;
            setTimeout(() => { this.toastVisible = false; }, 3000);
        },

        // Cart Actions (ربط مع cart.js)
        addToCart(product) {
            this.cart = CartService.addToCart(product);
            this.showToast('تمت الإضافة للسلة بنجاح ✓', 'shopping-cart', 'green');
        },

        removeFromCart(id) {
            this.cart = CartService.removeFromCart(id);
            this.showToast('تم الحذف من السلة', 'trash', 'red');
        },

        updateQty(id, change) {
            const prevCart = [...this.cart];
            this.cart = CartService.updateQuantity(id, change);

            // إذا تم الحذف (الكمية وصلت صفر)
            const itemStillExists = this.cart.find(item => item.id === id);
            if (!itemStillExists) {
                this.showToast('تم حذف المنتج من السلة', 'trash', 'red');
            } else {
                const item = this.cart.find(item => item.id === id);
                if (change > 0) {
                    this.showToast(`تم تحديث الكمية: ${item.quantity}`, 'plus-circle', 'blue');
                } else {
                    this.showToast(`تم تحديث الكمية: ${item.quantity}`, 'minus-circle', 'blue');
                }
            }
        },

        get cartTotal() {
            return CartService.calculateTotal(this.cart);
        },

        checkoutWhatsApp() {
            if (this.cart.length === 0) {
                this.showToast('السلة فارغة!', 'warning', 'yellow');
                return;
            }
            const link = Utils.generateWhatsAppLink(this.cart, this.cartTotal);
            window.open(link, '_blank');
            this.showToast('جاري فتح الواتساب...', 'whatsapp-logo', 'green');
        },

        // Helpers (ربط مع Utils.js لاستخدامها داخل HTML)
        formatPrice(price) { return Utils.formatCurrency(price); },
        share(product) { Utils.shareProduct(product); }
    }));
});