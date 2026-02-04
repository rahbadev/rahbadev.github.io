// Main Site JavaScript

// Load and display projects
async function loadProjects() {
    try {
        const response = await fetch('../main_site/data/projects.json');
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML =
            '<p class="error">فشل تحميل المشاريع</p>';
    }
}

// Display projects in grid
function displayProjects(projects) {
    const grid = document.getElementById('projects-grid');

    if (!grid) return;

    grid.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-image">
                <img src="../${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.link && project.link !== '#'
            ? `<a href="../${project.link}" class="btn-primary" target="_blank">عرض المشروع</a>`
            : '<span class="btn-disabled">قريباً</span>'}
                    ${project.github
            ? `<a href="${project.github}" class="btn-secondary" target="_blank">GitHub</a>`
            : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Load projects on page load
if (document.getElementById('projects-grid')) {
    loadProjects();
}
