// hooks/useProducts.js
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService, getCategoryIcon } from '@/services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [prodsData, catsData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);

      setProducts(prodsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Error fetching products/categories:', err);
      setError(err.message || 'Failed to load data from Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enrich categories with live product counts, stock units, and inventory revenue
  // Enrich categories with live product counts, stock units, and inventory revenue
  const categoriesWithStats = useMemo(() => {
    return categories.map((cat, index) => {
      const catProducts = products.filter(
        (p) => p.category_id === cat.id || p.category?.toLowerCase() === cat.name?.toLowerCase()
      );
      const totalStock = catProducts.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
      const totalValue = catProducts.reduce(
        (sum, p) => sum + Number(p.price ?? 0) * Number(p.stock ?? 0),
        0
      );
      const slug =
        cat.slug ||
        (cat.name || 'category')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

      const rawDesc = cat.description || '';
      const hasInactiveMarker = rawDesc.includes('[INACTIVE]');
      const cleanDescription = rawDesc.replace(/\s*\[INACTIVE\]\s*/g, '').trim();

      const isActive =
        !hasInactiveMarker &&
        cat.is_active !== false &&
        (cat.status || 'active').toLowerCase() !== 'inactive';

      return {
        ...cat,
        id: cat.id,
        name: cat.name,
        slug,
        description: cleanDescription,
        products: catProducts.length,
        productCount: catProducts.length,
        subcategories: Math.max(1, Math.min(8, catProducts.length + 1)),
        totalStock,
        totalValue,
        revenueValue: totalValue,
        revenue: `₹${totalValue.toLocaleString('en-IN')}`,
        growth: `+${10 + ((index * 5) % 18)}%`,
        icon: getCategoryIcon(cat.name),
        status: isActive ? 'active' : 'inactive',
        featured: index < 3,
      };
    });
  }, [categories, products]);

  /* ── Product Actions ── */
  const addProduct = async (productData) => {
    const created = await productService.createProduct(productData);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const editProduct = async (id, updates) => {
    const updated = await productService.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const adjustStock = async (id, newStock) => {
    const updated = await productService.updateStock(id, newStock);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const removeProduct = async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* ── Category Actions ── */
  const addCategory = async (catData) => {
    const created = await productService.createCategory(catData);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const editCategory = async (id, updates) => {
    const updated = await productService.updateCategory(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const removeCategory = async (id) => {
    await productService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    products,
    dbCategories: categories,
    categoriesWithStats,
    enrichedCategories: categoriesWithStats,
    loading,
    error,
    refreshData: fetchData,
    addProduct,
    editProduct,
    adjustStock,
    updateStock: adjustStock,
    removeProduct,
    addCategory,
    editCategory,
    removeCategory,
  };
}