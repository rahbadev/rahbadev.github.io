/**
 * ============================================
 * Admin Panel - Product Management
 * ============================================
 */

document.addEventListener('alpine:init', () => {
    Alpine.data('adminPanel', () => ({
        // ============ State ============
        products: [],
        loading: false,
        saving: false,
        deleting: false,

        // Modals
        showModal: false,
        showDeleteModal: false,
        editMode: false,
        productToDelete: null,

        // Form
        formData: {
            name: '',
            brand: '',
            price: '',
            condition: 'New',
            description: '',
            image: '',
            is_available: true,
            is_offer: false,
            is_new: false
        },

        // Image Upload
        imagePreview: null,
        uploadProgress: 0,

        // Filters
        filters: {
            search: '',
            condition: 'all',
            brand: 'all',
            available: 'all'
        },

        // Toast
        toast: {
            show: false,
            message: '',
            type: 'success' // success, error, info
        },

        // ============ Computed Properties ============
        get filteredProducts() {
            return this.products.filter(product => {
                const searchMatch = !this.filters.search ||
                    product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    product.brand.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    product.description?.toLowerCase().includes(this.filters.search.toLowerCase());

                const conditionMatch = this.filters.condition === 'all' ||
                    product.condition === this.filters.condition;

                const brandMatch = this.filters.brand === 'all' ||
                    product.brand === this.filters.brand;

                const availableMatch = this.filters.available === 'all' ||
                    product.is_available === (this.filters.available === 'true');

                return searchMatch && conditionMatch && brandMatch && availableMatch;
            });
        },

        get availableBrands() {
            return [...new Set(this.products.map(p => p.brand))].sort();
        },

        get availableCount() {
            return this.products.filter(p => p.is_available).length;
        },

        get offersCount() {
            return this.products.filter(p => p.is_offer).length;
        },

        get newCount() {
            return this.products.filter(p => p.is_new).length;
        },

        // ============ Lifecycle ============
        async init() {
            console.log('[Admin] Initializing Admin Panel...');
            await this.loadProducts();
        },

        // ============ Data Operations ============
        async loadProducts() {
            this.loading = true;
            try {
                const result = await StoreDatabase.getProducts(1, 1000); // Get all products
                this.products = result.data || [];
                console.log('[Admin] Loaded', this.products.length, 'products');
            } catch (error) {
                console.error('[Admin] Load Error:', error);
                this.showToast('فشل تحميل المنتجات', 'error');
            } finally {
                this.loading = false;
            }
        },

        // ============ Modal Operations ============
        openAddModal() {
            this.editMode = false;
            this.resetForm();
            this.showModal = true;
        },

        openEditModal(product) {
            this.editMode = true;
            this.formData = {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                condition: product.condition,
                description: product.description || '',
                image: product.image,
                is_available: product.is_available,
                is_offer: product.is_offer,
                is_new: product.is_new
            };
            this.imagePreview = product.image;
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            setTimeout(() => {
                this.resetForm();
            }, 300);
        },

        resetForm() {
            this.formData = {
                name: '',
                brand: '',
                price: '',
                condition: 'New',
                description: '',
                image: '',
                is_available: true,
                is_offer: false,
                is_new: false
            };
            this.imagePreview = null;
            this.uploadProgress = 0;
        },

        // ============ Image Upload ============
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showToast('يرجى اختيار صورة فقط', 'error');
                return;
            }

            // Show preview
            this.imagePreview = URL.createObjectURL(file);

            // Upload to Cloudinary
            this.uploadProgress = 10;
            try {
                this.uploadProgress = 30;
                const imageUrl = await StoreDatabase.uploadImage(file);
                this.uploadProgress = 100;
                this.formData.image = imageUrl;
                console.log('[Admin] Image uploaded:', imageUrl);
                this.showToast('تم رفع الصورة بنجاح', 'success');

                // Reset progress after a delay
                setTimeout(() => {
                    this.uploadProgress = 0;
                }, 1000);
            } catch (error) {
                console.error('[Admin] Upload Error:', error);
                this.showToast('فشل رفع الصورة', 'error');
                this.removeImage();
            }
        },

        removeImage() {
            this.imagePreview = null;
            this.formData.image = '';
            this.uploadProgress = 0;
            if (this.$refs.imageInput) {
                this.$refs.imageInput.value = '';
            }
        },

        // ============ CRUD Operations ============
        async saveProduct() {
            if (!this.formData.name || !this.formData.brand || !this.formData.price) {
                this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            if (!this.formData.image) {
                this.showToast('يرجى إضافة صورة للمنتج', 'error');
                return;
            }

            this.saving = true;
            try {
                // Prepare data
                const productData = {
                    name: this.formData.name.trim(),
                    brand: this.formData.brand.trim(),
                    price: parseFloat(this.formData.price),
                    condition: this.formData.condition,
                    description: this.formData.description.trim(),
                    image: this.formData.image,
                    is_available: this.formData.is_available,
                    is_offer: this.formData.is_offer,
                    is_new: this.formData.is_new
                };

                if (this.editMode) {
                    // Update existing product
                    await StoreDatabase.updateProduct(this.formData.id, productData);
                    this.showToast('تم تحديث المنتج بنجاح', 'success');
                } else {
                    // Add new product
                    await StoreDatabase.addProduct(productData);
                    this.showToast('تم إضافة المنتج بنجاح', 'success');
                }

                // Reload products
                await this.loadProducts();
                this.closeModal();
            } catch (error) {
                console.error('[Admin] Save Error:', error);
                this.showToast('فشل حفظ المنتج: ' + error.message, 'error');
            } finally {
                this.saving = false;
            }
        },

        confirmDelete(product) {
            this.productToDelete = product;
            this.showDeleteModal = true;
        },

        async deleteProduct() {
            if (!this.productToDelete) return;

            this.deleting = true;
            try {
                await StoreDatabase.deleteProduct(this.productToDelete.id);
                this.showToast('تم حذف المنتج بنجاح', 'success');

                // Reload products
                await this.loadProducts();
                this.showDeleteModal = false;
                this.productToDelete = null;
            } catch (error) {
                console.error('[Admin] Delete Error:', error);
                this.showToast('فشل حذف المنتج: ' + error.message, 'error');
            } finally {
                this.deleting = false;
            }
        },

        // ============ Utilities ============
        resetFilters() {
            this.filters = {
                search: '',
                condition: 'all',
                brand: 'all',
                available: 'all'
            };
        },

        formatPrice(price) {
            return new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0
            }).format(price);
        },

        showToast(message, type = 'success') {
            this.toast = {
                show: true,
                message,
                type
            };

            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
        }
    }));
});
