// services/productService.js
import { supabase } from '@/lib/supabase';

const getCategoryIcon = (categoryName = '', productName = '') => {
  const name = (productName || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  if (name.includes('laptop')) return '💻';
  if (name.includes('cable') || name.includes('usb')) return '🔌';
  if (name.includes('watch')) return '⌚';
  if (name.includes('headphone') || name.includes('speaker')) return '🎧';
  if (cat.includes('electronic')) return '📱';
  if (cat.includes('cloth') || cat.includes('fashion') || name.includes('shirt')) return '👕';
  if (cat.includes('book')) return '📚';
  if (cat.includes('home') || cat.includes('furniture')) return '🪑';
  if (cat.includes('sport') || name.includes('yoga')) return '🧘';
  return '📦';
};

const mapProductFromDB = (row) => {
  const categoryName = row.categories?.name || 'Uncategorized';
  const stock = Number(row.stock_quantity ?? 0);
  const rawStatus = (row.status || 'active').toLowerCase();
  const status = stock === 0 && rawStatus === 'active' ? 'out-of-stock' : rawStatus;

  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    category_id: row.category_id || '',
    category: categoryName,
    price: Number(row.price ?? 0),
    stock,
    minStock: Number(row.min_stock_level ?? 10),
    sold: Number(row.sold_count ?? 0),
    status,
    sku: row.sku || 'N/A',
    image: getCategoryIcon(categoryName, row.name),
    rating: 4.5,
    trend: stock > 0 ? '+12%' : 'Out of stock',
    updatedAt: row.updated_at || row.created_at,
  };
};

export const productService = {
  /* ── Products CRUD ── */
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories ( id, name )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapProductFromDB);
  },

  async createProduct(productData) {
    const stock = Number(productData.stock ?? 0);
    const payload = {
      name: productData.name,
      sku: productData.sku,
      description: productData.description || '',
      category_id: productData.category_id || null,
      price: Number(productData.price ?? 0),
      stock_quantity: stock,
      status: stock === 0 ? 'out-of-stock' : (productData.status || 'active'),
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select(`
        *,
        categories ( id, name )
      `)
      .single();

    if (error) throw error;
    return mapProductFromDB(data);
  },

  async updateProduct(id, updates) {
    const stock = Number(updates.stock ?? 0);
    const payload = {
      name: updates.name,
      sku: updates.sku,
      description: updates.description || '',
      category_id: updates.category_id || null,
      price: Number(updates.price ?? 0),
      stock_quantity: stock,
      status: updates.status || (stock === 0 ? 'out-of-stock' : 'active'),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select(`
        *,
        categories ( id, name )
      `)
      .single();

    if (error) throw error;
    return mapProductFromDB(data);
  },

  async updateStock(id, newStockQuantity) {
    const stock = Math.max(0, Number(newStockQuantity ?? 0));
    const payload = {
      stock_quantity: stock,
      status: stock === 0 ? 'out-of-stock' : 'active',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select(`
        *,
        categories ( id, name )
      `)
      .single();

    if (error) throw error;
    return mapProductFromDB(data);
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /* ── Categories CRUD ── */
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createCategory(catData) {
    const { data: sample } = await supabase.from('categories').select('*').limit(1);
    const cols = sample && sample[0] ? Object.keys(sample[0]) : null;

    const slug =
      catData.slug ||
      catData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    const payload = { name: catData.name.trim() };

    if (cols) {
      if (cols.includes('description')) payload.description = catData.description || '';
      if (cols.includes('slug')) payload.slug = slug;
      if (cols.includes('status')) payload.status = (catData.status || 'active').toLowerCase();
      if (cols.includes('is_active')) payload.is_active = (catData.status || 'active').toLowerCase() === 'active';
    } else {
      payload.description = catData.description || '';
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id, updates) {
    const { data: sample } = await supabase.from('categories').select('*').limit(1);
    const cols = sample && sample[0] ? Object.keys(sample[0]) : null;

    const payload = { name: updates.name?.trim() };
    if (cols) {
      if (cols.includes('description') && updates.description !== undefined) {
        payload.description = updates.description;
      }
      if (cols.includes('slug') && updates.slug) {
        payload.slug = updates.slug;
      }
      if (cols.includes('status') && updates.status) {
        payload.status = updates.status.toLowerCase();
      }
      if (cols.includes('updated_at')) {
        payload.updated_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};