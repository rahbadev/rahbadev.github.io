/**
 * ============================================
 * STORE CONFIGURATION FILE
 * ============================================
 * 
 * ⚠️ FOR NON-TECHNICAL USERS ⚠️
 * This is the ONLY file you need to edit to customize your store.
 * DO NOT modify any files in the /src folder.
 * 
 * WHAT YOU CAN CHANGE:
 * ✅ Store name and description
 * ✅ Contact information (phone, email, address)
 * ✅ Colors and fonts
 * ✅ Layout styles (choose from predefined options)
 * ✅ WhatsApp message templates
 * 
 * WHAT YOU SHOULD NOT CHANGE:
 * ❌ Database connection settings (unless instructed)
 * ❌ Anything in the /src folder
 * ❌ HTML structure in index.html
 * 
 * ============================================
 */

const StoreConfig = {
    // ============================================
    // SECTION 1: BASIC STORE INFORMATION
    // ============================================
    store: {
        name: 'متجر الهواتف الذكية',
        tagline: 'أفضل الأجهزة بأفضل الأسعار',
        description: 'أفضل الأجهزة الجديدة والمستعملة بضمان وأسعار تنافسية',
        logo: 'ri-smartphone-line', // Icon from Remix Icons OR image URL

        // Currency settings
        currency: {
            symbol: 'ر.س',
            position: 'after', // 'before' or 'after'
            locale: 'ar-SA'
        }
    },

    // ============================================
    // SECTION 2: CONTACT INFORMATION
    // ============================================
    contact: {
        // WhatsApp number (IMPORTANT: Remove + and spaces)
        // Example: For +966 50 000 0000, write: 966500000000
        whatsapp: '966500000000',

        // Display format (shown to customers)
        displayPhone: '+966 50 000 0000',

        // Other contact info
        email: 'info@store.com',
        address: 'الرياض، المملكة العربية السعودية',
        workingHours: 'السبت - الخميس: 9 صباحاً - 9 مساءً',

        // Social media (leave empty if you don't have)
        social: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            tiktok: '',
            snapchat: ''
        },

        // Google Maps link (optional)
        mapUrl: ''
    },

    // ============================================
    // SECTION 3: WHATSAPP MESSAGE TEMPLATES
    // ============================================
    // Customize the automatic messages sent via WhatsApp
    // Available variables: {productName}, {brand}, {price}, {condition}
    whatsapp: {
        // Message when customer clicks "Order via WhatsApp" on a product
        orderMessage: 'مرحباً، أنا مهتم بـ {brand} {productName} ({condition}) بسعر {price}',

        // Message for general inquiry
        inquiryMessage: 'مرحباً، لدي استفسار عن متجركم',

        // Message for cart checkout (when multiple products)
        cartMessage: 'مرحباً، أريد طلب المنتجات التالية:\n\n{cartItems}\n\nالإجمالي: {total}'
    },

    // ============================================
    // SECTION 4: DESIGN & LAYOUT
    // ============================================
    theme: {
        // Colors (use hex codes like #3b82f6 or color names)
        colors: {
            primary: '#3b82f6',      // Main color (buttons, links)
            secondary: '#8b5cf6',    // Secondary accent
            success: '#10B981',      // Success messages
            warning: '#F59E0B',      // Warnings
            error: '#EF4444',        // Errors
            text: '#1F2937',         // Main text color
            background: '#FFFFFF'    // Page background
        },

        // Fonts
        fonts: {
            main: 'Tajawal',         // Main font family
            secondary: 'Cairo'       // Secondary font
        }
    },

    // ============================================
    // SECTION 5: LAYOUT STYLES (Choose from options)
    // ============================================
    layouts: {
        // PRODUCT CARD LAYOUT
        // Options: 'modern', 'classic', 'minimal', 'detailed', 'compact'
        productCard: 'modern',

        // PRODUCT DETAILS LAYOUT (when clicked)
        // Options: 'modal', 'fullscreen', 'sidebar', 'inline', 'overlay'
        productDetails: 'modal',

        // CATEGORY FILTER LAYOUT
        // Options: 'tabs', 'buttons', 'dropdown', 'sidebar', 'chips'
        categoryFilter: 'tabs',

        // SEARCH BAR STYLE
        // Options: 'embedded', 'floating', 'prominent', 'minimal', 'header'
        searchBar: 'embedded',

        // IMAGE GALLERY STYLE (for product with multiple images)
        // Options: 'slider', 'grid', 'thumbnails', 'carousel', 'lightbox'
        imageGallery: 'slider'
    },

    // ============================================
    // SECTION 6: FEATURES (Enable/Disable)
    // ============================================
    features: {
        showCart: true,                    // Show shopping cart feature
        enableSearch: true,                // Show search bar
        enableFilters: true,               // Show category/brand filters
        showPriceInCard: true,             // Display price on product cards
        showConditionBadge: true,          // Show "New" or "Used" badge
        showOfferBadge: true,              // Show "Offer" badge
        enableSortBy: true,                // Enable "Sort by" dropdown
        showProductCount: true,            // Show "Showing X products"
        lazyLoadImages: true,              // Lazy load images for performance
        enableShareProduct: true,          // Allow sharing products
        showBrandFilter: true              // Show brand filter
    },

    // ============================================
    // SECTION 7: DATABASE CONNECTION
    // ⚠️ WARNING: Only change if instructed by developer
    // ============================================
    database: {
        // Supabase project URL
        url: 'https://prkvgvvshqenwvsibvct.supabase.co',

        // Public anon key (safe to expose - read-only access)
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3ZndnZzaHFlbnd2c2lidmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzI0NTcsImV4cCI6MjA4NjIwODQ1N30.DQbj1AxwPt7CpddX--izQpS2MdpPFoMq7Toxig8PPmg',

        // Table name
        table: 'products'
    },

    // ============================================
    // SECTION 8: IMAGE STORAGE (Cloudinary)
    // ⚠️ WARNING: Only change if you have your own Cloudinary account
    // ============================================
    images: {
        cloudName: 'dyokwginp',
        uploadPreset: 'first-store',

        // Image optimization settings
        quality: 75,                       // Image quality (0-100)
        format: 'webp',                    // Modern format for smaller size
        maxWidth: 1200,                    // Maximum image width
        maxHeight: 1200                    // Maximum image height
    },

    // ============================================
    // SECTION 9: BUSINESS SETTINGS
    // ============================================
    business: {
        // Pagination (products per page)
        productsPerPage: 12,

        // Featured products (max to show)
        featuredProductsCount: 6,

        // New arrivals (max to show)
        newArrivalsCount: 6,

        // Show "Out of Stock" products?
        showOutOfStock: false,

        // Default sort order
        // Options: 'newest', 'oldest', 'price-low', 'price-high', 'name-az', 'name-za'
        defaultSort: 'newest'
    },

    // ============================================
    // SECTION 10: SEO & META (for better Google ranking)
    // ============================================
    seo: {
        title: 'متجر الهواتف الذكية - أفضل الأسعار',
        description: 'متجر إلكتروني متخصص في بيع الهواتف الذكية الجديدة والمستعملة بضمان وأسعار تنافسية',
        keywords: 'هواتف، آيفون، سامسونج، متجر، شراء هاتف',
        author: 'متجر الهواتف الذكية',
        image: '' // OpenGraph image URL (optional)
    }
};

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

// Make config globally available
if (typeof window !== 'undefined') {
    window.StoreConfig = StoreConfig;
}

// Export for admin panel (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreConfig;
}
