// =========================================
// Portfolio App - Linktree Style
// =========================================

// Projects Data
const projectsData = [
    {
        id: "store_demo",
        title: "متجر الأناقة",
        category: "stores",
        description: "متجر إلكتروني عصري بتصميم احترافي مع سلة تسوق",
        image: "../assets/images/projects/store_demo.webp",
        link: "../assets/demo/store-demo.html",
        badge: "عرض تجريبي",
        technologies: ["Tailwind CSS", "Alpine.js", "Font Awesome"]
    },
    {
        id: "madarij_platform",
        title: "منصة مدارج العلم",
        category: "websites",
        description: "منصة تعليمية متكاملة لإدارة الدورات والطلاب",
        image: "../assets/images/projects/madarij_platform.webp",
        link: "https://madarj.manasah.org",
        badge: "مكتمل",
        technologies: ["PHP", "Laravel", "MySQL", "Bootstrap"]
    },
    {
        id: "alqayimm_app",
        title: "تطبيق القائم",
        category: "apps",
        description: "تطبيق لإدارة المساجد والدور القرآنية",
        image: "https://via.placeholder.com/400x300/2d6ac8/ffffff?text=القائم",
        link: "../projects/alqayimm_app/",
        badge: "مكتمل",
        technologies: ["Flutter", "Firebase", "Dart"]
    },
    {
        id: "brand_identity",
        title: "هوية بصرية - شركة",
        category: "branding",
        description: "هوية بصرية احترافية لشركة تقنية",
        image: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Brand+Identity",
        link: "#",
        badge: "مكتمل",
        technologies: ["Adobe Illustrator", "InDesign"]
    },
    {
        id: "restaurant_website",
        title: "موقع مطعم",
        category: "websites",
        description: "موقع مطعم أنيق مع قائمة طعام تفاعلية",
        image: "https://via.placeholder.com/400x300/10b981/ffffff?text=Restaurant",
        link: "#",
        badge: "قيد التطوير",
        technologies: ["React", "Next.js", "Tailwind"]
    },
    {
        id: "mobile_store",
        title: "متجر جوالات",
        category: "stores",
        description: "متجر إلكتروني متخصص في بيع الجوالات",
        image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Mobile+Store",
        link: "#",
        badge: "مكتمل",
        technologies: ["WooCommerce", "WordPress"]
    }
];

// Calculator Services Data
const calculatorServices = [
    { id: "logo", title: "تصميم شعار", description: "شعار احترافي (3 خيارات)", price: 200, icon: "fas fa-star" },
    { id: "social", title: "تصاميم سوشيال ميديا", description: "5 تصاميم للسوشيال ميديا", price: 50, icon: "fas fa-images" },
    { id: "identity", title: "هوية بصرية", description: "هوية متكاملة لمشروعك", price: 1000, icon: "fas fa-copyright" },
    { id: "biopage", title: "صفحة البايو", description: "صفحة لعرض روابطك", price: 200, icon: "fas fa-link" },
    { id: "landing", title: "صفحة لمشروعك", description: "صفحة تعريفية احترافية", price: 500, icon: "fas fa-pager" },
    { id: "store", title: "متجر إلكتروني", description: "متجر متكامل مع لوحة تحكم", price: 3000, icon: "fas fa-store" },
    { id: "webapp", title: "نظام ويب", description: "منصة أو نظام متكامل", price: 8000, icon: "fas fa-laptop-code" },
    { id: "mobile", title: "تطبيق جوال", description: "تطبيق iOS و Android", price: 15000, icon: "fas fa-mobile-alt" }
];

// Current selected services
let selectedServices = [];

// =========================================
// Initialize
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadCalculator();
    createAvatar();
});

// =========================================
// Dialog Functions
// =========================================
function openProjectsDialog() {
    document.getElementById('projectsDialog').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCalculatorDialog() {
    document.getElementById('calculatorDialog').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openExamplesDialog() {
    document.getElementById('examplesDialog').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDialog(dialogId) {
    document.getElementById(dialogId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close dialog on backdrop click
document.querySelectorAll('.dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog(dialog.id);
        }
    });
});

// =========================================
// Projects Functions
// =========================================
function loadProjects() {
    const grid = document.getElementById('projectsGrid');

    projectsData.forEach(project => {
        const projectCard = document.createElement('a');
        projectCard.href = project.link;
        projectCard.target = project.link.startsWith('http') ? '_blank' : '_self';
        projectCard.className = `project-card`;
        projectCard.dataset.category = project.category;

        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='https://via.placeholder.com/400x300/2d6ac8/ffffff?text=${encodeURIComponent(project.title)}'">
            <div class="project-info">
                <span class="project-badge">${project.badge}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        grid.appendChild(projectCard);
    });
}

function filterProjects(category) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter projects
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });
}

// =========================================
// Calculator Functions
// =========================================
function loadCalculator() {
    const container = document.getElementById('calculatorServices');

    calculatorServices.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'calc-service-item';
        serviceItem.dataset.id = service.id;
        serviceItem.dataset.price = service.price;

        serviceItem.innerHTML = `
            <div class="calc-checkbox">
                <i class="fas fa-check"></i>
            </div>
            <div class="calc-service-info">
                <div class="calc-service-title">${service.title}</div>
                <div class="calc-service-desc">${service.description}</div>
            </div>
            <div class="calc-service-price">${service.price} ر.س</div>
        `;

        serviceItem.addEventListener('click', () => toggleService(service.id, service.price, service.title));
        container.appendChild(serviceItem);
    });
}

function toggleService(id, price, title) {
    const serviceItem = document.querySelector(`[data-id="${id}"]`);
    serviceItem.classList.toggle('selected');

    const index = selectedServices.findIndex(s => s.id === id);
    if (index > -1) {
        selectedServices.splice(index, 1);
    } else {
        selectedServices.push({ id, price, title });
    }

    updateTotal();
}

function updateTotal() {
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    document.getElementById('totalPrice').textContent = `${total.toLocaleString()} ريال`;

    const orderBtn = document.querySelector('.btn-order');
    orderBtn.disabled = total === 0;
}

function sendOrder() {
    if (selectedServices.length === 0) {
        alert('الرجاء اختيار خدمة واحدة على الأقل');
        return;
    }

    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    let message = '🌟 *طلب جديد من حاسبة المشروع*\n\n';
    message += '*الخدمات المطلوبة:*\n';
    selectedServices.forEach((service, index) => {
        message += `${index + 1}. ${service.title} - ${service.price.toLocaleString()} ر.س\n`;
    });
    message += `\n*المجموع:* ${total.toLocaleString()} ريال\n\n`;
    message += 'أرغب في الاستفسار عن هذه الخدمات';

    const whatsappUrl = `https://wa.me/966XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// =========================================
// Avatar SVG
// =========================================
function createAvatar() {
    const svg = `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2d6ac8;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#5ca3e8;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <!-- Background Circle -->
            <circle cx="100" cy="100" r="95" fill="url(#grad1)" opacity="0.1"/>
            
            <!-- Main Shape -->
            <g transform="translate(100, 100)">
                <!-- Code Brackets -->
                <path d="M -40 -30 L -60 -10 L -60 10 L -40 30" 
                      stroke="url(#grad1)" 
                      stroke-width="6" 
                      fill="none" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
                
                <path d="M 40 -30 L 60 -10 L 60 10 L 40 30" 
                      stroke="url(#grad1)" 
                      stroke-width="6" 
                      fill="none" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
                
                <!-- Center Design Icon -->
                <circle cx="0" cy="-15" r="8" fill="#5ca3e8"/>
                <rect x="-15" y="0" width="30" height="5" rx="2" fill="#2d6ac8"/>
                <rect x="-20" y="10" width="40" height="5" rx="2" fill="#5ca3e8"/>
                <rect x="-10" y="20" width="20" height="5" rx="2" fill="#2d6ac8"/>
            </g>
            
            <!-- Text -->
            <text x="100" y="165" 
                  font-family="Cairo, sans-serif" 
                  font-size="20" 
                  font-weight="bold" 
                  text-anchor="middle" 
                  fill="url(#grad1)">R</text>
        </svg>
    `;

    document.getElementById('avatar').src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// =========================================
// Keyboard Shortcuts
// =========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.dialog.active').forEach(dialog => {
            closeDialog(dialog.id);
        });
    }
});
