// services/productService.js
import { supabase } from '@/lib/supabase';

const getCategoryIcon = (categoryName = '', productName = '') => {
  const name = productName.toLowerCase();
  const cat = categoryName.toLowerCase();

  if (name.includes('laptop')) return '💻';
  if (name.includes('cable') || name.includes('usb')) return '🔌';
  if (name.includes('watch')) return '⌚';
  if (name.includes('headphone') || name.includes('speaker')) return '🎧';
  if (cat.includes('electronic')) return '📱';
  if (cat.includes('cloth') || cat.includes('fashion') || name.includes('shirt')) return '👕';
  if (cat.includes('book')) return '📚';
  if (cat.includes('home') || cat.includes('furniture')) return '🪑';
  if (cat.includes('sport')) return '🧘';
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
    sold: Number(row.sold_count ?? 0),
    status,
    sku: row.sku || 'N/A',
    image: getCategoryIcon(categoryName, row.name),
    rating: 4.5,
    trend: stock > 0 ? '+12%' : 'Out of stock',
  };
};

export const productService = {
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

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
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

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};