// =========================================
// Smart Calculator - Simplified & Clean
// =========================================

const Calculator = {
    state: {
        data: null,
        selected: new Map() // serviceId => { urgent: false, addons: Set() }
    },

    async init() {
        await this.loadData();
        this.render();
        this.attachEvents();
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

        container.innerHTML = this.state.data.categories.map(cat => `
            <div class="calc-category">
                <div class="calc-cat-header">
                    <i class="${cat.icon}"></i>
                    <h3>${cat.title}</h3>
                </div>
                <div class="calc-services">
                    ${cat.services.map(svc => this.renderService(svc, cat.id)).join('')}
                </div>
            </div>
        `).join('');

        this.updateSummary();
    },

    renderService(svc, catId) {
        const sel = this.state.selected.get(svc.id);
        const isActive = !!sel;
        
        return `
            <div class="calc-service ${isActive ? 'active' : ''}" data-id="${svc.id}">
                <div class="calc-svc-main">
                    <label class="calc-checkbox">
                        <input type="checkbox" 
                               ${isActive ? 'checked' : ''} 
                               onchange="Calculator.toggle('${svc.id}')">
                        <span class="checkmark"></span>
                    </label>
                    <div class="calc-svc-info">
                        <i class="${svc.icon}"></i>
                        <div>
                            <strong>${svc.name}</strong>
                            <span class="calc-price">${svc.custom ? 'حسب الطلب' : svc.price + '$'}</span>
                        </div>
                    </div>
                </div>
                
                ${isActive && !svc.custom ? `
                    <div class="calc-options">
                        ${svc.urgent ? `
                            <label class="calc-option">
                                <input type="checkbox" 
                                       ${sel.urgent ? 'checked' : ''}
                                       onchange="Calculator.toggleUrgent('${svc.id}')">
                                <span>⚡ تسليم عاجل <small>(+${svc.urgent}$)</small></span>
                            </label>
                        ` : ''}
                        
                        ${(svc.addons || []).map((addon, i) => `
                            <label class="calc-option">
                                <input type="checkbox"
                                       ${sel.addons.has(i) ? 'checked' : ''}
                                       onchange="Calculator.toggleAddon('${svc.id}', ${i})">
                                <span>${addon.name} <small>(+${addon.price}$)</small></span>
                            </label>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },

    toggle(id) {
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
            this.updateSummary();
        }
    },

    toggleAddon(id, addonIndex) {
        const sel = this.state.selected.get(id);
        if (sel) {
            if (sel.addons.has(addonIndex)) {
                sel.addons.delete(addonIndex);
            } else {
                sel.addons.add(addonIndex);
            }
            this.updateSummary();
        }
    },

    updateSummary() {
        const listEl = document.getElementById('selectedServicesList');
        const totalEl = document.getElementById('totalPrice');
        
        if (!listEl || !totalEl) return;

        let total = 0;
        let html = '';

        if (this.state.selected.size === 0) {
            listEl.innerHTML = `
                <div class="empty-summary">
                    <i class="fas fa-info-circle"></i>
                    اختر الخدمات لعرض التكلفة
                </div>
            `;
            totalEl.textContent = '0$';
            return;
        }

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
                const addon = svc.addons[i];
                if (addon) {
                    price += addon.price;
                    extras.push(addon.name);
                }
            });

            total += price;

            html += `
                <div class="summary-item">
                    <div class="summary-item-info">
                        <strong>${svc.name}</strong>
                        ${extras.length ? `<small>${extras.join(' • ')}</small>` : ''}
                    </div>
                    <span class="summary-item-price">${price}$</span>
                    <button class="summary-remove" onclick="Calculator.toggle('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        listEl.innerHTML = html;
        totalEl.textContent = total + '$';
    },

    findService(id) {
        for (const cat of this.state.data.categories) {
            const svc = cat.services.find(s => s.id === id);
            if (svc) return svc;
        }
        return null;
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
