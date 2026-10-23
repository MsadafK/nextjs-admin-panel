// services/productService.js
import { supabase } from '@/lib/supabase';

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Database row ne UI format ma map karo
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      category: row.categories?.name || 'Uncategorized',
      price: row.price,
      stock: row.stock_quantity,
      sold: 0, 
      status: row.status,
      sku: row.sku,
      image: '📦', 
      rating: 4.5,
      trend: '+0%'
    }));
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  }
};