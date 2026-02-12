// assets/js/cloudinary.service.js

const CloudinaryService = {
    // دالة الرفع الأساسية
    async uploadImage(file) {
        if (!file) return null;

        const url = `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/upload`;
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('فشل رفع الصورة');

            const data = await response.json();
            return data.secure_url; // نعيد الرابط الآمن فقط (HTTPS)
        } catch (error) {
            console.error("Cloudinary Error:", error);
            alert("حدث خطأ أثناء رفع الصورة. تأكد من حجم الملف.");
            return null;
        }
    }
};