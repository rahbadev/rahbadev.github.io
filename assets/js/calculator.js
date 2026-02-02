// =========================================
// Smart Calculator - Simple & Modern
// =========================================

const SmartCalculator = {
    // Current State
    state: {
        activeTab: 'design',
        selectedServices: []
    },

    // Services Data
    services: {
        design: [
            { id: 'logo', name: 'تصميم شعار احترافي', price: 50, icon: 'fa-palette' },
            { id: 'business-card', name: 'تصميم بطاقة أعمال', price: 20, icon: 'fa-id-card' },
            { id: 'brand-identity', name: 'هوية بصرية متكاملة', price: 150, icon: 'fa-copyright' },
            { id: 'social-media', name: 'تصاميم سوشيال ميديا', price: 80, icon: 'fa-share-alt' },
            { id: 'brochure', name: 'تصميم بروشور / فلاير', price: 30, icon: 'fa-file-alt' },
            { id: 'packaging', name: 'تصميم تغليف منتج', price: 100, icon: 'fa-box-open' }
        ],
        web: [
            { id: 'landing-page', name: 'صفحة هبوط احترافية', price: 150, icon: 'fa-pager' },
            { id: 'personal-site', name: 'موقع شخصي / سيرة ذاتية', price: 100, icon: 'fa-user-circle' },
            { id: 'portfolio', name: 'موقع معرض أعمال', price: 200, icon: 'fa-briefcase' },
            { id: 'corporate', name: 'موقع شركة متكامل', price: 500, icon: 'fa-building' },
            { id: 'blog', name: 'موقع مدونة', price: 120, icon: 'fa-blog' },
            { id: 'linktree', name: 'صفحة روابط (Linktree)', price: 50, icon: 'fa-link' }
        ],
        apps: [
            { id: 'simple-app', name: 'تطبيق بسيط (3-5 صفحات)', price: 300, icon: 'fa-mobile-alt' },
            { id: 'medium-app', name: 'تطبيق متوسط (8-12 صفحة)', price: 600, icon: 'fa-mobile-screen' },
            { id: 'advanced-app', name: 'تطبيق متقدم ومعقد', price: 1200, icon: 'fa-rocket' },
            { id: 'store-app', name: 'تطبيق متجر إلكتروني', price: 800, icon: 'fa-shopping-bag' },
            { id: 'app-store', name: 'نشر على App Store', price: 500, icon: 'fa-app-store-ios' },
            { id: 'play-store', name: 'نشر على Google Play', price: 200, icon: 'fa-google-play' }
        ],
        sheets: [
            { id: 'organize-data', name: 'تنظيم وترتيب البيانات', price: 40, icon: 'fa-table' },
            { id: 'dashboard', name: 'لوحة قيادة ورسوم بيانية', price: 80, icon: 'fa-chart-line' },
            { id: 'automation', name: 'أتمتة كاملة مع Apps Script', price: 150, icon: 'fa-robot' },
            { id: 'inventory', name: 'نظام إدارة مخزون', price: 120, icon: 'fa-warehouse' },
            { id: 'crm', name: 'نظام إدارة عملاء (CRM)', price: 100, icon: 'fa-users' },
            { id: 'api-integration', name: 'ربط مع APIs خارجية', price: 80, icon: 'fa-plug' }
        ]
    },

    // Initialize
    init() {
        console.log('SmartCalculator: Initializing...');
        const gridElement = document.getElementById('servicesGrid');
        if (!gridElement) {
            console.error('SmartCalculator: servicesGrid element not found!');
            return;
        }
        console.log('SmartCalculator: servicesGrid found');
        this.renderServices();
        this.attachEvents();
        console.log('SmartCalculator: Initialization complete');
    },

    // Render Services for Active Tab
    renderServices() {
        console.log('renderServices called for tab:', this.state.activeTab);
        const container = document.getElementById('servicesGrid');
        if (!container) {
            console.error('servicesGrid container not found!');
            return;
        }

        const services = this.services[this.state.activeTab];
        console.log('Services to render:', services);

        if (!services || services.length === 0) {
            console.error('No services found for tab:', this.state.activeTab);
            return;
        }

        const html = services.map(service => `
            <div class="service-card" data-service="${service.id}" data-price="${service.price}">
                <div class="service-card-icon">
                    <i class="fas ${service.icon}"></i>
                </div>
                <h5 class="service-card-title">${service.name}</h5>
                <div class="service-card-price">${service.price}$</div>
                <button class="btn-add-service">
                    <i class="fas fa-plus"></i>
                    إضافة
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('Services rendered successfully. Cards count:', services.length);
    },

    // Attach Event Listeners
    attachEvents() {
        // Tab switching
        document.querySelectorAll('.calc-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Service selection (delegated)
        document.getElementById('servicesGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            if (card && e.target.closest('.btn-add-service')) {
                this.toggleService(card);
            }
        });

        // Reset button
        document.getElementById('resetCalc').addEventListener('click', () => {
            this.reset();
        });

        // Request quote button
        document.getElementById('requestQuote').addEventListener('click', () => {
            this.sendToWhatsApp();
        });
    },

    // Switch Tab
    switchTab(tabId) {
        // Update state
        this.state.activeTab = tabId;

        // Update tab buttons
        document.querySelectorAll('.calc-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Render new services
        this.renderServices();

        // Update selected cards
        this.updateSelectedCards();
    },

    // Toggle Service Selection
    toggleService(card) {
        const serviceId = card.dataset.service;
        const price = parseFloat(card.dataset.price);
        const serviceName = card.querySelector('.service-card-title').textContent;
        const category = this.state.activeTab;

        // Check if already selected
        const index = this.state.selectedServices.findIndex(s => s.id === serviceId);

        if (index > -1) {
            // Remove service
            this.state.selectedServices.splice(index, 1);
            card.classList.remove('selected');
            card.querySelector('.btn-add-service').innerHTML = '<i class="fas fa-plus"></i> إضافة';
        } else {
            // Add service
            this.state.selectedServices.push({
                id: serviceId,
                name: serviceName,
                price: price,
                category: category
            });
            card.classList.add('selected');
            card.querySelector('.btn-add-service').innerHTML = '<i class="fas fa-check"></i> مضاف';
        }

        this.updateSummary();
    },

    // Update Selected Cards (when switching tabs)
    updateSelectedCards() {
        document.querySelectorAll('.service-card').forEach(card => {
            const serviceId = card.dataset.service;
            const isSelected = this.state.selectedServices.some(s => s.id === serviceId);

            if (isSelected) {
                card.classList.add('selected');
                card.querySelector('.btn-add-service').innerHTML = '<i class="fas fa-check"></i> مضاف';
            }
        });
    },

    // Update Summary
    updateSummary() {
        const summaryList = document.getElementById('selectedServicesList');
        const totalElement = document.getElementById('totalPrice');

        // Calculate total
        const total = this.state.selectedServices.reduce((sum, service) => sum + service.price, 0);

        // Update services list
        if (this.state.selectedServices.length === 0) {
            summaryList.innerHTML = '<div class="empty-summary"><i class="fas fa-info-circle"></i> لم تختر أي خدمة بعد</div>';
        } else {
            summaryList.innerHTML = this.state.selectedServices.map(service => `
                <div class="summary-service-item">
                    <span>${service.name}</span>
                    <strong>${service.price}$</strong>
                    <button class="btn-remove-service" data-service="${service.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Attach remove buttons
            summaryList.querySelectorAll('.btn-remove-service').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.removeService(btn.dataset.service);
                });
            });
        }

        // Update total
        totalElement.textContent = `${total}$`;
    },

    // Remove Service
    removeService(serviceId) {
        const index = this.state.selectedServices.findIndex(s => s.id === serviceId);
        if (index > -1) {
            this.state.selectedServices.splice(index, 1);

            // Update card if visible
            const card = document.querySelector(`.service-card[data-service="${serviceId}"]`);
            if (card) {
                card.classList.remove('selected');
                card.querySelector('.btn-add-service').innerHTML = '<i class="fas fa-plus"></i> إضافة';
            }

            this.updateSummary();
        }
    },

    // Reset Calculator
    reset() {
        this.state.selectedServices = [];
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.btn-add-service').innerHTML = '<i class="fas fa-plus"></i> إضافة';
        });
        this.updateSummary();
    },

    // Send to WhatsApp
    sendToWhatsApp() {
        if (this.state.selectedServices.length === 0) {
            alert('الرجاء اختيار خدمة واحدة على الأقل');
            return;
        }

        const total = this.state.selectedServices.reduce((sum, s) => sum + s.price, 0);

        // Build message
        let message = 'مرحباً! أرغب في طلب الخدمات التالية:%0a%0a';

        // Group by category
        const categories = {
            design: 'التصميم',
            web: 'المواقع الإلكترونية',
            apps: 'تطبيقات الجوال',
            sheets: 'الجداول الذكية'
        };

        const grouped = {};
        this.state.selectedServices.forEach(service => {
            if (!grouped[service.category]) {
                grouped[service.category] = [];
            }
            grouped[service.category].push(service);
        });

        Object.keys(grouped).forEach(category => {
            message += `*${categories[category]}:*%0a`;
            grouped[category].forEach(service => {
                message += `  • ${service.name} (${service.price}$)%0a`;
            });
            message += '%0a';
        });

        message += `*الإجمالي: ${total}$*%0a`;
        message += `الدفعة المقدمة (50%): ${total / 2}$`;

        // Replace with your WhatsApp number
        const phoneNumber = '963000000000';
        const url = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(url, '_blank');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    SmartCalculator.init();
});
