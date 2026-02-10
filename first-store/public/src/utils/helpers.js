/**
 * ============================================
 * UTILITY HELPERS
 * ============================================
 * 
 * Common helper functions used throughout the app
 * 
 * ============================================
 */

const Utils = {
    /**
     * Scroll to element smoothly
     */
    scrollTo(elementId, offset = 100) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    },

    /**
     * Debounce function (for search input)
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function (for scroll events)
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format number with separators
     */
    formatNumber(num) {
        return new Intl.NumberFormat('ar-SA').format(num);
    },

    /**
     * Truncate text
     */
    truncate(text, length = 50) {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    },

    /**
     * Share via Web Share API or fallback
     */
    async share(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                }
                return false;
            }
        } else {
            // Fallback: copy link
            if (data.url) {
                return await this.copyToClipboard(data.url);
            }
            return false;
        }
    },

    /**
     * Lazy load images
     */
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    /**
     * Check if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Get query parameter from URL
     */
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Set page title
     */
    setPageTitle(title) {
        document.title = title || StoreConfig.seo?.title || 'المتجر';
    },

    /**
     * Update meta tags for SEO
     */
    updateMetaTags(data = {}) {
        const title = data.title || StoreConfig.seo?.title;
        const description = data.description || StoreConfig.seo?.description;
        const image = data.image || StoreConfig.seo?.image;

        if (title) {
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
            document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
        }

        if (description) {
            document.querySelector('meta[name="description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
        }

        if (image) {
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
            document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image);
        }
    },

    /**
     * Get estimated reading time
     */
    getReadingTime(text, wordsPerMinute = 200) {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone number (Saudi format)
     */
    isValidSaudiPhone(phone) {
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');

        // Check formats: 05xxxxxxxx or 9665xxxxxxxx
        return /^(05\d{8}|9665\d{8})$/.test(cleaned);
    },

    /**
     * Format Saudi phone for display
     */
    formatSaudiPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.startsWith('966')) {
            // International format: +966 5X XXX XXXX
            return '+' + cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
        } else if (cleaned.startsWith('05')) {
            // Local format: 05X XXX XXXX
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }

        return phone;
    }
};

/**
 * Initialize utilities on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images if enabled
    if (StoreConfig.features?.lazyLoadImages) {
        Utils.lazyLoadImages();
    }

    // Update meta tags
    Utils.updateMetaTags();

    console.log('🔧 Utils module loaded');
});

// Export
window.Utils = Utils;
