/**
 * =====================================================
 * Data Service - طبقة البيانات الموحدة
 * =====================================================
 * يوفر API موحد لجلب جميع بيانات الموقع
 * @version 1.0.0
 * @date 2026-02-05
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 دقائق
        // تحديد المسار الأساسي بناءً على الموقع
        const path = window.location.pathname;
        if (path.includes('/bio/') || path.includes('/apps/') || path.includes('/projects/')) {
            this.dataPath = '../site/assets/data/';
        } else {
            this.dataPath = 'assets/data/';
        }
    }

    /**
     * جلب البيانات من API مع دعم الكاش
     * @private
     * @param {string} url - مسار كامل للملف
     * @param {boolean} useCache - استخدام الكاش
     * @returns {Promise<Object>} البيانات
     */
    async _fetch(url, useCache = true) {
        // التحقق من الكاش
        if (useCache && this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // حفظ في الكاش
            if (useCache) {
                this.cache.set(url, {
                    data,
                    timestamp: Date.now()
                });
            }

            return data;
        } catch (error) {
            console.error(`خطأ في جلب البيانات من ${url}:`, error);
            throw error;
        }
    }

    /**
     * جلب معلومات الشركة
     * @returns {Promise<Object>} معلومات الشركة
     */
    async getCompanyInfo() {
        return this._fetch(this.dataPath + 'company.json');
    }

    /**
     * جلب جميع الخدمات
     * @returns {Promise<Object>} الخدمات مصنفة حسب الفئات
     */
    async getServices() {
        return this._fetch(this.dataPath + 'services.json');
    }

    /**
     * جلب خدمة معينة حسب ID
     * @param {string} serviceId - معرف الخدمة
     * @returns {Promise<Object|null>} بيانات الخدمة
     */
    async getServiceById(serviceId) {
        const data = await this.getServices();

        for (const category of data.categories) {
            const service = category.services.find(s => s.id === serviceId);
            if (service) {
                return { ...service, category: category.title };
            }
        }

        return null;
    }

    /**
     * جلب خدمات فئة معينة
     * @param {string} categoryId - معرف الفئة
     * @returns {Promise<Array>} قائمة الخدمات
     */
    async getServicesByCategory(categoryId) {
        const data = await this.getServices();
        const category = data.categories.find(c => c.id === categoryId);
        return category ? category.services : [];
    }

    /**
     * جلب المشاريع
     * @returns {Promise<Object>} المشاريع
     */
    async getProjects() {
        return this._fetch(this.dataPath + 'projects.json');
    }

    /**
     * تنظيف الكاش
     * @param {string} [url] - مسار محدد لتنظيفه (اختياري)
     */
    clearCache(url = null) {
        if (url) {
            this.cache.delete(`${this.basePath}${url}`);
        } else {
            this.cache.clear();
        }
    }

    /**
     * إعادة تحميل البيانات
     * @param {string} dataType - نوع البيانات (company, services, projects)
     * @returns {Promise<Object>}
     */
    async reload(dataType) {
        const urls = {
            company: `${this.dataPath}company.json`,
            services: `${this.dataPath}services.json`,
            projects: `${this.dataPath}projects.json`
        };

        if (urls[dataType]) {
            this.clearCache(urls[dataType]);
            return this._fetch(urls[dataType], false);
        }

        throw new Error(`نوع البيانات غير معروف: ${dataType}`);
    }
}

// إنشاء نسخة عامة
const dataService = new DataService();

// تصدير للاستخدام في الmodules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataService, dataService };
}
