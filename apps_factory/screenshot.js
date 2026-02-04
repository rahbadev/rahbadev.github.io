// =========================================
// Screenshot Generator for Projects
// =========================================
// يولد صور تلقائية من صفحات HTML ويربطها في projects.json

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateScreenshot(htmlPath, outputPath, options = {}) {
    const {
        width = 1200,
        height = 800,
        fullPage = false,
        delay = 1000
    } = options;

    console.log(`📸 Generating screenshot for: ${htmlPath}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport
        await page.setViewport({ width, height });

        // Load the HTML file or URL
        let targetUrl;
        if (htmlPath.startsWith('http://') || htmlPath.startsWith('https://')) {
            // External URL
            targetUrl = htmlPath;
        } else {
            // Local file
            const filePath = path.resolve(htmlPath);
            targetUrl = `file://${filePath}`;
        }

        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for any animations/images to load
        await new Promise(resolve => setTimeout(resolve, delay));

        // Take screenshot in WebP format with compression
        await page.screenshot({
            path: outputPath,
            fullPage: fullPage,
            type: 'webp',
            quality: 85  // 85% quality - توازن بين الحجم والجودة
        });

        console.log(`✅ Screenshot saved: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error generating screenshot: ${error.message}`);
        return false;
    } finally {
        await browser.close();
    }
}

// Main function to generate all project screenshots
async function generateAllScreenshots() {
    console.log('🚀 Starting auto screenshot generation...\n');

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'assets', 'images', 'projects');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Created directory: ${outputDir}\n`);
    }

    // Read projects.json
    const projectsJsonPath = path.join(__dirname, 'data', 'projects.json');
    let projectsData = [];

    try {
        const jsonContent = fs.readFileSync(projectsJsonPath, 'utf8');
        projectsData = JSON.parse(jsonContent);
    } catch (error) {
        console.error('❌ Error reading projects.json:', error.message);
        return;
    }

    let updated = false;

    // Process each project
    for (const project of projectsData) {
        // Skip projects without link or with placeholder links
        if (!project.link || project.link === '#') {
            continue;
        }

        const isExternalUrl = project.link.startsWith('http://') || project.link.startsWith('https://');
        const isHtmlFile = project.link.endsWith('.html') || project.link.includes('.html');

        // Process if it's an external URL or local HTML file
        if (isExternalUrl || isHtmlFile) {
            const imageName = `${project.id}.webp`;
            const imagePath = `assets/images/projects/${imageName}`;
            const fullImagePath = path.join(outputDir, imageName);

            // Check if local HTML file exists
            if (!isExternalUrl && !fs.existsSync(project.link)) {
                console.log(`⚠️  HTML not found: ${project.link} - Skipping ${project.title}`);
                continue;
            }

            console.log(`\n🔄 Processing: ${project.title}`);
            console.log(`   URL: ${project.link}`);

            // Generate screenshot
            const success = await generateScreenshot(
                project.link,
                fullImagePath,
                { width: 1200, height: 800, delay: 3000 }
            );

            // Update image path in project
            if (success && project.image !== imagePath) {
                project.image = imagePath;
                updated = true;
                console.log(`✅ Updated image path in projects.json`);
            }
        }
    }

    // Save updated projects.json
    if (updated) {
        try {
            fs.writeFileSync(
                projectsJsonPath,
                JSON.stringify(projectsData, null, 4),
                'utf8'
            );
            console.log('\n💾 projects.json updated successfully!');
        } catch (error) {
            console.error('❌ Error saving projects.json:', error.message);
        }
    } else {
        console.log('\n✨ No updates needed - all screenshots up to date!');
    }

    console.log('\n✨ Done!');
}

// Run if called directly
if (require.main === module) {
    generateAllScreenshots().catch(console.error);
}

module.exports = { generateScreenshot, generateAllScreenshots };
