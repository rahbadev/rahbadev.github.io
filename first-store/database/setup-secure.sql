-- ============================================
-- SECURE DATABASE SETUP FOR PRODUCTION
-- E-commerce Storefront Template
-- ============================================
-- 
-- SECURITY FEATURES:
-- ✅ Row Level Security (RLS) enabled
-- ✅ Public read-only access
-- ✅ Admin write access via service role only
-- ✅ Input validation via constraints
-- ✅ Indexed for performance
--
-- IMPORTANT: This makes the storefront READ-ONLY for customers
-- Admin operations must use Supabase service role key (server-side only)
-- ============================================

-- Drop existing table if needed
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with strict constraints
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Info (REQUIRED)
    name VARCHAR(255) NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 255),
    brand VARCHAR(100) NOT NULL CHECK (char_length(brand) >= 1 AND char_length(brand) <= 100),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0 AND price <= 999999.99),
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('New', 'Used')),
    
    -- Description (OPTIONAL but validated)
    description TEXT CHECK (char_length(description) <= 2000),
    
    -- Image URL (REQUIRED, must be valid URL format)
    image VARCHAR(500) NOT NULL CHECK (image ~* '^https?://'),
    
    -- Status flags
    is_available BOOLEAN DEFAULT true NOT NULL,
    is_offer BOOLEAN DEFAULT false NOT NULL,
    is_new BOOLEAN DEFAULT false NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Additional validation: at least one flag must explain why product is special
    CONSTRAINT valid_product CHECK (
        is_available IS NOT NULL 
        AND (NOT is_offer OR price > 0)  -- Offers must have valid price
    )
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_products_available ON products(is_available) WHERE is_available = true;
CREATE INDEX idx_products_offers ON products(is_offer, is_available) WHERE is_offer = true AND is_available = true;
CREATE INDEX idx_products_new ON products(is_new, is_available) WHERE is_new = true AND is_available = true;
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(description, '')));

-- ============================================
-- ROW LEVEL SECURITY (RLS) - CRITICAL
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICY 1: Public READ access (customers can view products)
-- ============================================
CREATE POLICY "public_read_available_products" 
ON products
FOR SELECT
USING (
    is_available = true  -- Only show available products to public
);

-- ============================================
-- POLICY 2: Admin INSERT (service role only)
-- ============================================
CREATE POLICY "admin_insert_products" 
ON products
FOR INSERT
WITH CHECK (
    auth.role() = 'service_role'  -- Only service role can insert
);

-- ============================================
-- POLICY 3: Admin UPDATE (service role only)
-- ============================================
CREATE POLICY "admin_update_products" 
ON products
FOR UPDATE
USING (
    auth.role() = 'service_role'  -- Only service role can update
)
WITH CHECK (
    auth.role() = 'service_role'
);

-- ============================================
-- POLICY 4: Admin DELETE (service role only)
-- ============================================
CREATE POLICY "admin_delete_products" 
ON products
FOR DELETE
USING (
    auth.role() = 'service_role'  -- Only service role can delete
);

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing - remove in production)
-- ============================================
INSERT INTO products (name, brand, price, condition, description, image, is_available, is_offer, is_new) VALUES
('iPhone 15 Pro Max', 'Apple', 4999.00, 'New', 'أحدث إصدار من آيفون مع شاشة 6.7 بوصة', 'https://via.placeholder.com/400', true, true, true),
('Galaxy S24 Ultra', 'Samsung', 4499.00, 'New', 'هاتف سامسونج الرائد بكاميرا 200 ميجابكسل', 'https://via.placeholder.com/400', true, false, true),
('iPhone 13 Pro', 'Apple', 2999.00, 'Used', 'مستعمل بحالة ممتازة مع ضمان 6 أشهر', 'https://via.placeholder.com/400', true, true, false);

-- ============================================
-- VERIFICATION QUERIES (run these to test)
-- ============================================

-- Test 1: Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';
-- Expected: rowsecurity = true

-- Test 2: Check policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'products';
-- Expected: 4 policies (read, insert, update, delete)

-- Test 3: Test public read (should only see available products)
-- SET ROLE anon;
-- SELECT * FROM products;
-- RESET ROLE;

-- ============================================
-- IMPORTANT NOTES FOR DEVELOPERS:
-- ============================================
-- 
-- 1. **Anon Key (Public)**: 
--    - Can ONLY read available products
--    - Use this in the storefront (index.html)
--    - Safe to expose in client-side code
--
-- 2. **Service Role Key (Private)**:
--    - Has FULL access (insert, update, delete)
--    - NEVER expose in client-side code
--    - Use only in admin panel (server-side or protected)
--
-- 3. **Admin Panel**:
--    - Should be password-protected
--    - Should use separate Supabase client with service role key
--    - Or implement proper Supabase Auth with admin role
--
-- 4. **Production Checklist**:
--    - ✅ Remove sample data
--    - ✅ Verify RLS policies
--    - ✅ Never commit service role key to git
--    - ✅ Use environment variables for keys
--    - ✅ Add rate limiting (via Supabase settings)
--    - ✅ Monitor database usage
--
-- ============================================

COMMIT;
