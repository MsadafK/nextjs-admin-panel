-- ============================================================
-- PORTFOLIO ADMIN PANEL - DATABASE SCHEMA
-- Platform: Supabase (PostgreSQL)
-- ============================================================

-- ============================================================
-- 1. USERS TABLE (Authentication + Profile)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  phone VARCHAR(20),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 2. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 3. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  image_url VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES public.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 4. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'shipped')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 5. API_KEYS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(500) NOT NULL,
  prefix VARCHAR(20),
  scope VARCHAR(50) CHECK (scope IN ('read', 'write', 'full')),
  environment VARCHAR(50) CHECK (environment IN ('development', 'staging', 'production')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  last_used TIMESTAMP,
  is_revoked BOOLEAN DEFAULT FALSE,
  rate_limit INT DEFAULT 1000,
  rate_limit_period VARCHAR(20) DEFAULT 'hour'
);

-- ============================================================
-- 6. AUDIT_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50) CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

-- ============================================================
-- 8. FILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INT,
  file_type VARCHAR(50),
  uploaded_by UUID REFERENCES public.users(id),
  resource_type VARCHAR(50),
  resource_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 9. ANALYTICS_DATA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15, 2),
  dimension_1 VARCHAR(100),
  dimension_2 VARCHAR(100),
  dimension_3 VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. USER_PERMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  permission_name VARCHAR(100),
  resource_type VARCHAR(50),
  access_level VARCHAR(20) CHECK (access_level IN ('view', 'create', 'edit', 'delete', 'admin')),
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, permission_name, resource_type)
);

-- ============================================================
-- 11. EVENTS TABLE (for calendar)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  created_by UUID REFERENCES public.users(id),
  event_type VARCHAR(50),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(100),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES - Performance Optimization
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_data(created_at);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Sample Users
INSERT INTO public.users (id, email, full_name, role, status, department) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'John Doe', 'admin', 'active', 'Management'),
('22222222-2222-2222-2222-222222222222', 'manager@example.com', 'Sarah Smith', 'manager', 'active', 'Sales'),
('33333333-3333-3333-3333-333333333333', 'user1@example.com', 'Mike Johnson', 'user', 'active', 'Marketing'),
('44444444-4444-4444-4444-444444444444', 'user2@example.com', 'Emily Brown', 'user', 'active', 'Support')
ON CONFLICT DO NOTHING;

-- Sample Categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Electronics', 'Electronic devices and gadgets', '📱', 'blue'),
('Clothing', 'Apparel and fashion items', '👕', 'purple'),
('Books', 'Educational and entertainment books', '📚', 'green'),
('Home & Garden', 'Home and garden products', '🏠', 'orange'),
('Sports', 'Sports and fitness equipment', '⚽', 'red')
ON CONFLICT DO NOTHING;

-- Sample Products
INSERT INTO public.products (name, description, category_id, price, stock_quantity, sku, status, created_by) VALUES
('Laptop Pro', 'High-performance laptop', (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1), 999.99, 50, 'LAPTOP-001', 'active', '11111111-1111-1111-1111-111111111111'),
('USB-C Cable', 'Fast charging USB-C cable', (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1), 19.99, 200, 'CABLE-001', 'active', '11111111-1111-1111-1111-111111111111'),
('Cotton T-Shirt', 'Comfortable cotton t-shirt', (SELECT id FROM public.categories WHERE name = 'Clothing' LIMIT 1), 29.99, 150, 'TSHIRT-001', 'active', '11111111-1111-1111-1111-111111111111'),
('Programming Book', 'Learn Web Development', (SELECT id FROM public.categories WHERE name = 'Books' LIMIT 1), 49.99, 80, 'BOOK-001', 'active', '11111111-1111-1111-1111-111111111111'),
('Yoga Mat', 'Premium yoga mat', (SELECT id FROM public.categories WHERE name = 'Sports' LIMIT 1), 39.99, 120, 'MAT-001', 'active', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (sku) DO NOTHING;

-- Sample Orders
INSERT INTO public.orders (order_number, user_id, product_id, quantity, unit_price, total_amount, status) VALUES
('ORD-001', '22222222-2222-2222-2222-222222222222', (SELECT id FROM public.products WHERE sku = 'LAPTOP-001' LIMIT 1), 1, 999.99, 999.99, 'completed'),
('ORD-002', '33333333-3333-3333-3333-333333333333', (SELECT id FROM public.products WHERE sku = 'TSHIRT-001' LIMIT 1), 2, 29.99, 59.98, 'processing'),
('ORD-003', '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.products WHERE sku = 'MAT-001' LIMIT 1), 1, 39.99, 39.99, 'pending')
ON CONFLICT (order_number) DO NOTHING;

-- Sample Analytics Data
INSERT INTO public.analytics_data (metric_name, metric_value, dimension_1, dimension_2) VALUES
('Total Revenue', 1099.96, 'Today', 'All Products'),
('Total Orders', 3, 'Today', 'All Products'),
('Total Users', 4, 'Active', 'All Roles'),
('Conversion Rate', 3.24, 'Today', 'Percentage');

-- Sample Permissions
INSERT INTO public.user_permissions (user_id, permission_name, resource_type, access_level) VALUES
('11111111-1111-1111-1111-111111111111', 'manage_users', 'users', 'admin'),
('11111111-1111-1111-1111-111111111111', 'manage_products', 'products', 'admin'),
('22222222-2222-2222-2222-222222222222', 'view_analytics', 'analytics', 'view'),
('22222222-2222-2222-2222-222222222222', 'manage_orders', 'orders', 'edit')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Users can view all users (non-deleted)
CREATE POLICY "Users can view all users" ON public.users
FOR SELECT USING (is_deleted = FALSE);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid()::text = id::text);

-- Only admins can delete users
CREATE POLICY "Only admins can delete users" ON public.users
FOR UPDATE USING (
  (SELECT role FROM public.users WHERE id = auth.uid()::uuid) = 'admin'
);

-- Products can be viewed by all
CREATE POLICY "Everyone can view active products" ON public.products
FOR SELECT USING (is_deleted = FALSE AND status = 'active');

-- Users can only view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (user_id = auth.uid()::uuid);

-- All authenticated users can view notifications for themselves
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid()::uuid);

-- ============================================================
-- VIEWS (Optional - for common queries)
-- ============================================================

-- View: Active Users
CREATE OR REPLACE VIEW public.v_active_users AS
SELECT 
  id,
  email,
  full_name,
  role,
  department,
  last_login,
  created_at
FROM public.users
WHERE is_deleted = FALSE AND status = 'active'
ORDER BY created_at DESC;

-- View: Monthly Revenue
CREATE OR REPLACE VIEW public.v_monthly_revenue AS
SELECT 
  DATE_TRUNC('month', created_at)::DATE as month,
  SUM(total_amount) as revenue,
  COUNT(*) as order_count
FROM public.orders
WHERE is_deleted = FALSE AND status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- View: Product Performance
CREATE OR REPLACE VIEW public.v_product_performance AS
SELECT 
  p.id,
  p.name,
  p.sku,
  COUNT(o.id) as total_orders,
  SUM(o.quantity) as total_quantity_sold,
  SUM(o.total_amount) as total_revenue,
  p.stock_quantity,
  p.price
FROM public.products p
LEFT JOIN public.orders o ON p.id = o.product_id AND o.is_deleted = FALSE
WHERE p.is_deleted = FALSE
GROUP BY p.id
ORDER BY total_revenue DESC;

-- ============================================================
-- TRIGGERS (Optional - for auto-update timestamps)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- FUNCTIONS (Optional - for common operations)
-- ============================================================

-- Function: Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = user_id AND is_deleted = FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function: Get order summary
CREATE OR REPLACE FUNCTION public.get_order_summary()
RETURNS TABLE(total_orders BIGINT, total_revenue NUMERIC, completed_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*),
    SUM(total_amount),
    COUNT(*) FILTER (WHERE status = 'completed')
  FROM public.orders
  WHERE is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMMENTS (for documentation)
-- ============================================================
COMMENT ON TABLE public.users IS 'Stores user account information and profiles';
COMMENT ON TABLE public.products IS 'Stores product catalog information';
COMMENT ON TABLE public.orders IS 'Stores customer orders';
COMMENT ON TABLE public.audit_logs IS 'Stores system audit and activity logs';
COMMENT ON TABLE public.api_keys IS 'Stores API keys for external integrations';
COMMENT ON COLUMN public.users.role IS 'User role: admin, manager, or user';
COMMENT ON COLUMN public.products.status IS 'Product status: active, inactive, or discontinued';
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, processing, completed, cancelled, or shipped';

-- ============================================================
-- SCRIPT COMPLETE
-- ============================================================
-- Run this script in Supabase SQL Editor to create all tables,
-- indexes, policies, views, and sample data.
--
-- After running:
-- 1. Enable real-time for required tables (optional)
-- 2. Test authentication
-- 3. Test data retrieval
-- 4. Add more sample data as needed
-- ============================================================
