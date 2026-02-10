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
            const start = performance.now();
            this.state.services = await dataService.getServices();
            console.log(`✅ تم تحميل الخدمات الموحدة (${(performance.now() - start).toFixed(2)}ms)`);

            this.render();
            this.attachEvents();
        } catch (error) {
            console.error('❌ خطأ في تحميل الخدمات', error);
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
    },

    renderServiceCard(service, category) {
        const isSelected = this.state.selectedServices.has(service.id);
        const hasExample = service.exampleUrl && service.exampleUrl.trim() !== '';
        const hasDetails = service.details && service.details.length > 0;

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
                                <div class="price-container-unified">
                                    <span class="price-label-unified">تبدأ من</span>
                                    <span class="price-value-unified" style="color: ${category.color};">${service.price}$</span>
                                </div>
                            </div>
                            <h4 class="service-title-unified">${service.title}</h4>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="service-description-unified">${service.description}</p>

                    <!-- Action Buttons -->
                    <div class="service-actions-wrapper">
                        ${hasDetails || hasExample ? `
                            <div class="service-actions-row-top">
                                ${hasDetails ? `
                                    <button onclick="UnifiedServicesCalculator.openServiceDetails('${service.id}', '${category.id}')" class="btn-service-secondary" style="background: ${category.color}15; color: ${category.color}; border-color: ${category.color}30;">
                                        <i class="fas fa-info-circle"></i>
                                        <span>تفاصيل الخدمة</span>
                                    </button>
                                ` : ''}
                                ${hasExample ? `
                                    <button onclick="UnifiedServicesCalculator.openExample('${service.exampleUrl.replace(/'/g, "\\'")}', '${category.color}')" class="btn-service-secondary" style="background: ${category.color}15; color: ${category.color}; border-color: ${category.color}30;">
                                        <i class="fas fa-images"></i>
                                        <span>شاهد مثالاً</span>
                                    </button>
                                ` : ''}
                            </div>
                        ` : ''}
                        <button class="btn-add-to-calculator" onclick="UnifiedServicesCalculator.toggleService('${service.id}', '${category.id}')" style="${isSelected ? `background: ${category.color}; border-color: ${category.color};` : `border-color: ${category.color}60; color: ${category.color};`}">
                            <i class="fas ${isSelected ? 'fa-check-circle' : 'fa-plus-circle'}"></i>
                            <span>${isSelected ? 'تمت الإضافة' : 'أضف للحاسبة'}</span>
                        </button>
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

        // Calculate total and update floating bar
        this.calculateTotal();
        this.updateFloatingBar();
    },

    calculateTotal() {
        let total = 0;

        this.state.selectedServices.forEach((selected) => {
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
        });

        this.state.totalCost = total;
    },

    updateFloatingBar() {
        const floatingBar = document.getElementById('floatingCalcBar');
        const calcBarCount = document.getElementById('calcBarCount');
        const calcBarTotal = document.getElementById('calcBarTotal');

        if (!floatingBar) {
            console.warn('⚠️ floatingCalcBar not found');
            return;
        }

        const count = this.state.selectedServices.size;
        const total = this.state.totalCost;

        console.log(`📊 Updating bar: ${count} services, ${total}$`);

        if (count > 0) {
            floatingBar.classList.add('show');
            document.body.classList.add('calc-bar-visible');

            // Update count
            if (calcBarCount) calcBarCount.textContent = count;

            // Update total
            if (calcBarTotal) calcBarTotal.textContent = `${total}$`;
        } else {
            floatingBar.classList.remove('show');
            document.body.classList.remove('calc-bar-visible');
        }
    },

    openBottomSheet() {
        console.log('🔵 Opening bottom sheet');
        const sheet = document.getElementById('calcBottomSheet');
        const body = document.getElementById('bottomSheetBody');
        const totalValue = document.getElementById('sheetTotalValue');

        if (!sheet || !body) {
            console.error('❌ Bottom sheet elements not found', { sheet: !!sheet, body: !!body });
            return;
        }

        console.log(`📋 Selected services: ${this.state.selectedServices.size}`);

        // Populate body
        let html = '';

        if (this.state.selectedServices.size === 0) {
            html = `
                <div class="sheet-empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>لم تختر أي خدمة بعد</p>
                </div>
            `;
        } else {
            this.state.selectedServices.forEach((selected, serviceId) => {
                const service = selected.service;
                let serviceTotal = service.price;
                let addonsHtml = '';

                // Build addons list
                if (selected.addons.length > 0 || selected.urgent) {
                    addonsHtml = '<div class="sheet-addons-list">';

                    selected.addons.forEach(addonIndex => {
                        const addon = service.addons[addonIndex];
                        serviceTotal += addon.price;
                        addonsHtml += `
                            <div class="sheet-addon-item">
                                <span><i class="fas fa-plus-circle"></i> ${addon.name}</span>
                                <span class="sheet-addon-price">${addon.price}$</span>
                            </div>
                        `;
                    });

                    if (selected.urgent && service.urgent) {
                        serviceTotal += service.urgent;
                        addonsHtml += `
                            <div class="sheet-addon-item">
                                <span><i class="fas fa-bolt"></i> تسليم عاجل</span>
                                <span class="sheet-addon-price">${service.urgent}$</span>
                            </div>
                        `;
                    }

                    addonsHtml += '</div>';
                }

                html += `
                    <div class="sheet-service-item">
                        <div class="sheet-service-header">
                            <div class="sheet-service-info">
                                <div class="sheet-service-title">
                                    <i class="${service.icon}" style="color: ${selected.category.color};"></i>
                                    ${service.title}
                                </div>
                                <div class="sheet-service-details">
                                    ${selected.category.title}
                                </div>
                            </div>
                            <div class="sheet-service-price">${serviceTotal}$</div>
                        </div>
                        ${addonsHtml}
                        <button class="sheet-remove-btn" onclick="UnifiedServicesCalculator.removeService('${serviceId}')">
                            <i class="fas fa-trash-alt"></i>
                            <span>إزالة</span>
                        </button>
                    </div>
                `;
            });
        }

        body.innerHTML = html;
        if (totalValue) totalValue.textContent = `${this.state.totalCost}$`;

        // Show sheet
        console.log('✅ Showing bottom sheet');
        sheet.classList.add('show');
        document.body.classList.add('sheet-open');
        document.body.style.overflow = 'hidden';
    },

    closeBottomSheet() {
        console.log('🔴 Closing bottom sheet');
        const sheet = document.getElementById('calcBottomSheet');
        if (!sheet) return;

        sheet.classList.remove('show');
        document.body.classList.remove('sheet-open');
        document.body.style.overflow = '';
    },

    removeService(serviceId) {
        this.state.selectedServices.delete(serviceId);
        this.updateUI();
        this.openBottomSheet(); // Refresh sheet
    },

    async sendToWhatsApp() {
        // Same as contactUs but for the floating bar
        await this.contactUs();
        this.closeBottomSheet();
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
            console.error('❌ خطأ في إرسال الطلب', error);
            alert('حدث خطأ. الرجاء المحاولة مرة أخرى');
        }
    },

    getCategoryFromUrl(url) {
        if (!url) return 'all';
        const match = url.match(/[?&]cat=([^&]+)/);
        return match ? match[1] : 'all';
    },

    openExample(url, categoryColor) {
        // Check if it's a design gallery link
        if (url.includes('projects/design/index.html')) {
            // Open in designs modal
            const category = this.getCategoryFromUrl(url);
            DesignsModal.open(category);
        } else {
            // Open external link in new window
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    },

    openServiceDetails(serviceId, categoryId) {
        const category = this.state.services.categories.find(c => c.id === categoryId);
        const service = category?.services.find(s => s.id === serviceId);

        if (!service || !service.details) return;

        // Create modal if not exists
        if (!document.getElementById('serviceDetailsModal')) {
            this.createDetailsModal();
        }

        // Fill modal content
        const modal = document.getElementById('serviceDetailsModal');
        const title = modal.querySelector('.details-modal-title');
        const content = modal.querySelector('.details-modal-content');

        title.innerHTML = `<i class="${service.icon} ms-2"></i> ${service.title}`;
        title.style.color = category.color;

        content.innerHTML = `
            <ul class="details-list">
                ${service.details.map(detail => `
                    <li><i class="fas fa-check-circle" style="color: ${category.color};"></i> ${detail}</li>
                `).join('')}
            </ul>
        `;

        // Show modal
        modal.classList.add('show');
    },

    createDetailsModal() {
        const modalHTML = `
            <div class="service-details-modal" id="serviceDetailsModal" onclick="if(event.target===this) this.classList.remove('show')">
                <div class="details-modal-container">
                    <div class="details-modal-header">
                        <h3 class="details-modal-title"></h3>
                        <button class="details-modal-close" onclick="document.getElementById('serviceDetailsModal').classList.remove('show')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="details-modal-content"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    attachEvents() {
        // Events are handled inline via onclick for simplicity

        // ESC key to close bottom sheet
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBottomSheet();
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('unifiedServicesGrid')) {
        UnifiedServicesCalculator.init();
    }
});
