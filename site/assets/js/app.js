// =========================================
// Main Application JavaScript
// =========================================

// Global company info
let companyInfo = null;

document.addEventListener('DOMContentLoaded', async function () {

    // Load company info first
    await loadCompanyInfo();

    // Initialize all functions
    initNavbar();
    initScrollToTop();
    initProgressBar();
    initSmoothScroll();
    initCounters();
    initTooltips();
    loadServices();
    loadFAQ();
    updateContactLinks();

    // Initialize after short delay to ensure DOM is ready
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});

// =========================================
// 1. Navbar Scroll Effect (with Throttle)
// =========================================
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                updateActiveNavLink();
                scrollTimeout = null;
            }, 100); // Throttle to every 100ms
        }
    }, { passive: true });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// =========================================
// 2. Scroll to Top Button
// =========================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =========================================
// 2.5 Progress Bar (with Throttle)
// =========================================
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    let progressTimeout;

    window.addEventListener('scroll', () => {
        if (!progressTimeout) {
            progressTimeout = setTimeout(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressBar.style.width = scrolled + '%';
                progressTimeout = null;
            }, 50);
        }
    }, { passive: true });
}

// =========================================
// 3. Smooth Scroll for Internal Links
// =========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Navbar height offset

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================
// 4. Animated Counters
// =========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        const firstCounter = counters[0];
        if (!firstCounter) return;

        const rect = firstCounter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            animated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load
}

// =========================================
// 5. Initialize Tooltips (Tippy.js)
// =========================================
function initTooltips() {
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]', {
            theme: 'light',
            animation: 'scale',
            duration: 300,
            arrow: true,
            placement: 'top'
        });
    }
}

// =========================================
// 5.5 Load Company Info (Centralized Data)
// =========================================
async function loadCompanyInfo() {
    try {
        const response = await fetch('../shared/data/company-info.json');
        if (response.ok) {
            companyInfo = await response.json();
        }
    } catch (error) {
        console.error('Error loading company info:', error);
    }
}

// Update all contact links with centralized data
function updateContactLinks() {
    if (!companyInfo) return;

    const whatsappNumber = companyInfo.contact.whatsapp;
    const email = companyInfo.contact.email;
    const socialLinks = companyInfo.social;

    // Update WhatsApp links
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${whatsappNumber}`;
    });

    // Update email links
    document.querySelectorAll('a[href*="mailto"]').forEach(link => {
        link.href = `mailto:${email}`;
    });

    // Update email text
    document.querySelectorAll('p, a').forEach(el => {
        if (el.textContent.includes('rahbadev@gmail.com')) {
            el.textContent = el.textContent.replace('rahbadev@gmail.com', email);
        }
    });

    // Update social links if they exist
    if (socialLinks.twitter) {
        document.querySelectorAll('a[href*="twitter.com"]').forEach(link => {
            link.href = socialLinks.twitter;
        });
    }
    if (socialLinks.github) {
        document.querySelectorAll('a[href*="github.com"]').forEach(link => {
            link.href = socialLinks.github;
        });
    }
}

// =========================================
// 6. Load Services Dynamically
// =========================================
// Helper function for color adjustment
function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

async function loadServices() {
    try {
        const response = await fetch('data/services.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const container = document.getElementById('servicesContainer');

        if (!container) {
            console.error('servicesContainer not found!');
            return;
        }

        container.innerHTML = data.categories.map(category => `
            <div class="col-12 mb-4">
                <div class="service-category-modern">
                    <div class="category-header-modern">
                        <div class="category-badge" style="background: ${category.color}15; border-right: 4px solid ${category.color};">
                            <i class="${category.icon}" style="color: ${category.color};"></i>
                            <div class="category-info">
                                <h3 class="category-title-modern">${category.title}</h3>
                                <p class="category-desc-modern">${category.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="services-grid-modern">
                        ${category.services.map(service => `
                            <div class="service-card-modern">
                                <div class="service-header-flex">
                                    <div class="service-icon-modern" style="color: ${category.color};">
                                        <i class="${service.icon}"></i>
                                    </div>
                                    ${service.price > 0 ? `<span class="service-price-badge" style="background: ${category.color}20; color: ${category.color};">${service.price}$</span>` : ''}
                                </div>
                                <h4 class="service-title-modern">${service.title}</h4>
                                <p class="service-desc-modern">${service.description}</p>
                                <div class="service-footer-modern">
                                    <span class="price-from">${service.priceLabel}</span>
                                    ${service.exampleUrl ? `
                                        <a href="${service.exampleUrl}" target="_blank" class="btn-example-modern" style="color: ${category.color};">
                                            <i class="fas fa-external-link-alt"></i> مثال
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// =========================================
// 7. Load FAQ
// =========================================
async function loadFAQ() {
    const faqData = [
        {
            question: "كم من الوقت يستغرق تطوير تطبيق جوال؟",
            answer: "يعتمد ذلك على حجم التطبيق وتعقيده. تطبيق بسيط قد يستغرق 2-4 أسابيع، بينما تطبيق متوسط أو معقد قد يستغرق 1-3 أشهر. نقدم لك جدول زمني تفصيلي بعد مناقشة متطلبات مشروعك."
        },
        {
            question: "هل توفرون الدعم بعد التسليم؟",
            answer: "نعم، نقدم دعماً فنياً مجانياً لمدة شهر بعد التسليم لضمان عمل المشروع بشكل مثالي. بعد ذلك يمكنك الاشتراك في باقات الدعم الشهرية أو السنوية."
        },
        {
            question: "هل يمكنني طلب تعديلات على المشروع؟",
            answer: "بالتأكيد! نقدم جولتين من التعديلات المجانية ضمن نطاق المشروع الأصلي. أي تعديلات إضافية أو خارج النطاق سيتم تسعيرها بشكل منفصل."
        },
        {
            question: "كيف تتم عملية الدفع؟",
            answer: "نعمل بنظام الدفع على مراحل: 50% عند بدء المشروع، و50% عند التسليم النهائي. نقبل التحويلات البنكية، PayPal، ومحافظ العملات الرقمية."
        },
        {
            question: "هل تقدمون خدمات نشر التطبيقات على المتاجر؟",
            answer: "نعم، نساعدك في نشر تطبيقك على Google Play Store و Apple App Store، بما في ذلك إعداد الحسابات، كتابة الوصف، واستيفاء متطلبات المتاجر."
        },
        {
            question: "ما هي التقنيات التي تستخدمونها؟",
            answer: "نستخدم أحدث التقنيات: Flutter و React Native للتطبيقات متعددة المنصات، Java/Kotlin لتطبيقات Android الأصلية، وتقنيات الويب الحديثة مثل React و Vue.js للمواقع."
        },
        {
            question: "هل يمكنني رؤية نماذج من أعمالكم السابقة؟",
            answer: "بالتأكيد! يمكنك تصفح قسم <a href='#projects' class='text-primary'>المشاريع</a> في الأعلى لمشاهدة مجموعة من أعمالنا السابقة مع تفاصيل كل مشروع."
        },
        {
            question: "هل تقدمون استشارات تقنية مجانية؟",
            answer: "نعم، نقدم استشارة أولية مجانية لمناقشة فكرة مشروعك ومساعدتك في اختيار الحل التقني الأنسب. تواصل معنا عبر واتساب أو البريد الإلكتروني."
        }
    ];

    const container = document.getElementById('faqAccordion');
    if (!container) return;

    container.innerHTML = faqData.map((item, index) => `
        <div class="accordion-item">
            <h2 class="accordion-header" id="faqHeading${index}">
                <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faqCollapse${index}" 
                        aria-expanded="${index === 0 ? 'true' : 'false'}" 
                        aria-controls="faqCollapse${index}">
                    ${item.question}
                </button>
            </h2>
            <div id="faqCollapse${index}" 
                 class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                 aria-labelledby="faqHeading${index}" 
                 data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    ${item.answer}
                </div>
            </div>
        </div>
    `).join('');
}

// =========================================
// 8. Animate Elements on Scroll
// =========================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .project-card, .feature-item, .contact-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// =========================================
// 9. Utility Functions
// =========================================

// Adjust color brightness
function adjustColor(color, amount) {
    // Remove # if present
    color = color.replace('#', '');

    // Convert to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Adjust
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    // Convert back to hex
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Show notification (can be expanded with a toast library)
function showNotification(message, type = 'info') {
    // Can be expanded with toast library
}

// Format currency
function formatCurrency(amount, currency = '$') {
    return `${amount}${currency} `;
}

// Validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
