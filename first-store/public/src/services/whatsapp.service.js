/**
 * ============================================
 * WHATSAPP SERVICE
 * ============================================
 * 
 * Centralized WhatsApp integration for orders and inquiries.
 * 
 * FEATURES:
 * ✅ Configurable message templates
 * ✅ Input sanitization
 * ✅ Multi-product cart support
 * ✅ URL encoding
 * ✅ Flexible formatting
 * 
 * USAGE:
 * - whatsappService.orderProduct(product)
 * - whatsappService.orderCart(cartItems)
 * - whatsappService.sendInquiry()
 * 
 * ============================================
 */

class WhatsAppService {
    constructor() {
        this.baseUrl = 'https://wa.me/';
        this.phone = null;
    }

    /**
     * Initialize service with phone number from config
     */
    init() {
        if (!StoreConfig?.contact?.whatsapp) {
            console.error('❌ WhatsApp phone number not configured');
            return false;
        }

        this.phone = this.sanitizePhoneNumber(StoreConfig.contact.whatsapp);

        if (!this.phone) {
            console.error('❌ Invalid WhatsApp phone number');
            return false;
        }

        console.log('✅ WhatsApp service initialized');
        return true;
    }

    /**
     * Generate WhatsApp link for single product order
     * @param {object} product - Product object
     * @returns {string} WhatsApp URL
     */
    orderProduct(product) {
        if (!this.phone) {
            this.init();
        }

        if (!product || !product.name) {
            return this.getBaseUrl();
        }

        const message = this.formatOrderMessage(product);
        return this.buildUrl(message);
    }

    /**
     * Generate WhatsApp link for cart checkout
     * @param {Array} cartItems - Array of cart items
     * @returns {string} WhatsApp URL
     */
    orderCart(cartItems) {
        if (!this.phone) {
            this.init();
        }

        if (!cartItems || cartItems.length === 0) {
            return this.getBaseUrl();
        }

        const message = this.formatCartMessage(cartItems);
        return this.buildUrl(message);
    }

    /**
     * Generate WhatsApp link for general inquiry
     * @returns {string} WhatsApp URL
     */
    sendInquiry() {
        if (!this.phone) {
            this.init();
        }

        const message = StoreConfig.whatsapp?.inquiryMessage || 'مرحباً، لدي استفسار عن متجركم';
        return this.buildUrl(message);
    }

    /**
     * Generate WhatsApp link for video request
     * @param {object} product - Product object
     * @returns {string} WhatsApp URL
     */
    requestVideo(product) {
        if (!this.phone) {
            this.init();
        }

        if (!product || !product.name) {
            return this.getBaseUrl();
        }

        const message = `مرحباً، أريد فيديو لـ ${this.sanitize(product.name)}`;
        return this.buildUrl(message);
    }

    /**
     * Open WhatsApp in new tab
     * @param {string} url - WhatsApp URL
     */
    open(url) {
        if (!url) {
            url = this.getBaseUrl();
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    }

    /**
     * Format single product order message
     * @private
     */
    formatOrderMessage(product) {
        // Get template from config or use default
        let template = StoreConfig.whatsapp?.orderMessage ||
            'مرحباً، أنا مهتم بـ {brand} {productName} ({condition}) بسعر {price}';

        // Prepare variables
        const vars = {
            productName: this.sanitize(product.name),
            brand: this.sanitize(product.brand),
            price: this.formatPrice(product.price),
            condition: product.condition === 'New' ? 'جديد' : 'مستعمل'
        };

        // Replace variables in template
        return this.replaceVariables(template, vars);
    }

    /**
     * Format cart checkout message
     * @private
     */
    formatCartMessage(cartItems) {
        // Get template from config or use default
        let template = StoreConfig.whatsapp?.cartMessage ||
            'مرحباً، أريد طلب المنتجات التالية:\n\n{cartItems}\n\nالإجمالي: {total}';

        // Format cart items list
        const itemsList = cartItems.map((item, index) => {
            const price = this.formatPrice(item.price);
            const total = this.formatPrice(item.price * item.quantity);
            return `${index + 1}. ${this.sanitize(item.name)} × ${item.quantity} = ${total}`;
        }).join('\n');

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalFormatted = this.formatPrice(totalAmount);

        // Replace variables
        const vars = {
            cartItems: itemsList,
            total: totalFormatted
        };

        return this.replaceVariables(template, vars);
    }

    /**
     * Replace variables in template string
     * @private
     */
    replaceVariables(template, vars) {
        let message = template;

        Object.keys(vars).forEach(key => {
            const placeholder = `{${key}}`;
            message = message.replace(new RegExp(placeholder, 'g'), vars[key]);
        });

        return message;
    }

    /**
     * Format price according to config
     * @private
     */
    formatPrice(price) {
        const symbol = StoreConfig.store?.currency?.symbol || 'ر.س';
        const position = StoreConfig.store?.currency?.position || 'after';
        const formatted = parseFloat(price).toFixed(2);

        if (position === 'before') {
            return `${symbol}${formatted}`;
        } else {
            return `${formatted} ${symbol}`;
        }
    }

    /**
     * Sanitize input to prevent injection
     * @private
     */
    sanitize(text) {
        if (typeof text !== 'string') {
            return '';
        }

        // Remove potentially dangerous characters
        return text.replace(/[<>\"'`]/g, '')
            .trim();
    }

    /**
     * Sanitize and validate phone number
     * @private
     */
    sanitizePhoneNumber(phone) {
        if (typeof phone !== 'string') {
            return null;
        }

        // Remove all non-digit characters
        phone = phone.replace(/\D/g, '');

        // Validate length (international format, 10-15 digits)
        if (phone.length < 10 || phone.length > 15) {
            return null;
        }

        return phone;
    }

    /**
     * Build complete WhatsApp URL
     * @private
     */
    buildUrl(message) {
        if (!this.phone) {
            return this.getBaseUrl();
        }

        const encodedMessage = encodeURIComponent(message);
        return `${this.baseUrl}${this.phone}?text=${encodedMessage}`;
    }

    /**
     * Get base WhatsApp URL (no message)
     * @private
     */
    getBaseUrl() {
        if (!this.phone) {
            this.init();
        }

        return this.phone ? `${this.baseUrl}${this.phone}` : '#';
    }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

// Auto-initialize
if (window.StoreConfig) {
    whatsappService.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => whatsappService.init(), 100);
    });
}

// Export
window.WhatsAppService = whatsappService;
