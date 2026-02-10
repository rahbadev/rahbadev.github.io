/**
 * ============================================
 * Utility Functions - Enhanced & Consolidated
 * All formatting, validation, and helper functions
 * ============================================
 */

const StoreUtils = {
    // ============ Formatting ============
    formatCurrency(price, currency = '$') {
        return `${currency}${parseFloat(price).toFixed(2)}`;
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    truncateText(text, maxLength = 50) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    // ============ WhatsApp Integration ============
    getWhatsAppLink(phone, product) {
        if (!product) return `https://wa.me/${phone}`;

        const condition = product.condition === 'New' ? 'جديد' : 'مستعمل';
        const text = `مرحباً، أنا مهتم بـ ${product.brand} ${product.name} (${condition}) بسعر ${this.formatCurrency(product.price)}`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    },

    getVideoRequestLink(phone, product) {
        const text = `ممكن فيديو لـ ${product.name}؟`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    },

    // ============ Theme Management ============
    initThemeVariables() {
        if (typeof StoreThemeConfig === 'undefined') return;

        const root = document.documentElement;
        const { colors, fonts } = StoreThemeConfig.theme || {};

        // Inject colors
        Object.entries(colors || {}).forEach(([key, value]) => {
            root.style.setProperty(`--color-${this.kebabCase(key)}`, value);
        });

        // Inject fonts
        if (fonts?.primary) {
            root.style.setProperty('--font-primary', fonts.primary);
        }

        console.log('✅ Theme Variables Injected');
    },

    // ============ DOM Manipulation ============
    scrollToElement(id, offset = 80) {
        const element = document.getElementById(id);
        if (!element) return;

        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },

    scrollContainer(id, direction, amount = 300) {
        const container = document.getElementById(id);
        if (!container) return;

        const scrollAmount = direction === 'right' ? amount : -amount;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    },

    // ============ Storage (Enhanced) ============
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn(`Storage get error for key "${key}":`, error);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn(`Storage set error for key "${key}":`, error);
                return false;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn(`Storage remove error for key "${key}":`, error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('Storage clear error:', error);
                return false;
            }
        }
    },

    // ============ Validation ============
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
        return /^[0-9+\-\s()]+$/.test(phone);
    },

    // ============ String Utilities ============
    kebabCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // ============ Number Utilities ============
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // ============ Debounce & Throttle ============
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // ============ Image Utilities ============
    getOptimizedImageUrl(url, width = 800, quality = 80) {
        // For Cloudinary URLs
        if (url.includes('cloudinary')) {
            return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
        }
        return url;
    },

    // ============ Array Utilities ============
    chunk(array, size) {
        return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
            array.slice(i * size, i * size + size)
        );
    },

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
