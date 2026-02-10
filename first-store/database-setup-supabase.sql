-- ============================================
-- Rehba Store Database Schema (Supabase)
-- ============================================

-- Drop table if exists
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('New', 'Used')),
    description TEXT,
    image VARCHAR(500) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_offer BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_products_is_offer ON products(is_offer);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON products
    FOR SELECT
    USING (true);

-- Create policy for authenticated insert/update/delete
-- (يمكنك تعديلها حسب احتياجاتك)
CREATE POLICY "Authenticated users can insert" ON products
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON products
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON products
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO products (name, brand, price, condition, description, image, is_available, is_offer, is_new) VALUES
('iPhone 14 Pro Max', 'Apple', 1099.00, 'New', 'أحدث إصدار من آيفون مع شاشة ProMotion وكاميرا 48 ميجابكسل', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', true, true, true),
('Samsung Galaxy S23 Ultra', 'Samsung', 949.00, 'New', 'هاتف سامسونج الرائد مع قلم S Pen وكاميرا 200 ميجابكسل', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', true, true, false),
('iPhone 13', 'Apple', 699.00, 'Used', 'آيفون 13 حالة ممتازة، بطارية 92%', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400', true, false, false),
('Xiaomi 13 Pro', 'Xiaomi', 749.00, 'New', 'هاتف شاومي الرائد مع تقنية Leica للكاميرا', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', true, false, true),
('iPhone 12 Pro', 'Apple', 599.00, 'Used', 'آيفون 12 برو، ذاكرة 256 جيجا، حالة ممتازة', 'https://images.unsplash.com/photo-1603891220228-7e8a8c1c1b0b?w=400', true, true, false),
('OnePlus 11', 'OnePlus', 599.00, 'New', 'هاتف ون بلس بمعالج Snapdragon 8 Gen 2', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', true, false, true);

-- Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (optional)
-- GRANT ALL ON products TO authenticated;
-- GRANT SELECT ON products TO anon;

-- ============================================
-- Notes:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Adjust RLS policies based on your security needs
-- 3. Update theme-config.js with your Supabase URL and anon key
-- ============================================
