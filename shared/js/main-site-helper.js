// =========================================
// Main Site - Data Integration Helper
// يساعد في دمج البيانات المركزية مع الموقع الرئيسي
// =========================================

/**
 * هذا الملف يساعد الموقع الرئيسي في استخدام البيانات المركزية
 * من shared بدلاً من تكرار البيانات
 */

class MainSiteHelper {
    constructor() {
        this.dataLoader = new DataLoader('../shared/data');
    }

    /**
     * تحديث معلومات الشركة في الموقع الرئيسي
     */
    async updateCompanyInfo() {
        const info = await this.dataLoader.getCompanyInfo();
        if (!info) return;

        // تحديث العنوان والميتا
        document.title = `${info.name} | ${info.nameEn}`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = info.descriptionLong || info.description;
        }

        // تحديث الشعار
        const logos = document.querySelectorAll('[data-company-logo]');
        logos.forEach(logo => {
            logo.src = info.logo;
            logo.alt = info.name;
        });

        // تحديث روابط التواصل
        this.updateContactLinks(info);

        // تحديث روابط السوشيال ميديا
        this.updateSocialLinks(info);

        return info;
    }

    /**
     * تحديث روابط التواصل
     */
    updateContactLinks(info) {
        // WhatsApp
        const whatsappLinks = document.querySelectorAll('[data-whatsapp-link]');
        whatsappLinks.forEach(link => {
            link.href = `https://wa.me/${info.contact.whatsapp}`;
        });

        // Email
        const emailLinks = document.querySelectorAll('[data-email-link]');
        emailLinks.forEach(link => {
            link.href = `mailto:${info.contact.email}`;
        });

        // Phone
        const phoneLinks = document.querySelectorAll('[data-phone-link]');
        phoneLinks.forEach(link => {
            link.href = `tel:${info.contact.phone}`;
        });
    }

    /**
     * تحديث روابط السوشيال ميديا
     */
    updateSocialLinks(info) {
        // Twitter
        const twitterLinks = document.querySelectorAll('[data-twitter-link]');
        twitterLinks.forEach(link => {
            link.href = info.social.twitter;
        });

        // GitHub
        const githubLinks = document.querySelectorAll('[data-github-link]');
        githubLinks.forEach(link => {
            link.href = info.social.github;
        });

        // LinkedIn (إذا كان موجود)
        if (info.social.linkedin) {
            const linkedinLinks = document.querySelectorAll('[data-linkedin-link]');
            linkedinLinks.forEach(link => {
                link.href = info.social.linkedin;
            });
        }

        // Instagram (إذا كان موجود)
        if (info.social.instagram) {
            const instagramLinks = document.querySelectorAll('[data-instagram-link]');
            instagramLinks.forEach(link => {
                link.href = info.social.instagram;
            });
        }
    }

    /**
     * دمج الخدمات من المصدر المركزي مع التفاصيل المحلية
     */
    async mergeServices() {
        const servicesSummary = await this.dataLoader.getServicesSummary();
        const servicesDetails = await this.dataLoader.getFullServices();

        if (!servicesSummary || !servicesDetails) return null;

        // دمج البيانات: التفاصيل من servicesDetails والأيقونات/الألوان من servicesSummary
        const summary = servicesSummary.services;

        if (servicesDetails.categories) {
            servicesDetails.categories.forEach(category => {
                const summaryItem = summary.find(s => s.id === category.id);
                if (summaryItem) {
                    category.icon = summaryItem.icon;
                    category.color = summaryItem.color;
                }
            });
        }

        return servicesDetails;
    }

    /**
     * إنشاء بطاقة خدمة من البيانات المركزية
     */
    createServiceCard(service) {
        return `
            <div class="service-card" style="border-top: 3px solid ${service.color}">
                <div class="service-icon">
                    <i class="${service.icon}" style="color: ${service.color}"></i>
                </div>
                <h3>${service.title}</h3>
                <p class="service-description">${service.descriptionLong || service.description}</p>
                ${service.examples ? `
                    <ul class="service-examples">
                        ${service.examples.slice(0, 3).map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }

    /**
     * تطبيق المتغيرات المركزية على الموقع
     */
    applyCentralizedStyles() {
        // التأكد من تحميل variables.css و components.css
        const hasVariables = document.querySelector('link[href*="shared/css/variables.css"]');
        const hasComponents = document.querySelector('link[href*="shared/css/components.css"]');

        if (!hasVariables) {
            console.warn('⚠️ variables.css غير محمّل. يُنصح بإضافته في <head>');
        }

        if (!hasComponents) {
            console.info('ℹ️ components.css غير محمّل. يمكن إضافته لاستخدام المكونات الجاهزة');
        }
    }

    /**
     * إنشاء footer موحّد
     */
    async createUnifiedFooter() {
        const info = await this.dataLoader.getCompanyInfo();
        if (!info) return '';

        return `
            <footer class="site-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>${info.name}</h3>
                        <p>${info.description}</p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>تواصل معنا</h4>
                        <p><i class="fas fa-envelope"></i> ${info.contact.email}</p>
                        ${info.contact.phone ? `<p><i class="fas fa-phone"></i> ${info.contact.phone}</p>` : ''}
                    </div>
                    
                    <div class="footer-section">
                        <h4>تابعنا</h4>
                        <div class="social-links">
                            ${info.social.twitter ? `<a href="${info.social.twitter}"><i class="fab fa-twitter"></i></a>` : ''}
                            ${info.social.github ? `<a href="${info.social.github}"><i class="fab fa-github"></i></a>` : ''}
                            ${info.contact.whatsapp ? `<a href="https://wa.me/${info.contact.whatsapp}"><i class="fab fa-whatsapp"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>جميع الحقوق محفوظة © ${new Date().getFullYear()} ${info.name}</p>
                    <p>صُنع بـ <i class="fas fa-heart"></i> في ${info.location.country}</p>
                </div>
            </footer>
        `;
    }
}

// Export للاستخدام
window.MainSiteHelper = MainSiteHelper;

// =========================================
// استخدام تلقائي عند التحميل (اختياري)
// =========================================

// يمكن إضافة هذا الكود في صفحة main_site/index.html
/*
document.addEventListener('DOMContentLoaded', async () => {
    const helper = new MainSiteHelper();
    
    // تحديث معلومات الشركة
    await helper.updateCompanyInfo();
    
    // تطبيق الأنماط المركزية
    helper.applyCentralizedStyles();
    
    // دمج الخدمات (إذا لزم الأمر)
    const services = await helper.mergeServices();
    console.log('Merged services:', services);
});
*/

