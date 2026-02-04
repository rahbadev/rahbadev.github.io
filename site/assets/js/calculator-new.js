// =========================================
// Smart Calculator - Clean & Simple
// =========================================

const Calculator = {
    // State
    state: {
        services: [],
        selectedServices: []
    },

    // Initialize
    async init() {
        await this.loadServices();
        this.renderServices();
        this.attachEvents();
    },

    // Load services from JSON
    async loadServices() {
        try {
            const response = await fetch('data/calculator-services.json');
            const data = await response.json();
            this.state.services = data.services;
        } catch (error) {
            console.error('Error loading services:', error);
        }
    },

    // Render all services
    renderServices() {
        const container = document.getElementById('servicesGrid');
        if (!container) return;

        const categories = {
            design: { name: 'التصميم', services: [] },
            web: { name: 'المواقع', services: [] },
            apps: { name: 'التطبيقات', services: [] }
        };

        // Group services by category
        this.state.services.forEach(service => {
            if (categories[service.category]) {
                categories[service.category].services.push(service);
            }
        });

        // Render categories
        let html = '';
        for (const [catId, category] of Object.entries(categories)) {
            if (category.services.length === 0) continue;

            html += `
                <div class="service-category">
                    <h3 class="category-title">
                        <i class="fas ${this.getCategoryIcon(catId)}"></i>
                        ${category.name}
                    </h3>
                    <div class="services-list">
                        ${category.services.map(s => this.renderServiceCard(s)).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    // Render single service card
    renderServiceCard(service) {
        const isSelected = this.isServiceSelected(service.id);
        const selection = this.getServiceSelection(service.id);

        return `
            <div class="service-item ${isSelected ? 'selected' : ''}" data-service-id="${service.id}">
                <div class="service-header">
                    <div class="service-icon">
                        <i class="fas ${service.icon}"></i>
                    </div>
                    <div class="service-info">
                        <h4>${service.name}</h4>
                        <p>${service.description}</p>
                    </div>
                    <div class="service-price">
                        ${service.isCustomPrice ?
                '<span class="custom-price">سعر مخصص</span>' :
                `<span class="price-amount">${service.basePrice}$</span>`
            }
                        ${!service.isCustomPrice ? '<span class="price-label">تبدأ من</span>' : ''}
                    </div>
                </div>

                ${!service.isCustomPrice ? `
                    <button class="btn-select-service" onclick="Calculator.toggleService('${service.id}')">
                        <i class="fas ${isSelected ? 'fa-check' : 'fa-plus'}"></i>
                        ${isSelected ? 'مُضاف' : 'اختيار'}
                    </button>

                    ${isSelected ? this.renderServiceOptions(service, selection) : ''}
                ` : `
                    <button class="btn-contact" onclick="window.location.href='#contact'">
                        <i class="fas fa-comments"></i>
                        تواصل معنا للتسعير
                    </button>
                `}
            </div>
        `;
    },

    // Render service options (addons & delivery)
    renderServiceOptions(service, selection) {
        let html = '<div class="service-options">';

        // Multi-select options (for designs)
        if (service.isMultiSelect && service.options) {
            html += '<div class="options-group"><h5>اختر التصميمات:</h5>';
            service.options.forEach(option => {
                const checked = selection.options?.includes(option.id) ? 'checked' : '';
                html += `
                    <label class="option-checkbox">
                        <input type="checkbox" 
                               value="${option.id}" 
                               ${checked}
                               onchange="Calculator.updateServiceOption('${service.id}', '${option.id}', this.checked)">
                        <span>${option.name} (+${option.price}$)</span>
                    </label>
                `;
            });
            html += '</div>';
        }

        // Addons
        if (service.addons && service.addons.length > 0) {
            html += '<div class="options-group"><h5>إضافات اختيارية:</h5>';
            service.addons.forEach(addon => {
                const checked = selection.addons?.includes(addon.id) ? 'checked' : '';
                html += `
                    <label class="option-checkbox">
                        <input type="checkbox" 
                               value="${addon.id}" 
                               ${checked}
                               onchange="Calculator.updateServiceAddon('${service.id}', '${addon.id}', this.checked)">
                        <span>${addon.name} (+${addon.price}$)</span>
                    </label>
                `;
            });
            html += '</div>';
        }

        // Delivery options
        if (service.delivery && service.delivery.urgentFee > 0) {
            const checked = selection.urgent ? 'checked' : '';
            html += `
                <div class="options-group">
                    <h5>وقت التسليم:</h5>
                    <label class="option-checkbox delivery-option">
                        <input type="checkbox" 
                               ${checked}
                               onchange="Calculator.updateServiceDelivery('${service.id}', this.checked)">
                        <span>
                            <strong>تسليم مستعجل</strong> 
                            (${service.delivery.urgent} بدلاً من ${service.delivery.normal})
                            <strong class="text-danger">+${service.delivery.urgentFee}$</strong>
                        </span>
                    </label>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    // Toggle service selection
    toggleService(serviceId) {
        const service = this.state.services.find(s => s.id === serviceId);
        if (!service) return;

        const index = this.state.selectedServices.findIndex(s => s.serviceId === serviceId);

        if (index > -1) {
            // Remove service
            this.state.selectedServices.splice(index, 1);
        } else {
            // Add service
            this.state.selectedServices.push({
                serviceId: serviceId,
                options: [],
                addons: [],
                urgent: false
            });
        }

        this.renderServices();
        this.updateSummary();
    },

    // Update service option (for multi-select)
    updateServiceOption(serviceId, optionId, checked) {
        const selection = this.getServiceSelection(serviceId);
        if (!selection) return;

        if (checked) {
            if (!selection.options.includes(optionId)) {
                selection.options.push(optionId);
            }
        } else {
            selection.options = selection.options.filter(id => id !== optionId);
        }

        this.updateSummary();
    },

    // Update service addon
    updateServiceAddon(serviceId, addonId, checked) {
        const selection = this.getServiceSelection(serviceId);
        if (!selection) return;

        if (checked) {
            if (!selection.addons.includes(addonId)) {
                selection.addons.push(addonId);
            }
        } else {
            selection.addons = selection.addons.filter(id => id !== addonId);
        }

        this.updateSummary();
    },

    // Update delivery option
    updateServiceDelivery(serviceId, urgent) {
        const selection = this.getServiceSelection(serviceId);
        if (!selection) return;

        selection.urgent = urgent;
        this.updateSummary();
    },

    // Calculate total price
    calculateTotal() {
        let total = 0;

        this.state.selectedServices.forEach(selection => {
            const service = this.state.services.find(s => s.id === selection.serviceId);
            if (!service || service.isCustomPrice) return;

            // Base price
            total += service.basePrice;

            // Multi-select options
            if (service.isMultiSelect && service.options) {
                selection.options.forEach(optionId => {
                    const option = service.options.find(o => o.id === optionId);
                    if (option) total += option.price;
                });
            }

            // Addons
            if (service.addons) {
                selection.addons.forEach(addonId => {
                    const addon = service.addons.find(a => a.id === addonId);
                    if (addon) total += addon.price;
                });
            }

            // Urgent delivery
            if (selection.urgent && service.delivery) {
                total += service.delivery.urgentFee;
            }
        });

        return total;
    },

    // Update summary sidebar
    updateSummary() {
        const listEl = document.getElementById('selectedServicesList');
        const totalEl = document.getElementById('totalPrice');

        if (!listEl || !totalEl) return;

        if (this.state.selectedServices.length === 0) {
            listEl.innerHTML = `
                <div class="empty-summary">
                    <i class="fas fa-info-circle"></i>
                    اختر الخدمات لعرض التكلفة
                </div>
            `;
            totalEl.textContent = '0$';
            return;
        }

        // Build summary list
        let html = '';
        this.state.selectedServices.forEach(selection => {
            const service = this.state.services.find(s => s.id === selection.serviceId);
            if (!service) return;

            html += `
                <div class="summary-item">
                    <strong>${service.name}</strong>
                    <span>${service.basePrice}$</span>
                    <button class="btn-remove" onclick="Calculator.toggleService('${service.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Show selected options
            if (service.isMultiSelect && selection.options.length > 0) {
                selection.options.forEach(optionId => {
                    const option = service.options.find(o => o.id === optionId);
                    if (option) {
                        html += `<div class="summary-sub-item">+ ${option.name} (${option.price}$)</div>`;
                    }
                });
            }

            // Show selected addons
            selection.addons.forEach(addonId => {
                const addon = service.addons.find(a => a.id === addonId);
                if (addon) {
                    html += `<div class="summary-sub-item">+ ${addon.name} (${addon.price}$)</div>`;
                }
            });

            // Show urgent delivery
            if (selection.urgent && service.delivery) {
                html += `<div class="summary-sub-item text-danger">+ تسليم مستعجل (${service.delivery.urgentFee}$)</div>`;
            }
        });

        listEl.innerHTML = html;
        totalEl.textContent = this.calculateTotal() + '$';
    },

    // Reset calculator
    reset() {
        this.state.selectedServices = [];
        this.renderServices();
        this.updateSummary();
    },

    // Send to WhatsApp
    sendToWhatsApp() {
        if (this.state.selectedServices.length === 0) {
            alert('الرجاء اختيار خدمة واحدة على الأقل');
            return;
        }

        let message = 'مرحباً! أرغب في طلب الخدمات التالية:%0a%0a';

        this.state.selectedServices.forEach(selection => {
            const service = this.state.services.find(s => s.id === selection.serviceId);
            if (!service) return;

            message += `📌 *${service.name}* (${service.basePrice}$)%0a`;

            if (service.isMultiSelect && selection.options.length > 0) {
                selection.options.forEach(optionId => {
                    const option = service.options.find(o => o.id === optionId);
                    if (option) message += `   ✓ ${option.name} (+${option.price}$)%0a`;
                });
            }

            selection.addons.forEach(addonId => {
                const addon = service.addons.find(a => a.id === addonId);
                if (addon) message += `   ✓ ${addon.name} (+${addon.price}$)%0a`;
            });

            if (selection.urgent && service.delivery) {
                message += `   ⚡ تسليم مستعجل (+${service.delivery.urgentFee}$)%0a`;
            }

            message += '%0a';
        });

        const total = this.calculateTotal();
        message += `*الإجمالي: ${total}$*%0a`;
        message += `الدفعة المقدمة (50%): ${total / 2}$`;

        const phone = '963000000000';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    },

    // Helper functions
    isServiceSelected(serviceId) {
        return this.state.selectedServices.some(s => s.serviceId === serviceId);
    },

    getServiceSelection(serviceId) {
        return this.state.selectedServices.find(s => s.serviceId === serviceId);
    },

    getCategoryIcon(category) {
        const icons = {
            design: 'fa-palette',
            web: 'fa-globe',
            apps: 'fa-mobile-alt'
        };
        return icons[category] || 'fa-star';
    },

    // Attach events
    attachEvents() {
        const resetBtn = document.getElementById('resetCalc');
        if (resetBtn) {
            resetBtn.onclick = () => this.reset();
        }

        const quoteBtn = document.getElementById('requestQuote');
        if (quoteBtn) {
            quoteBtn.onclick = () => this.sendToWhatsApp();
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Calculator.init();
});
