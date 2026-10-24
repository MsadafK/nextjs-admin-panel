// hooks/useProducts.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

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
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products from Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const removeProduct = async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    products,
    dbCategories: categories,
    loading,
    error,
    refreshData: fetchData,
    addProduct,
    editProduct,
    removeProduct,
  };
}