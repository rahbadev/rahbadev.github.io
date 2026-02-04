// =========================================
// Data Loader - Centralized Data Management
// =========================================

class DataLoader {
    constructor(basePath = '../shared/data') {
        this.basePath = basePath;
        this.cache = {};
    }

    // Load JSON data with caching
    async loadJSON(filename) {
        // Return cached data if available
        if (this.cache[filename]) {
            return this.cache[filename];
        }

        try {
            const response = await fetch(`${this.basePath}/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.statusText}`);
            }
            const data = await response.json();
            this.cache[filename] = data;
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    // Load company info
    async getCompanyInfo() {
        return await this.loadJSON('company-info.json');
    }

    // Load services summary
    // @deprecated - استخدم getServicesForBio() بدلاً منه
    // يتم الاحتفاظ به للتوافق مع الأكواد القديمة
    async getServicesSummary() {
        return await this.getServicesForBio();
    }

    // Load projects (from site)
    async getProjects() {
        try {
            const response = await fetch('../site/data/projects.json');
            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    // Load full services (from site)
    async getFullServices() {
        try {
            const response = await fetch('../site/data/services.json');
            if (!response.ok) {
                throw new Error(`Failed to load services: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading services:', error);
            return null;
        }
    }

    // Load calculator services (from site)
    async getCalculatorServices() {
        try {
            const response = await fetch('../site/data/calculator-services.json');
            if (!response.ok) {
                throw new Error(`Failed to load calculator services: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading calculator services:', error);
            return null;
        }
    }

    // Helper: Get limited items for bio (summary view)
    async getProjectsSummary(limit = 6) {
        const projects = await this.getProjects();
        return projects ? projects.slice(0, limit) : [];
    }

    // Helper: Filter projects by category
    async getProjectsByCategory(category) {
        const projects = await this.getProjects();
        if (!projects) return [];

        if (category === 'all') return projects;
        return projects.filter(p => p.category === category);
    }

    // Helper: Get project by ID
    async getProjectById(id) {
        const projects = await this.getProjects();
        if (!projects) return null;
        return projects.find(p => p.id === id);
    }

    // Helper: Get services for bio (simplified)
    // استخراج تلقائي من services.json بدلاً من ملف منفصل
    async getServicesForBio() {
        const fullServices = await this.getFullServices();
        if (!fullServices || !fullServices.categories) return [];

        // استخراج ملخص من البيانات الكاملة
        return fullServices.categories.map(category => ({
            id: category.id,
            title: category.title,
            titleShort: category.title,
            icon: category.icon,
            description: category.description,
            descriptionLong: category.description,
            color: category.color,
            examples: category.services ? category.services.slice(0, 4).map(s => s.title) : []
        }));
    }

    // Helper: Get service by ID
    async getServiceById(serviceId) {
        const fullServices = await this.getFullServices();
        if (!fullServices || !fullServices.categories) return null;

        for (const category of fullServices.categories) {
            const service = category.services.find(s =>
                s.title === serviceId || s.id === serviceId
            );
            if (service) {
                return {
                    ...service,
                    category: category.title,
                    categoryId: category.id,
                    categoryColor: category.color
                };
            }
        }
        return null;
    }

    // Helper: Get services by category
    async getServicesByCategory(categoryId) {
        const fullServices = await this.getFullServices();
        if (!fullServices || !fullServices.categories) return [];

        const category = fullServices.categories.find(c => c.id === categoryId);
        return category ? category.services : [];
    }

    // Clear cache
    clearCache() {
        this.cache = {};
    }

    // Reload specific file
    async reload(filename) {
        delete this.cache[filename];
        return await this.loadJSON(filename);
    }
}

// Export for use in other scripts
window.DataLoader = DataLoader;
