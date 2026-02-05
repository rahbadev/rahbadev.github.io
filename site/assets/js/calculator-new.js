// =========================================
// Smart Calculator - Clean & Modern
// =========================================

const Calculator = {
    state: {
        data: null,
        selected: new Map()
    },

    // Configuration
    config: {
        serviceDescriptions: {
            'logo': 'شعار احترافي يعكس هوية علامتك التجارية',
            'designs': 'تصاميم جرافيك للسوشيال ميديا والمطبوعات',
            'full-identity': 'هوية بصرية متكاملة مع دليل استخدام',
            'bio-page': 'صفحة واحدة تجمع كل روابطك',
            'landing-page': 'صفحة تعريفية احترافية لمشروعك',
            'store': 'متجر إلكتروني متكامل بلوحة تحكم',
            'web-to-app': 'تحويل موقعك إلى تطبيق Android/iOS',
            'simple-app': 'تطبيق بميزات أساسية وتصميم بسيط',
            'pro-app': 'تطبيق احترافي بميزات متقدمة حسب طلبك',
            'sheets-basic': 'تنظيم وإدارة بياناتك في جداول',
            'sheets-auto': 'أتمتة المهام والعمليات المتكررة',
            'domain': 'احجز دومين باسمك (مثل: shop.com)',
            'subdomain': 'رابط فرعي على rahba.dev (مثل: shop.rahba.dev)',
            'short-link': 'روابط مختصرة (مثل: rahba.dev/shop)',
            'ssl': 'شهادة أمان SSL لموقعك (HTTPS)',
            'email': 'بريد إلكتروني باسم نطاقك (info@shop.com)',
            'hosting': 'استضافة سريعة وآمنة لموقعك'
        }
    },

    async init() {
        await this.loadData();
        this.render();
        this.attachEvents();
        this.initTooltips();
    },

    async loadData() {
        try {
            const res = await fetch('data/calculator-services.json');
            this.state.data = await res.json();
        } catch (err) {
            console.error('خطأ في تحميل البيانات:', err);
        }
    },

    render() {
        const container = document.getElementById('servicesGrid');
        if (!container || !this.state.data) return;

        container.innerHTML = this.state.data.categories
            .map(cat => this.renderCategory(cat))
            .join('');

        this.updateSummary();
        this.initTooltips();
    },

    renderCategory(cat) {
        return `
            <div class="calc-category">
                <div class="calc-cat-header">
                    <i class="${cat.icon}"></i>
                    <h3>${cat.title}</h3>
                </div>
                <div class="calc-services-grid">
                    ${cat.services.map(svc => this.renderServiceCard(svc)).join('')}
                </div>
            </div>
        `;
    },

    renderServiceCard(svc) {
        const isSelected = this.state.selected.has(svc.id);
        const description = this.config.serviceDescriptions[svc.id] || '';

        return `
            <div class="service-card ${isSelected ? 'selected' : ''}" 
                 data-id="${svc.id}"
                 onclick="Calculator.toggleService('${svc.id}')">
                <div class="service-card-header">
                    <div class="service-icon">
                        <i class="${svc.icon}"></i>
                    </div>
                    <div class="service-checkbox">
                        <i class="fas ${isSelected ? 'fa-check-circle' : 'fa-circle'}"></i>
                    </div>
                </div>
                <div class="service-card-body">
                    <h4 class="service-name">${svc.name}</h4>
                    <p class="service-desc">${description}</p>
                    <div class="service-price">
                        ${svc.custom ? '<span class="price-custom">حسب الطلب</span>' : `
                            <span class="price-value">${svc.price}$</span>
                            ${svc.recurring ? `<span class="price-recurring">${svc.recurring}</span>` : ''}
                        `}
                    </div>
                </div>
                ${isSelected && !svc.custom ? this.renderAddons(svc) : ''}
            </div>
        `;
    },

    renderAddons(svc) {
        const sel = this.state.selected.get(svc.id);
        const addons = [];

        if (svc.urgent) {
            addons.push({
                type: 'urgent',
                label: 'تسليم عاجل',
                icon: 'fa-bolt',
                price: svc.urgent,
                active: sel.urgent
            });
        }

        (svc.addons || []).forEach((addon, i) => {
            addons.push({
                type: 'addon',
                index: i,
                label: addon.name,
                icon: 'fa-plus-circle',
                price: addon.price,
                active: sel.addons.has(i)
            });
        });

        if (addons.length === 0) return '';

        return `
            <div class="service-addons">
                ${addons.map(addon => this.renderAddonBadge(svc.id, addon)).join('')}
            </div>
        `;
    },

    renderAddonBadge(serviceId, addon) {
        const clickHandler = addon.type === 'urgent'
            ? `Calculator.toggleUrgent('${serviceId}')`
            : `Calculator.toggleAddon('${serviceId}', ${addon.index})`;

        return `
            <button class="addon-badge ${addon.active ? 'active' : ''}"
                    onclick="event.stopPropagation(); ${clickHandler};"
                    data-tippy-content="+${addon.price}$">
                <i class="fas ${addon.icon}"></i>
                <span>${addon.label}</span>
            </button>
        `;
    },

    toggleService(id) {
        if (this.state.selected.has(id)) {
            this.state.selected.delete(id);
        } else {
            this.state.selected.set(id, { urgent: false, addons: new Set() });
        }
        this.render();
    },

    toggleUrgent(id) {
        const sel = this.state.selected.get(id);
        if (sel) {
            sel.urgent = !sel.urgent;
            this.render();
        }
    },

    toggleAddon(id, addonIndex) {
        const sel = this.state.selected.get(id);
        if (sel) {
            sel.addons.has(addonIndex)
                ? sel.addons.delete(addonIndex)
                : sel.addons.add(addonIndex);
            this.render();
        }
    },

    updateSummary() {
        const listEl = document.getElementById('selectedServicesList');
        const totalEl = document.getElementById('totalPrice');

        if (!listEl || !totalEl) return;

        if (this.state.selected.size === 0) {
            listEl.innerHTML = this.getEmptySummaryHTML();
            totalEl.textContent = '0$';
            return;
        }

        const { items, total } = this.calculateTotal();
        listEl.innerHTML = items.map(item => this.renderSummaryItem(item)).join('');
        totalEl.textContent = total + '$';
    },

    getEmptySummaryHTML() {
        return `
            <div class="empty-summary">
                <i class="fas fa-info-circle"></i>
                اختر الخدمات لعرض التكلفة
            </div>
        `;
    },

    calculateTotal() {
        const items = [];
        let total = 0;

        this.state.selected.forEach((sel, id) => {
            const svc = this.findService(id);
            if (!svc || svc.custom) return;

            let price = svc.price;
            const extras = [];

            if (sel.urgent && svc.urgent) {
                price += svc.urgent;
                extras.push('⚡ عاجل');
            }

            sel.addons.forEach(i => {
                const addon = svc.addons?.[i];
                if (addon) {
                    price += addon.price;
                    extras.push(addon.name);
                }
            });

            total += price;
            items.push({ id, name: svc.name, price, extras });
        });

        return { items, total };
    },

    renderSummaryItem(item) {
        return `
            <div class="summary-item">
                <div class="summary-item-info">
                    <strong>${item.name}</strong>
                    ${item.extras.length ? `<small>${item.extras.join(' • ')}</small>` : ''}
                </div>
                <span class="summary-item-price">${item.price}$</span>
                <button class="summary-remove" onclick="Calculator.toggleService('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    },

    findService(id) {
        for (const cat of this.state.data.categories) {
            const svc = cat.services.find(s => s.id === id);
            if (svc) return svc;
        }
        return null;
    },

    initTooltips() {
        if (typeof tippy !== 'undefined') {
            tippy('[data-tippy-content]', {
                theme: 'light',
                placement: 'top',
                animation: 'scale'
            });
        }
    },

    attachEvents() {
        const resetBtn = document.getElementById('resetCalc');
        const quoteBtn = document.getElementById('requestQuote');

        if (resetBtn) {
            resetBtn.onclick = () => {
                this.state.selected.clear();
                this.render();
            };
        }

        if (quoteBtn) {
            quoteBtn.onclick = () => this.sendQuote();
        }
    },

    sendQuote() {
        if (this.state.selected.size === 0) {
            alert('⚠️ اختر خدمة واحدة على الأقل');
            return;
        }

        let message = '🎯 *طلب عرض سعر*\n\n';
        let total = 0;

        this.state.selected.forEach((sel, id) => {
            const svc = this.findService(id);
            if (!svc) return;

            let price = svc.custom ? 0 : svc.price;
            message += `▫️ *${svc.name}*`;

            if (svc.custom) {
                message += ' (سعر حسب الطلب)\n';
                return;
            }

            const extras = [];
            if (sel.urgent && svc.urgent) {
                price += svc.urgent;
                extras.push('⚡ تسليم عاجل');
            }

            sel.addons.forEach(i => {
                const addon = svc.addons[i];
                if (addon) {
                    price += addon.price;
                    extras.push('• ' + addon.name);
                }
            });

            if (extras.length) {
                message += '\n  ' + extras.join('\n  ');
            }

            message += `\n  💵 ${price}$\n\n`;
            total += price;
        });

        if (total > 0) {
            message += `━━━━━━━━━━━━━━\n*الإجمالي:* ${total}$`;
        }

        const phone = '963000000000'; // تحديث رقم الواتساب
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    Calculator.init();
});
