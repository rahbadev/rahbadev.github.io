document.addEventListener('alpine:init', () => {
    Alpine.data('admin', () => ({
        session: null,
        loading: false,
        activeTab: 'products',

        // Data
        products: [],
        categories: [],
        settings: { social_links: [] }, // مصفوفة الآن وليست كائن

        // Filters
        searchQuery: '',
        filterCategory: '',

        // Form Logic
        productModalOpen: false,
        isEditing: false,
        uploadingImage: false,
        currentProduct: {
            id: null, name: '', price: '', description: '',
            category_id: '', image_url: '', video_url: '',
            is_new: true, is_featured: false
        },

        async init() {
            const { data } = await supabaseClient.auth.getSession();
            this.session = data.session;
            supabaseClient.auth.onAuthStateChange((_event, session) => {
                this.session = session;
                if (session) this.loadData();
            });
            if (this.session) this.loadData();
        },

        // --- Computed Properties (للبحث والفلترة) ---
        get filteredProducts() {
            return this.products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = this.filterCategory ? p.category_id == this.filterCategory : true;
                return matchesSearch && matchesCategory;
            });
        },

        async loadData() {
            this.loading = true;
            try {
                const { data: prods } = await supabaseClient.from('products').select('*, categories(name)').order('created_at', { ascending: false });
                this.products = prods || [];

                const { data: cats } = await supabaseClient.from('categories').select('*');
                this.categories = cats || [];

                const { data: sets } = await supabaseClient.from('settings').select('*').single();
                // التأكد من أن الروابط عبارة عن مصفوفة، إذا كانت فارغة أو كائن قديم نحولها لمصفوفة
                if (sets) {
                    this.settings = sets;
                    if (!Array.isArray(this.settings.social_links)) {
                        this.settings.social_links = [];
                    }
                }
            } catch (e) { console.error(e); }
            finally { this.loading = false; }
        },

        // --- إدارة المنتجات ---
        openProductModal(product = null) {
            if (product) {
                this.isEditing = true;
                this.currentProduct = { ...product };
            } else {
                this.isEditing = false;
                this.currentProduct = {
                    name: '', price: '', description: '',
                    category_id: this.categories[0]?.id || '',
                    image_url: '', video_url: '',
                    is_new: true, is_featured: false
                };
            }
            this.productModalOpen = true;
        },

        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.uploadingImage = true;
            const url = await CloudinaryService.uploadImage(file);
            if (url) this.currentProduct.image_url = url;
            this.uploadingImage = false;
        },

        async saveProduct() {
            this.loading = true;
            // (نفس منطق الحفظ السابق تماماً...)
            const payload = { ...this.currentProduct };
            delete payload.categories; // حذف الحقل المرجعي لتجنب الأخطاء

            let error;
            if (this.isEditing) {
                const { error: err } = await supabaseClient.from('products').update(payload).eq('id', payload.id);
                error = err;
            } else {
                delete payload.id;
                const { error: err } = await supabaseClient.from('products').insert([payload]);
                error = err;
            }

            if (error) alert("خطأ: " + error.message);
            else { this.productModalOpen = false; this.loadData(); }
            this.loading = false;
        },

        async deleteProduct(id) {
            if (!confirm("هل أنت متأكد؟")) return;
            await supabaseClient.from('products').delete().eq('id', id);
            this.loadData();
        },

        // --- إدارة الروابط (Social Media Repeater) ---
        addSocialLink() {
            this.settings.social_links.push({ platform: '', url: '' });
        },

        removeSocialLink(index) {
            this.settings.social_links.splice(index, 1);
        },

        async saveSettings() {
            this.loading = true;
            await supabaseClient.from('settings').update({
                whatsapp_number: this.settings.whatsapp_number,
                social_links: this.settings.social_links
            }).eq('id', this.settings.id);
            alert("تم الحفظ!");
            this.loading = false;
        },

        // دوال مساعدة للتصنيفات والدخول (نفس السابق)
        async addCategory(name) {
            if (name) { await supabaseClient.from('categories').insert([{ name }]); this.loadData(); }
        },
        async deleteCategory(id) {
            const { error } = await supabaseClient.from('categories').delete().eq('id', id);
            if (error) alert("لا يمكن حذف تصنيف يحتوي على منتجات"); else this.loadData();
        },
        async login() { /* نفس كود الدخول السابق */ },
        async logout() { await supabaseClient.auth.signOut(); }
    }));
});