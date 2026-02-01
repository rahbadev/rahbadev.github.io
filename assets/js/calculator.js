// =========================================
// Smart Calculator for Project Pricing
// =========================================

const CalculatorApp = {
    // Calculator State
    state: {
        currentTab: 'apps',
        selections: {
            apps: { type: null, addons: [] },
            web: { type: null, addons: [] },
            store: { type: null, addons: [] },
            branding: { type: null, addons: [] },
            automation: { type: null, addons: [] }
        }
    },

    // Pricing Data
    pricingData: {
        apps: {
            title: 'تطبيقات الجوال',
            icon: 'fas fa-mobile-alt',
            color: '#6366f1',
            options: [
                { id: 'simple', name: 'تطبيق بسيط', price: 300, desc: 'تطبيق بوظائف أساسية (3-5 صفحات)' },
                { id: 'medium', name: 'تطبيق متوسط', price: 600, desc: 'تطبيق متكامل مع قاعدة بيانات (8-12 صفحة)' },
                { id: 'advanced', name: 'تطبيق متقدم', price: 1200, desc: 'تطبيق معقد مع مميزات متقدمة' }
            ],
            addons: [
                { id: 'backend', name: 'خادم خلفي (Backend)', price: 200 },
                { id: 'admin', name: 'لوحة تحكم إدارية', price: 150 },
                { id: 'notifications', name: 'نظام إشعارات Push', price: 100 },
                { id: 'maps', name: 'خرائط وموقع جغرافي', price: 80 }
            ]
        },
        web: {
            title: 'المواقع الإلكترونية',
            icon: 'fas fa-globe',
            color: '#10b981',
            options: [
                { id: 'landing', name: 'صفحة هبوط (Landing)', price: 150, desc: 'صفحة واحدة احترافية' },
                { id: 'personal', name: 'موقع شخصي', price: 250, desc: 'موقع متعدد الصفحات (5-8 صفحات)' },
                { id: 'corporate', name: 'موقع شركة', price: 500, desc: 'موقع متكامل مع لوحة تحكم' }
            ],
            addons: [
                { id: 'domain', name: 'حجز نطاق واستضافة (سنة)', price: 50 },
                { id: 'seo', name: 'تحسين محركات البحث SEO', price: 100 },
                { id: 'content', name: 'كتابة المحتوى', price: 80 },
                { id: 'multilang', name: 'دعم متعدد اللغات', price: 120 }
            ]
        },
        store: {
            title: 'المتاجر الإلكترونية',
            icon: 'fas fa-shopping-cart',
            color: '#f59e0b',
            options: [
                { id: 'basic', name: 'متجر أساسي', price: 400, desc: 'متجر جاهز بـ 20 منتج' },
                { id: 'standard', name: 'متجر قياسي', price: 700, desc: 'متجر متكامل بـ 100 منتج' },
                { id: 'premium', name: 'متجر احترافي', price: 1200, desc: 'متجر مخصص بالكامل' }
            ],
            addons: [
                { id: 'payment', name: 'ربط بوابات الدفع', price: 150 },
                { id: 'shipping', name: 'نظام الشحن والتوصيل', price: 100 },
                { id: 'multi_vendor', name: 'نظام البائعين المتعددين', price: 300 },
                { id: 'inventory', name: 'إدارة المخزون المتقدمة', price: 150 }
            ]
        },
        branding: {
            title: 'الهوية البصرية',
            icon: 'fas fa-palette',
            color: '#ec4899',
            options: [
                { id: 'logo_only', name: 'شعار فقط', price: 50, desc: 'تصميم شعار احترافي (3 خيارات)' },
                { id: 'basic_identity', name: 'هوية أساسية', price: 120, desc: 'شعار + بطاقات أعمال' },
                { id: 'full_identity', name: 'هوية متكاملة', price: 250, desc: 'شعار + دليل هوية + مطبوعات' }
            ],
            addons: [
                { id: 'social_media', name: 'تصاميم سوشيال ميديا', price: 80 },
                { id: 'print', name: 'تصاميم المطبوعات', price: 60 },
                { id: 'packaging', name: 'تصميم التغليف', price: 100 },
                { id: 'source_files', name: 'ملفات مفتوحة المصدر', price: 30 }
            ]
        },
        automation: {
            title: 'أتمتة الأعمال',
            icon: 'fas fa-robot',
            color: '#8b5cf6',
            options: [
                { id: 'organize', name: 'تنظيم وتنسيق', price: 80, desc: 'ترتيب البيانات والصيغ' },
                { id: 'dashboard', name: 'لوحة قيادة', price: 150, desc: 'رسوم بيانية وتقارير' },
                { id: 'full_automation', name: 'أتمتة كاملة', price: 300, desc: 'Apps Script + ربط APIs' }
            ],
            addons: [
                { id: 'email_automation', name: 'أتمتة البريد الإلكتروني', price: 80 },
                { id: 'alerts', name: 'نظام التنبيهات التلقائية', price: 60 },
                { id: 'integration', name: 'ربط مع خدمات خارجية', price: 120 }
            ]
        }
    },

    // Initialize Calculator
    init() {
        this.renderCalculator();
        this.attachEventListeners();
    },

    // Render Calculator HTML
    renderCalculator() {
        const container = document.getElementById('calculatorApp');
        if (!container) return;

        container.innerHTML = `
            <div class="calculator-tabs">
                ${this.renderTabs()}
            </div>
            
            <div class="calculator-body">
                ${Object.keys(this.pricingData).map(tabId => `
                    <div class="calculator-content ${tabId === this.state.currentTab ? 'active' : ''}" id="calc-${tabId}">
                        ${this.renderTabContent(tabId)}
                    </div>
                `).join('')}
            </div>
            
            <div class="calculator-summary">
                ${this.renderSummary()}
            </div>
        `;
    },

    // Render Tabs
    renderTabs() {
        return Object.keys(this.pricingData).map(tabId => {
            const data = this.pricingData[tabId];
            return `
                <button class="calculator-tab ${tabId === this.state.currentTab ? 'active' : ''}" 
                        data-tab="${tabId}">
                    <i class="${data.icon} me-2"></i>
                    ${data.title}
                </button>
            `;
        }).join('');
    },

    // Render Tab Content
    renderTabContent(tabId) {
        const data = this.pricingData[tabId];

        return `
            <div class="mb-4">
                <h4 class="mb-4">
                    <i class="${data.icon} me-2" style="color: ${data.color}"></i>
                    اختر نوع ${data.title}
                </h4>
                ${data.options.map(option => `
                    <div class="option-card ${this.state.selections[tabId].type === option.id ? 'selected' : ''}" 
                         data-category="${tabId}" 
                         data-option="${option.id}">
                        <div class="option-info">
                            <h5>${option.name}</h5>
                            <p>${option.desc}</p>
                        </div>
                        <div class="option-price">${option.price}$</div>
                    </div>
                `).join('')}
            </div>
            
            ${data.addons.length > 0 ? `
                <div class="addons-section">
                    <h5 class="mb-3">
                        <i class="fas fa-plus-circle me-2"></i>
                        إضافات اختيارية
                    </h5>
                    ${data.addons.map(addon => `
                        <label class="addon-checkbox">
                            <input type="checkbox" 
                                   data-category="${tabId}" 
                                   data-addon="${addon.id}"
                                   ${this.state.selections[tabId].addons.includes(addon.id) ? 'checked' : ''}>
                            <div class="flex-grow-1">
                                <strong>${addon.name}</strong>
                            </div>
                            <span class="text-primary">+${addon.price}$</span>
                        </label>
                    `).join('')}
                </div>
            ` : ''}
        `;
    },

    // Render Summary
    renderSummary() {
        const items = this.getSelectedItems();
        const total = this.calculateTotal();

        return `
            <div class="summary-title">
                <i class="fas fa-receipt me-2"></i>
                ملخص الطلب
            </div>
            
            ${items.length === 0 ? `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-info-circle fa-2x mb-3 d-block"></i>
                    اختر الخدمات التي تحتاجها لعرض التكلفة
                </div>
            ` : `
                <div class="summary-items">
                    ${items.map(item => `
                        <div class="summary-item">
                            <span>${item.name}</span>
                            <strong>${item.price}$</strong>
                        </div>
                    `).join('')}
                </div>
                
                <div class="summary-total">
                    <div class="total-label">الإجمالي</div>
                    <div class="total-value">${total}$</div>
                </div>
                
                <div class="text-center text-muted mt-3 small">
                    الدفعة المقدمة (50%): <strong>${total / 2}$</strong>
                </div>
                
                <button class="btn-checkout" onclick="CalculatorApp.checkout()">
                    <i class="fab fa-whatsapp me-2"></i>
                    إرسال الطلب عبر واتساب
                </button>
            `}
        `;
    },

    // Attach Event Listeners
    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.calculator-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.calculator-tab').dataset.tab);
            });
        });

        // Option selection
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;
                const option = card.dataset.option;
                this.selectOption(category, option);
            });
        });

        // Addon selection
        document.querySelectorAll('.addon-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = checkbox.dataset.category;
                const addon = checkbox.dataset.addon;
                this.toggleAddon(category, addon, checkbox.checked);
            });
        });
    },

    // Switch Tab
    switchTab(tabId) {
        this.state.currentTab = tabId;

        // Update tab buttons
        document.querySelectorAll('.calculator-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.calculator-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `calc-${tabId}`) {
                content.classList.add('active');
            }
        });
    },

    // Select Option
    selectOption(category, optionId) {
        this.state.selections[category].type = optionId;
        this.updateUI();
    },

    // Toggle Addon
    toggleAddon(category, addonId, checked) {
        const addons = this.state.selections[category].addons;

        if (checked) {
            if (!addons.includes(addonId)) {
                addons.push(addonId);
            }
        } else {
            const index = addons.indexOf(addonId);
            if (index > -1) {
                addons.splice(index, 1);
            }
        }

        this.updateUI();
    },

    // Update UI
    updateUI() {
        // Update option cards
        document.querySelectorAll('.option-card').forEach(card => {
            const category = card.dataset.category;
            const option = card.dataset.option;

            if (this.state.selections[category].type === option) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Update summary
        const summaryContainer = document.querySelector('.calculator-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = this.renderSummary();
        }
    },

    // Get Selected Items
    getSelectedItems() {
        const items = [];

        Object.keys(this.state.selections).forEach(category => {
            const selection = this.state.selections[category];
            const data = this.pricingData[category];

            // Add main option
            if (selection.type) {
                const option = data.options.find(o => o.id === selection.type);
                if (option) {
                    items.push({
                        category: data.title,
                        name: option.name,
                        price: option.price
                    });
                }
            }

            // Add addons
            selection.addons.forEach(addonId => {
                const addon = data.addons.find(a => a.id === addonId);
                if (addon) {
                    items.push({
                        category: data.title,
                        name: `+ ${addon.name}`,
                        price: addon.price
                    });
                }
            });
        });

        return items;
    },

    // Calculate Total
    calculateTotal() {
        const items = this.getSelectedItems();
        return items.reduce((sum, item) => sum + item.price, 0);
    },

    // Checkout (Send to WhatsApp)
    checkout() {
        const items = this.getSelectedItems();
        const total = this.calculateTotal();

        if (items.length === 0) {
            alert('الرجاء اختيار خدمة واحدة على الأقل');
            return;
        }

        // Build WhatsApp message
        let message = 'مرحباً! أرغب في طلب الخدمات التالية:%0a%0a';

        // Group items by category
        const grouped = {};
        items.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });

        // Format message
        Object.keys(grouped).forEach(category => {
            message += `*${category}:*%0a`;
            grouped[category].forEach(item => {
                message += `  • ${item.name} (${item.price}$)%0a`;
            });
            message += '%0a';
        });

        message += `*الإجمالي: ${total}$*%0a`;
        message += `الدفعة المقدمة المقترحة (50%): ${total / 2}$`;

        // Open WhatsApp
        const phoneNumber = '963000000000'; // استبدل برقم واتساب حقيقي
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappUrl, '_blank');
    }
};

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        CalculatorApp.init();
    }, 500);
});
