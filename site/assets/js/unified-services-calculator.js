/**
 * Unified Services & Calculator
 * تصميم موحد - عرض الخدمات مع الحاسبة المدمجة
 * @version 1.0
 * @date 2026-02-05
 */

const UnifiedServicesCalculator = {
    state: {
        selectedServices: new Map(), // serviceId => {service, addons: []}
        services: null,
        totalCost: 0
    },

    async init() {
        try {
            logger.time('تحميل الخدمات الموحدة');
            this.state.services = await dataService.getServices();
            logger.timeEnd('تحميل الخدمات الموحدة');

            this.render();
            this.attachEvents();
            logger.success('تم تحميل الخدمات الموحدة');
        } catch (error) {
            logger.error('خطأ في تحميل الخدمات', error);
        }
    },

    render() {
        const container = document.getElementById('unifiedServicesGrid');
        if (!container || !this.state.services) return;

        let html = '';

        this.state.services.categories.forEach(category => {
            category.services.forEach(service => {
                html += this.renderServiceCard(service, category);
            });
        });

        container.innerHTML = html;
        this.updateSummary();
    },

    renderServiceCard(service, category) {
        const isSelected = this.state.selectedServices.has(service.id);
        const hasExample = service.exampleUrl && service.exampleUrl.trim() !== '';

        // Build addons list including urgent if exists
        const allAddons = [];
        if (service.addons && service.addons.length > 0) {
            allAddons.push(...service.addons.map((addon, index) => ({
                ...addon,
                index,
                isUrgent: false
            })));
        }
        if (service.urgent) {
            allAddons.push({
                name: 'تسليم عاجل',
                price: service.urgent,
                index: -1,
                isUrgent: true
            });
        }

        return `
            <div class="col-xl-4 col-lg-6 col-md-6 mb-3">
                <div class="unified-service-card ${isSelected ? 'selected' : ''}" data-service-id="${service.id}" data-category-color="${category.color}" style="border-color: ${category.color}40;">
                    <!-- Header -->
                    <div class="service-card-header-unified">
                        <div class="service-icon-unified" style="background: ${category.color}20; color: ${category.color};">
                            <i class="${service.icon}"></i>
                        </div>
                        <div class="service-title-wrapper">
                            <div class="title-category-row">
                                <span class="service-category-badge" style="background: ${category.color}; color: white;">
                                    ${category.title}
                                </span>
                                <span class="price-value-unified" style="color: ${category.color};">${service.price}$</span>
                            </div>
                            <h4 class="service-title-unified">${service.title}</h4>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="service-description-unified">${service.description}</p>

                    <!-- Action Buttons Row -->
                    <div class="service-actions-row">
                        <button class="btn-add-to-calculator" onclick="UnifiedServicesCalculator.toggleService('${service.id}', '${category.id}')" style="${isSelected ? `background: ${category.color}; border-color: ${category.color};` : `border-color: ${category.color}60; color: ${category.color};`}">
                            <i class="fas ${isSelected ? 'fa-check-circle' : 'fa-plus-circle'}"></i>
                            <span>${isSelected ? 'تمت الإضافة' : 'أضف للحاسبة'}</span>
                        </button>
                        ${hasExample ? `
                            <a href="${service.exampleUrl}" target="_blank" class="btn-view-example" style="background: ${category.color}15; color: ${category.color}; border-color: ${category.color}30;">
                                <i class="fas fa-external-link-alt ms-1"></i>
                                <span>شاهد مثالاً</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Addons including Urgent (shown when selected) -->
                    ${allAddons.length > 0 ? `
                        <div class="service-addons-section">
                            <div class="addons-title">
                                <i class="fas fa-plus-circle"></i>
                                <span>إضافات اختيارية</span>
                            </div>
                            ${allAddons.map(addon => `
                                <div class="addon-item ${addon.isUrgent ? 'addon-urgent' : ''}" 
                                     data-addon-index="${addon.index}" 
                                     ${addon.isUrgent ? `data-addon-type="urgent" onclick="UnifiedServicesCalculator.toggleUrgent('${service.id}')"` : `onclick="UnifiedServicesCalculator.toggleAddon('${service.id}', ${addon.index})"`}>
                                    <div class="addon-label">
                                        <div class="addon-checkbox">
                                            <i class="fas fa-check"></i>
                                        </div>
                                        <span>${addon.isUrgent ? `<i class="fas fa-bolt" style="color: #f59e0b; margin-left: 0.25rem;"></i> ${addon.name}` : addon.name}</span>
                                    </div>
                                    <span class="addon-price">${addon.price}$</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    toggleService(serviceId, categoryId) {
        const category = this.state.services.categories.find(c => c.id === categoryId);
        const service = category.services.find(s => s.id === serviceId);

        if (this.state.selectedServices.has(serviceId)) {
            this.state.selectedServices.delete(serviceId);
        } else {
            this.state.selectedServices.set(serviceId, {
                service,
                category,
                addons: [],
                urgent: false
            });
        }

        this.updateUI();
    },

    toggleAddon(serviceId, addonIndex) {
        const selected = this.state.selectedServices.get(serviceId);
        if (!selected) return;

        const addonIndexInArray = selected.addons.indexOf(addonIndex);
        if (addonIndexInArray > -1) {
            selected.addons.splice(addonIndexInArray, 1);
        } else {
            selected.addons.push(addonIndex);
        }

        this.updateUI();
    },

    toggleUrgent(serviceId) {
        const selected = this.state.selectedServices.get(serviceId);
        if (!selected) return;

        selected.urgent = !selected.urgent;
        this.updateUI();
    },

    updateUI() {
        // Update card states
        document.querySelectorAll('.unified-service-card').forEach(card => {
            const serviceId = card.dataset.serviceId;
            const isSelected = this.state.selectedServices.has(serviceId);

            card.classList.toggle('selected', isSelected);

            // Update button
            const btn = card.querySelector('.btn-add-to-calculator');
            if (btn) {
                const icon = btn.querySelector('i');
                const text = btn.querySelector('span');
                if (icon) icon.className = `fas ${isSelected ? 'fa-check-circle' : 'fa-plus-circle'}`;
                if (text) text.textContent = isSelected ? 'تمت الإضافة' : 'أضف للحاسبة';
            }

            if (isSelected) {
                const selected = this.state.selectedServices.get(serviceId);

                // Update addons
                card.querySelectorAll('.addon-item[data-addon-index]').forEach(addonEl => {
                    const addonIndex = parseInt(addonEl.dataset.addonIndex);
                    const isActive = selected.addons.includes(addonIndex);
                    addonEl.classList.toggle('active', isActive);
                });

                // Update urgent
                const urgentEl = card.querySelector('.addon-item[data-addon-type="urgent"]');
                if (urgentEl) {
                    urgentEl.classList.toggle('active', selected.urgent);
                }
            }
        });

        this.updateSummary();
    },

    updateSummary() {
        const summaryContainer = document.getElementById('calculatorSummary');
        if (!summaryContainer) return;

        let total = 0;
        let itemsHtml = '';

        this.state.selectedServices.forEach((selected, serviceId) => {
            const service = selected.service;
            let serviceTotal = service.price;

            // Add addons
            selected.addons.forEach(addonIndex => {
                serviceTotal += service.addons[addonIndex].price;
            });

            // Add urgent
            if (selected.urgent && service.urgent) {
                serviceTotal += service.urgent;
            }

            total += serviceTotal;

            itemsHtml += `
                <div class="selected-service-item">
                    <span class="selected-service-name">
                        <i class="${service.icon}" style="color: ${selected.category.color};"></i>
                        ${service.title}
                    </span>
                    <span class="selected-service-price">${serviceTotal}$</span>
                </div>
            `;
        });

        this.state.totalCost = total;

        if (this.state.selectedServices.size === 0) {
            summaryContainer.innerHTML = `
                <div class="summary-title">
                    <i class="fas fa-calculator"></i>
                    <span>الحاسبة</span>
                </div>
                <p style="text-align: center; color: #94a3b8; padding: 2rem 0;">
                    اختر الخدمات التي تحتاجها لترى التكلفة
                </p>
            `;
        } else {
            summaryContainer.innerHTML = `
                <div class="summary-title">
                    <i class="fas fa-calculator"></i>
                    <span>الملخص (${this.state.selectedServices.size} خدمة)</span>
                </div>
                <div class="selected-services-list">
                    ${itemsHtml}
                </div>
                <div class="summary-total">
                    <div class="total-label">الإجمالي التقديري</div>
                    <div class="total-value">
                        <span class="total-currency">$</span>${total}
                    </div>
                </div>
                <button class="btn btn-primary w-100 mt-3" onclick="UnifiedServicesCalculator.contactUs()">
                    <i class="fas fa-paper-plane ms-2"></i>
                    ابدأ مشروعك الآن
                </button>
            `;
        }
    },

    async contactUs() {
        if (this.state.selectedServices.size === 0) {
            alert('الرجاء اختيار خدمة واحدة على الأقل');
            return;
        }

        try {
            const companyData = await dataService.getCompanyInfo();
            const whatsappNumber = companyData.contact.whatsapp;

            // Build WhatsApp message
            let message = '🎯 *طلب مشروع جديد*\n\n';
            message += '📋 *الخدمات المطلوبة:*\n';

            this.state.selectedServices.forEach((selected) => {
                message += `\n• ${selected.service.title}\n`;

                if (selected.addons.length > 0) {
                    message += '  الإضافات:\n';
                    selected.addons.forEach(addonIndex => {
                        message += `  - ${selected.service.addons[addonIndex].name}\n`;
                    });
                }

                if (selected.urgent) {
                    message += '  ⚡ تسليم عاجل\n';
                }
            });

            message += `\n💰 *التكلفة التقديرية:* $${this.state.totalCost}\n`;
            message += '\nأرغب في مناقشة تفاصيل المشروع 🚀';

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            logger.error('خطأ في إرسال الطلب', error);
            alert('حدث خطأ. الرجاء المحاولة مرة أخرى');
        }
    },

    attachEvents() {
        // Events are handled inline via onclick for simplicity
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('unifiedServicesGrid')) {
        UnifiedServicesCalculator.init();
    }
});
