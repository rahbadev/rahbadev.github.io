#!/usr/bin/env node

/**
 * Rehba Dev Website - Main Build Script
 * =====================================
 * يقوم بتشغيل:
 * 1. apps/build.js - تحديث صفحات المشاريع في أماكنها
 * 2. apps/screenshot.js - التقاط صور للشاشات (اختياري)
 * 3. إنشاء مجلد projects/ يحتوي صفحات عرض (landing pages) فقط
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Main Build Process...\n');

// Verify required files exist
const APPS_BUILD_SCRIPT = path.join(__dirname, 'apps', 'build.js');
if (!fs.existsSync(APPS_BUILD_SCRIPT)) {
    console.error('❌ apps/build.js not found!');
    console.error('Expected path:', APPS_BUILD_SCRIPT);
    process.exit(1);
}

// Step 1: Run apps/build.js to update projects in place
console.log('📦 Step 1: Updating project pages...');
try {
    execSync('node apps/build.js', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Project pages updated\n');
} catch (error) {
    console.error('❌ Error updating project pages:', error.message);
    console.error('Error details:', error);
    process.exit(1);
}

// Step 2: Optional - Run screenshot.js (only if needed)
// Uncomment if you want to auto-generate screenshots
// console.log('📸 Step 2: Generating screenshots...');
// try {
//     execSync('node apps/screenshot.js', { stdio: 'inherit' });
//     console.log('✅ Screenshots generated\n');
// } catch (error) {
//     console.warn('⚠️  Screenshot generation skipped or failed\n');
// }

// Step 3: Generate projects/ directory with landing pages
console.log('🏗️  Step 3: Generating projects landing pages...');
generateProjectsDirectory();

// Step 4: Generate designs.js from design folders
console.log('🎨 Step 4: Generating designs data...');
generateDesignsData();

console.log('\n✨ Build Complete!');

/**
 * إنشاء مجلد projects/ مع صفحات عرض بسيطة لكل مشروع
 */
function generateProjectsDirectory() {
    const PROJECTS_DIR = path.join(__dirname, 'projects');
    const APPS_DIR = path.join(__dirname, 'apps');
    const PROJECTS_JSON = path.join(__dirname, 'site', 'assets', 'data', 'projects.json');

    // Read projects.json
    if (!fs.existsSync(PROJECTS_JSON)) {
        console.warn('⚠️  projects.json not found, skipping projects generation');
        console.warn('Expected path:', PROJECTS_JSON);
        return;
    }

    let projects;
    try {
        projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, 'utf8'));
        console.log(`📄 Loaded ${projects.length} projects from projects.json`);
    } catch (error) {
        console.error('❌ Error reading projects.json:', error.message);
        return;
    }

    // Create projects/ directory
    if (!fs.existsSync(PROJECTS_DIR)) {
        fs.mkdirSync(PROJECTS_DIR, { recursive: true });
        console.log('📁 Created projects/ directory');
    }

    // Generate landing page for each project
    let successCount = 0;
    projects.forEach(project => {
        try {
            const projectDir = path.join(PROJECTS_DIR, project.id);
            if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
            }

            // Create simple landing page that redirects to apps/{project}/
            const landingPage = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <meta http-equiv="refresh" content="0; url=../../apps/${project.id}/">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        a {
            color: white;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${project.title}</h1>
        <p>جاري التحويل...</p>
        <div class="spinner"></div>
        <p style="font-size: 0.9rem;">
            إذا لم يتم التحويل تلقائياً، 
            <a href="../../apps/${project.id}/">انقر هنا</a>
        </p>
    </div>
    <script>
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = '../../apps/${project.id}/';
        }, 100);
    </script>
</body>
</html>`;

            fs.writeFileSync(path.join(projectDir, 'index.html'), landingPage);
            console.log(`   ✅ Generated landing page: projects/${project.id}/`);
            successCount++;
        } catch (error) {
            console.error(`   ❌ Failed to generate landing page for ${project.id}:`, error.message);
        }
    });

    console.log(`\n📁 Successfully created ${successCount}/${projects.length} landing pages in projects/`);

    if (successCount === 0) {
        console.error('❌ No landing pages were created!');
        process.exit(1);
    }
}

/**
 * قراءة ملفات التصميم من المجلدات وتوليد designs.js
 */
function generateDesignsData() {
    const DESIGN_DIR = path.join(__dirname, 'projects', 'design');
    const DESIGNS_JS = path.join(DESIGN_DIR, 'designs.js');

    if (!fs.existsSync(DESIGN_DIR)) {
        console.warn('⚠️  projects/design/ not found, skipping designs generation');
        return;
    }

    const folders = [
        { name: 'logo', cat: 'logo' },
        { name: 'busniss-cards', cat: 'card' },
        { name: 'ads', cat: 'ad' },
        { name: 'mockups', cat: 'mockup' }
    ];

    const designs = [];

    folders.forEach(({ name, cat }) => {
        const folderPath = path.join(DESIGN_DIR, name);
        if (!fs.existsSync(folderPath)) return;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));

        files.forEach(file => {
            const title = path.basename(file, '.webp')
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());

            designs.push({
                img: `${name}/${file}`,
                title: title,
                cat: cat
            });
        });
    });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const jsContent = `// Auto-generated: ${timestamp}
const designs = [
${designs.map(d => `    { img: '${d.img}', title: '${d.title}', cat: '${d.cat}' }`).join(',\n')}
];
`;

    fs.writeFileSync(DESIGNS_JS, jsContent, 'utf8');
    console.log(`   ✅ Generated designs.js with ${designs.length} designs`);

    if (designs.length === 0) {
        console.warn('   ⚠️  No webp files found in design folders');
    }
}
