/**
 * Designs Gallery Modal
 * يفتح صفحة المعرض في modal بشكل iframe
 */

// إضافة CSS للـ modal
const modalStyles = `
    .designs-iframe-modal {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .designs-iframe-modal.show {
        display: flex;
        animation: designsModalFadeIn 0.3s;
    }

    .designs-iframe-container {
        width: 100%;
        max-width: 1600px;
        height: 90vh;
        background: var(--bg-primary);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 100px rgba(0, 0, 0, 0.5);
        position: relative;
        animation: designsModalSlideUp 0.4s ease-out;
    }

    .designs-iframe-close {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .designs-iframe-close:hover {
        background: var(--danger-color);
        transform: rotate(90deg);
    }

    .designs-iframe-modal iframe {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
    }

    @keyframes designsModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes designsModalSlideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 768px) {
        .designs-iframe-modal {
            padding: 0;
        }

        .designs-iframe-container {
            max-width: 100%;
            height: 100vh;
            border-radius: 0;
        }

        .designs-iframe-close {
            top: 0.75rem;
            left: 0.75rem;
            width: 44px;
            height: 44px;
        }
    }
`;

// إضافة الـ styles للصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// إنشاء HTML للـ modal
const createModalHTML = () => {
    const modalHTML = `
        <div class="designs-iframe-modal" id="designsModal" onclick="if(event.target===this) DesignsModal.close()">
            <div class="designs-iframe-container">
                <button class="designs-iframe-close" onclick="DesignsModal.close()">
                    <i class="fas fa-times"></i>
                </button>
                <iframe id="designsIframe" src="" title="معرض التصميمات"></iframe>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);
};

// إنشاء الـ modal عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createModalHTML);
} else {
    createModalHTML();
}

// الـ modal object
const DesignsModal = {
    open(category = 'all') {
        const modal = document.getElementById('designsModal');
        const iframe = document.getElementById('designsIframe');

        // بناء URL مع التصنيف
        const url = `../projects/design/index.html${category !== 'all' ? '?cat=' + category : ''}`;
        iframe.src = url;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    close() {
        const modal = document.getElementById('designsModal');
        const iframe = document.getElementById('designsIframe');

        modal.classList.remove('show');
        document.body.style.overflow = '';

        // تأخير إفراغ iframe لتجنب الوميض
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                iframe.src = '';
            }
        }, 300);
    }
};

// دعم Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('designsModal')?.classList.contains('show')) {
        DesignsModal.close();
    }
});

// تصدير للاستخدام العام
window.DesignsModal = DesignsModal;
