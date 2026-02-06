/**
 * =====================================================
 * Contact Info Updater
 * =====================================================
 * يقوم بتحميل معلومات الاتصال والنصوص الخاصة بالشركة من dataService
 * ويقوم بتحديث جميع النصوص والروابط في الصفحة بشكل ديناميكي.
 * @version 2.0
 * @date 2026-02-06
 */

// Load and update company contact info and content using dataService
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await dataService.getCompanyInfo();

        // =========================================
        // تحديث النصوص في Hero Section
        // =========================================
        const heroSubtitle = document.getElementById('heroSubtitle');
        if (heroSubtitle && data.company.heroSubtitle) {
            heroSubtitle.textContent = data.company.heroSubtitle;
        }

        // =========================================
        // تحديث النصوص في Bio Section
        // =========================================
        const bioTitle = document.getElementById('bioTitle');
        if (bioTitle && data.company.fullName) {
            bioTitle.textContent = data.company.fullName;
        }

        const bioDescription = document.getElementById('bioDescription');
        if (bioDescription && data.company.bioDescription) {
            bioDescription.textContent = data.company.bioDescription;
        }

        // =========================================
        // تحديث روابط Bio Section
        // =========================================
        const bioWhatsappBtn = document.getElementById('bioWhatsappBtn');
        if (bioWhatsappBtn) bioWhatsappBtn.href = data.contact.whatsappLink;

        // =========================================
        // بناء أيقونات Social Icons (موحد لكلا الصفحتين)
        // =========================================
        function buildSocialIcons(data) {
            const icons = [];

            if (data.contact.email) {
                icons.push(`<a href="mailto:${data.contact.email}" class="social-icon-bio email" title="البريد الإلكتروني"><i class="fas fa-envelope"></i></a>`);
            }
            if (data.contact.telegramLink) {
                icons.push(`<a href="${data.contact.telegramLink}" class="social-icon-bio telegram" target="_blank" title="تيليجرام"><i class="fab fa-telegram-plane"></i></a>`);
            }
            if (data.social.facebook) {
                icons.push(`<a href="${data.social.facebook}" class="social-icon-bio facebook" target="_blank" title="فيسبوك"><i class="fab fa-facebook-f"></i></a>`);
            }
            if (data.social.github) {
                icons.push(`<a href="${data.social.github}" class="social-icon-bio github" target="_blank" title="جيت هب"><i class="fab fa-github"></i></a>`);
            }
            if (data.social.playstore) {
                icons.push(`<a href="${data.social.playstore}" class="social-icon-bio playstore" target="_blank" title="متجر جوجل بلاي"><i class="fab fa-google-play"></i></a>`);
            }

            return icons.join('');
        }

        // =========================================
        // تحديث البيانات في صفحة Bio المنفصلة
        // =========================================
        // Update company name
        const companyName = document.getElementById('companyName');
        if (companyName && data.company.fullName) {
            companyName.textContent = data.company.fullName;
        }

        // Update tagline and description
        const tagline = document.getElementById('tagline');
        if (tagline && data.company.tagline) {
            tagline.textContent = data.company.tagline;
        }

        const description = document.getElementById('description');
        if (description && data.company.description) {
            description.textContent = data.company.description;
        }

        // Update WhatsApp link in bio page
        const whatsappLink = document.getElementById('whatsappLink');
        if (whatsappLink) whatsappLink.href = data.contact.whatsappLink;

        // تطبيق الأيقونات الاجتماعية (موحد لكلا الصفحتين)
        const socialIcons = document.getElementById('socialIcons');
        if (socialIcons) {
            socialIcons.innerHTML = buildSocialIcons(data);
        }

        // Update bio page footer
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();

        const footerName = document.getElementById('footerName');
        if (footerName && data.company.name) {
            footerName.textContent = data.company.name;
        }

        const footerEmailBio = document.getElementById('footerEmail');
        if (footerEmailBio && data.contact.email) {
            footerEmailBio.href = `mailto:${data.contact.email}`;
            footerEmailBio.textContent = data.contact.email;
        }

        // =========================================
        // تحديث النصوص في Footer
        // =========================================
        const footerBrandName = document.getElementById('footerBrandName');
        if (footerBrandName && data.company.name) {
            footerBrandName.textContent = data.company.name;
        }

        const footerDescription = document.getElementById('footerDescription');
        if (footerDescription && data.company.descriptionLong) {
            footerDescription.textContent = data.company.descriptionLong;
        }

        const footerCopyright = document.getElementById('footerCopyright');
        if (footerCopyright && data.company.name) {
            const currentYear = new Date().getFullYear();
            footerCopyright.textContent = `© ${currentYear} ${data.company.name}. جميع الحقوق محفوظة.`;
        }

        // =========================================
        // تحديث روابط Footer
        // =========================================
        const footerEmail = document.querySelector('.footer-contact a[href^="mailto:"]');
        if (footerEmail) {
            footerEmail.href = `mailto:${data.contact.email}`;
            footerEmail.textContent = data.contact.email;
        }

        const footerWhatsapp = document.querySelector('.footer-contact a[href^="https://wa.me"]');
        if (footerWhatsapp) footerWhatsapp.href = data.contact.whatsappLink;

        const footerTelegram = document.querySelector('.footer-contact a[href^="https://t.me"]');
        if (footerTelegram) {
            footerTelegram.href = data.contact.telegramLink;
            footerTelegram.textContent = data.contact.telegram;
        }

        // =========================================
        // تحديث زر WhatsApp العائم
        // =========================================
        const floatingWhatsApp = document.getElementById('floatingWhatsApp');
        if (floatingWhatsApp) floatingWhatsApp.href = data.contact.whatsappLink;

        console.log('✅ تم تحديث جميع معلومات الاتصال والنصوص بنجاح.');
    } catch (err) {
        console.error('❌ خطأ في تحميل معلومات الشركة', err);
    }
});
