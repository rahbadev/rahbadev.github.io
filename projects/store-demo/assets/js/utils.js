// assets/js/utils.js

const Utils = {
    // تنسيق العملة (مثلاً: 1500 -> 1,500 ر.س)
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR', // يمكن تغييرها لجلب العملة من config لاحقاً
            minimumFractionDigits: 0
        }).format(amount).replace('SAR', CONFIG.brand.currency);
    },

    // تنسيق التاريخ (للمنتجات الجديدة)
    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ar-SA');
    },

    // مشاركة المنتج (Web Share API)
    async shareProduct(product) {
        const shareData = {
            title: product.name,
            text: `${product.name} \n بسعر: ${this.formatCurrency(product.price)} \n ${product.description || ''}`,
            url: window.location.href // رابط المتجر الحالي
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('مشاركة ألغيت');
            }
        } else {
            // Fallback: نسخ الرابط للحافظة
            navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            alert('تم نسخ تفاصيل المنتج!');
        }
    },

    // إنشاء رابط واتساب للطلب
    generateWhatsAppLink(cartItems, total) {
        const phone = CONFIG.system.whatsappNumber || "966500000000"; // Fallback

        let message = `مرحباً، أريد طلب المنتجات التالية من *${CONFIG.brand.storeName || 'المتجر'}*:%0a%0a`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. *${item.name}* (${item.quantity}x)%0a`;
            // message += `   السعر: ${item.price * item.quantity}%0a`; // اختياري
        });

        message += `%0a*المجموع الكلي:* ${this.formatCurrency(total)}%0a`;
        message += `%0aيرجى تأكيد الطلب.`;

        return `https://wa.me/${phone}?text=${message}`;
    }
};