// =========================================
// Projects Management and Filtering
// =========================================

const ProjectsApp = {
    allProjects: [],
    currentFilter: 'all',

    // Initialize
    async init() {
        await this.loadProjects();
        this.attachFilterListeners();
    },

    // Load Projects from JSON
    async loadProjects() {
        try {
            // تحميل المشاريع العادية من data/projects.json
            const response1 = await fetch('data/projects.json');
            const regularProjects = await response1.json();

            // تحميل المشاريع البرمجية من apps/dist/projects.json (المولدة من build.js)
            let programmingProjects = [];
            try {
                const response2 = await fetch('../apps/dist/projects.json');
                const buildProjects = await response2.json();
                // تحويل المشاريع البرمجية إلى الصيغة المتوافقة
                programmingProjects = buildProjects.map(proj => ({
                    id: proj.id,
                    title: proj.title,
                    description: proj.description,
                    category: 'apps',
                    categoryName: 'تطبيقات',
                    image: `../apps/dist/projects/${proj.id}/${proj.icon}`,
                    link: `../${proj.link}`,
                    badge: proj.status === 'available' ? 'متوفر' : 'قيد التطوير',
                    technologies: [],
                    isProgrammingProject: true // علامة للمشاريع البرمجية
                }));
            } catch (error) {
                // No programming projects found
            }

            // دمج جميع المشاريع
            this.allProjects = [...programmingProjects, ...regularProjects];
            this.renderProjects(this.allProjects);
        } catch (error) {
            this.showError();
        }
    },

    // Render Projects
    renderProjects(projects) {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <p class="text-muted">لا توجد مشاريع في هذا القسم حالياً</p>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => this.createProjectCard(project)).join('');

        // Animate cards
        this.animateCards();
    },

    // Create Project Card HTML
    createProjectCard(project) {
        return `
            <div class="col-lg-4 col-md-6 project-item" data-category="${project.category}">
                <div class="project-card">
                    <div class="project-image-wrapper">
                        <img src="${project.image}" 
                             alt="${project.title}" 
                             class="project-image"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%236366f1\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext fill=\\'%23ffffff\\' font-family=\\'Cairo, Arial\\' font-size=\\'20\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${encodeURIComponent(project.title)}%3C/text%3E%3C/svg%3E'">
                        ${project.badge ? `<span class="project-badge">${project.badge}</span>` : ''}
                    </div>
                    <div class="project-content">
                        <span class="project-category">${project.categoryName}</span>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        
                        ${this.renderProjectMeta(project)}
                        
                        <a href="${project.link}" class="project-link">
                            <span>عرض التفاصيل</span>
                            <i class="fas fa-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Project Meta Information
    renderProjectMeta(project) {
        const metaItems = [];

        // Add relevant metadata based on project type
        if (project.downloads) {
            metaItems.push(`<i class="fas fa-download"></i> ${project.downloads}`);
        }
        if (project.users) {
            metaItems.push(`<i class="fas fa-users"></i> ${project.users}`);
        }
        if (project.products) {
            metaItems.push(`<i class="fas fa-box"></i> ${project.products}`);
        }
        if (project.rating) {
            metaItems.push(`<i class="fas fa-star text-warning"></i> ${project.rating}`);
        }

        // Technologies
        if (project.technologies && project.technologies.length > 0) {
            const techBadges = project.technologies.slice(0, 3).map(tech =>
                `<span class="badge bg-secondary me-1">${tech}</span>`
            ).join('');
            metaItems.push(techBadges);
        }

        if (metaItems.length === 0) return '';

        return `
            <div class="project-meta mb-3">
                ${metaItems.join(' • ')}
            </div>
        `;
    },

    // Attach Filter Listeners
    attachFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterProjects(filter);

                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },

    // Filter Projects
    filterProjects(category) {
        this.currentFilter = category;

        if (category === 'all') {
            this.renderProjects(this.allProjects);
        } else {
            const filtered = this.allProjects.filter(p => p.category === category);
            this.renderProjects(filtered);
        }
    },

    // Animate Cards
    animateCards() {
        const cards = document.querySelectorAll('.project-item');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    // Show Error
    showError() {
        const container = document.getElementById('projectsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                    <p class="text-muted">حدث خطأ في تحميل المشاريع. يرجى المحاولة لاحقاً.</p>
                </div>
            `;
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ProjectsApp.init();
});

// Add project meta styles dynamically
const projectMetaStyles = `
<style>
.project-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.project-meta i {
    color: var(--primary-color);
}

.project-meta .badge {
    font-size: 0.75rem;
    padding: 4px 8px;
}
</style>
`;

// Inject styles if not already present
if (!document.getElementById('project-meta-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'project-meta-styles';
    styleElement.innerHTML = projectMetaStyles;
    document.head.appendChild(styleElement);
}

// Initialize Projects App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ProjectsApp.init();
});
