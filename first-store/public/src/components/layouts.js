/**
 * ============================================
 * LAYOUT SYSTEM - Product Card Templates
 * ============================================
 * 
 * Provides multiple product card layouts that can be switched
 * via configuration without touching code.
 * 
 * Available layouts:
 * - modern: Clean design with hover effects
 * - classic: Traditional e-commerce style
 * - minimal: Simple and compact
 * - detailed: Shows more information
 * - compact: Space-efficient grid layout
 * 
 * ============================================
 */

const ProductCardLayouts = {
    /**
     * Modern layout (default)
     */
    modern(product) {
        const price = this.formatPrice(product.price);
        const condition = product.condition === 'New' ? 'جديد' : 'مستعمل';
        const conditionClass = product.condition === 'New' ? 'badge-new' : 'badge-used';

        return `
            <div class="product-card modern" data-product-id="${product.id}">
                <!-- Image -->
                <div class="product-image-container">
                    ${this.renderBadges(product)}
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27400%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27400%27 height=%27400%27/%3E%3Ctext x=%2750%%27 y=%2750%%27 font-size=%2718%27 text-anchor=%27middle%27 alignment-baseline=%27middle%27 fill=%27%23999%27%3ENo Image%3C/text%3E%3C/svg%3E'">
                    
                    <!-- Quick Actions -->
                    <div class="product-quick-actions">
                        <button onclick="ProductActions.viewDetails(${product.id})" 
                                class="btn-icon" 
                                title="عرض التفاصيل">
                            <i class="ri-eye-line"></i>
                        </button>
                        <button onclick="ProductActions.addToCart(${product.id})" 
                                class="btn-icon" 
                                title="إضافة للسلة">
                            <i class="ri-shopping-cart-line"></i>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="product-content">
                    <span class="product-brand">${product.brand}</span>
                    <h3 class="product-title">${product.name}</h3>
                    ${product.description ? `<p class="product-description">${this.truncate(product.description, 60)}</p>` : ''}
                    
                    <div class="product-footer">
                        <div class="product-price-section">
                            <span class="product-price">${price}</span>
                            <span class="product-condition ${conditionClass}">${condition}</span>
                        </div>
                        <button onclick="WhatsAppService.open(WhatsAppService.orderProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}))" 
                                class="btn-order">
                            <i class="ri-whatsapp-line"></i>
                            اطلب الآن
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Classic layout
     */
    classic(product) {
        const price = this.formatPrice(product.price);
        const condition = product.condition === 'New' ? 'جديد' : 'مستعمل';

        return `
            <div class="product-card classic" data-product-id="${product.id}">
                <div class="classic-image-wrap">
                    ${this.renderBadges(product)}
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="classic-image"
                         loading="lazy">
                </div>
                
                <div class="classic-content">
                    <div class="classic-header">
                        <h3 class="classic-title">${product.name}</h3>
                        <p class="classic-brand">${product.brand}</p>
                    </div>
                    
                    <div class="classic-body">
                        ${product.description ? `<p class="classic-desc">${this.truncate(product.description, 80)}</p>` : ''}
                    </div>
                    
                    <div class="classic-footer">
                        <div class="classic-meta">
                            <span class="classic-price">${price}</span>
                            <span class="classic-condition">${condition}</span>
                        </div>
                        <div class="classic-actions">
                            <button onclick="ProductActions.viewDetails(${product.id})" class="btn-secondary">
                                التفاصيل
                            </button>
                            <button onclick="WhatsAppService.open(WhatsAppService.orderProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}))" 
                                    class="btn-primary">
                                اطلب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Minimal layout
     */
    minimal(product) {
        const price = this.formatPrice(product.price);

        return `
            <div class="product-card minimal" data-product-id="${product.id}" onclick="ProductActions.viewDetails(${product.id})">
                <div class="minimal-image-container">
                    ${product.is_offer ? '<span class="minimal-badge-offer">عرض</span>' : ''}
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="minimal-image"
                         loading="lazy">
                </div>
                
                <div class="minimal-content">
                    <h3 class="minimal-title">${product.name}</h3>
                    <p class="minimal-brand">${product.brand}</p>
                    <div class="minimal-price">${price}</div>
                </div>
            </div>
        `;
    },

    /**
     * Detailed layout
     */
    detailed(product) {
        const price = this.formatPrice(product.price);
        const condition = product.condition === 'New' ? 'جديد' : 'مستعمل';

        return `
            <div class="product-card detailed" data-product-id="${product.id}">
                <div class="row-layout">
                    <div class="detailed-image-col">
                        ${this.renderBadges(product)}
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="detailed-image"
                             loading="lazy">
                    </div>
                    
                    <div class="detailed-content-col">
                        <div class="detailed-brand">${product.brand}</div>
                        <h3 class="detailed-title">${product.name}</h3>
                        
                        ${product.description ? `
                            <p class="detailed-description">${product.description}</p>
                        ` : ''}
                        
                        <div class="detailed-specs">
                            <div class="spec-item">
                                <i class="ri-checkbox-circle-line"></i>
                                <span>الحالة: ${condition}</span>
                            </div>
                            ${product.is_offer ? `
                                <div class="spec-item highlight">
                                    <i class="ri-fire-line"></i>
                                    <span>عرض خاص</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="detailed-footer">
                            <div class="detailed-price-large">${price}</div>
                            <div class="detailed-actions">
                                <button onclick="ProductActions.addToCart(${product.id})" class="btn-icon-text">
                                    <i class="ri-shopping-cart-line"></i>
                                    إضافة للسلة
                                </button>
                                <button onclick="WhatsAppService.open(WhatsAppService.orderProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}))" 
                                        class="btn-whatsapp">
                                    <i class="ri-whatsapp-line"></i>
                                    اطلب عبر واتساب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Compact layout
     */
    compact(product) {
        const price = this.formatPrice(product.price);

        return `
            <div class="product-card compact" data-product-id="${product.id}">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="compact-image"
                     loading="lazy"
                     onclick="ProductActions.viewDetails(${product.id})">
                
                <div class="compact-content">
                    <div class="compact-header">
                        <h4 class="compact-title">${this.truncate(product.name, 30)}</h4>
                        <span class="compact-brand">${product.brand}</span>
                    </div>
                    
                    <div class="compact-footer">
                        <span class="compact-price">${price}</span>
                        <button onclick="WhatsAppService.open(WhatsAppService.orderProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}))" 
                                class="compact-btn">
                            <i class="ri-whatsapp-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Helper: Render product badges
     */
    renderBadges(product) {
        let badges = '';

        if (product.is_new) {
            badges += '<span class="badge badge-new"><i class="ri-star-line"></i> جديد</span>';
        }
        if (product.is_offer) {
            badges += '<span class="badge badge-offer"><i class="ri-fire-line"></i> عرض</span>';
        }
        if (!product.is_available) {
            badges += '<span class="badge badge-soldout">نفذت الكمية</span>';
        }

        return badges ? `<div class="product-badges">${badges}</div>` : '';
    },

    /**
     * Helper: Format price
     */
    formatPrice(price) {
        const symbol = StoreConfig.store?.currency?.symbol || 'ر.س';
        const position = StoreConfig.store?.currency?.position || 'after';
        const formatted = parseFloat(price).toFixed(2);

        return position === 'before' ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
    },

    /**
     * Helper: Truncate text
     */
    truncate(text, length) {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    /**
     * Get layout renderer based on config
     */
    getRenderer() {
        const layout = StoreConfig.layouts?.productCard || 'modern';
        return this[layout] || this.modern;
    }
};

/**
 * ============================================
 * CATEGORY FILTER LAYOUTS
 * ============================================
 */

const CategoryFilterLayouts = {
    /**
     * Tabs style (default)
     */
    tabs(categories, activeCategory, onSelect) {
        return `
            <div class="category-tabs">
                ${categories.map(cat => `
                    <button class="tab-button ${activeCategory === cat.id ? 'active' : ''}"
                            onclick="${onSelect}('${cat.id}')">
                        <i class="${cat.icon}"></i>
                        <span>${cat.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    },

    /**
     * Button style
     */
    buttons(categories, activeCategory, onSelect) {
        return `
            <div class="category-buttons">
                ${categories.map(cat => `
                    <button class="category-btn ${activeCategory === cat.id ? 'active' : ''}"
                            onclick="${onSelect}('${cat.id}')">
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
        `;
    },

    /**
     * Dropdown style
     */
    dropdown(categories, activeCategory, onSelect) {
        const activeCat = categories.find(c => c.id === activeCategory) || categories[0];

        return `
            <div class="category-dropdown">
                <select onchange="${onSelect}(this.value)" class="dropdown-select">
                    ${categories.map(cat => `
                        <option value="${cat.id}" ${activeCategory === cat.id ? 'selected' : ''}>
                            ${cat.name}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    },

    /**
     * Chips style
     */
    chips(categories, activeCategory, onSelect) {
        return `
            <div class="category-chips">
                ${categories.map(cat => `
                    <button class="chip ${activeCategory === cat.id ? 'active' : ''}"
                            onclick="${onSelect}('${cat.id}')">
                        <i class="${cat.icon}"></i>
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
        `;
    },

    /**
     * Sidebar style
     */
    sidebar(categories, activeCategory, onSelect) {
        return `
            <div class="category-sidebar">
                <h3 class="sidebar-title">الفئات</h3>
                <ul class="sidebar-list">
                    ${categories.map(cat => `
                        <li class="sidebar-item ${activeCategory === cat.id ? 'active' : ''}"
                            onclick="${onSelect}('${cat.id}')">
                            <i class="${cat.icon}"></i>
                            <span>${cat.name}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    },

    /**
     * Get layout renderer based on config
     */
    getRenderer() {
        const layout = StoreConfig.layouts?.categoryFilter || 'tabs';
        return this[layout] || this.tabs;
    }
};

// Export
window.ProductCardLayouts = ProductCardLayouts;
window.CategoryFilterLayouts = CategoryFilterLayouts;
