// =========================================
// Data Loader - Centralized Data Management
// =========================================

class DataLoader {
    constructor(basePath = '../shared_core/data') {
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
    async getServicesSummary() {
        return await this.loadJSON('services-summary.json');
    }

    // Load projects (from main_site)
    async getProjects() {
        try {
            const response = await fetch('../main_site/data/projects.json');
            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    // Load full services (from main_site)
    async getFullServices() {
        try {
            const response = await fetch('../main_site/data/services.json');
            if (!response.ok) {
                throw new Error(`Failed to load services: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading services:', error);
            return null;
        }
    }

    // Load calculator services (from main_site)
    async getCalculatorServices() {
        try {
            const response = await fetch('../main_site/data/calculator-services.json');
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

    // Helper: Get services for bio (simplified)
    async getServicesForBio() {
        const data = await this.getServicesSummary();
        return data ? data.services : [];
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
