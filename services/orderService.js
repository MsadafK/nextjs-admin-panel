import { supabase } from '@/lib/supabase';
import { productService } from '@/services/productService';

const FALLBACK_ORDER_COLUMNS = ['id', 'order_number', 'customer_name', 'customer_email', 'product_id', 'product_name', 'sku', 'items', 'quantity', 'unit_price', 'total_amount', 'status', 'created_at'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
let orderColumns;

const inspectOrderColumns = async () => {
  if (orderColumns) return orderColumns;
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) throw error;
  orderColumns = data?.length ? Object.keys(data[0]) : FALLBACK_ORDER_COLUMNS;
  return orderColumns;
};

const readItem = (row) => {
  let items = row.items ?? [];
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch { items = []; }
  }
  const firstItem = Array.isArray(items) ? items[0] : items;
  return {
    productId: row.product_id ?? firstItem?.product_id ?? firstItem?.productId ?? null,
    productName: row.product_name ?? firstItem?.product_name ?? firstItem?.name ?? 'Product unavailable',
    sku: row.sku ?? firstItem?.sku ?? '',
    quantity: Number(row.quantity ?? firstItem?.quantity ?? 1),
    unitPrice: Number(row.unit_price ?? firstItem?.unit_price ?? firstItem?.unitPrice ?? 0),
    items: Array.isArray(items) ? items : (items ? [items] : []),
  };
};

const mapOrder = (row = {}) => {
  const item = readItem(row);
  const quantity = Number(row.quantity ?? item.quantity ?? 1);
  const unitPrice = Number(row.unit_price ?? item.unitPrice ?? 0);
  const totalAmount = Number(row.total_amount ?? (unitPrice * quantity));
  return {
    id: row.id,
    orderNumber: row.order_number || `ORD-${String(row.id || '').slice(-8).toUpperCase()}`,
    customerName: row.customer_name || row.name || 'Workspace Customer',
    customerEmail: row.customer_email || row.email || '',
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    quantity,
    unitPrice,
    totalAmount,
    status: String(row.status || 'pending').toLowerCase(),
    createdAt: row.created_at || row.createdAt || null,
    items: item.items,
    raw: row,
  };
};

const filteredPayload = (candidate, columns) => Object.fromEntries(Object.entries(candidate).filter(([key, value]) => columns.includes(key) && value !== undefined));

const insertWithColumnFallback = async (table, initialPayload, initialColumns, returnRow = false) => {
  let payload = { ...initialPayload };
  let columns = [...initialColumns];
  for (let attempt = 0; attempt < Object.keys(payload).length + 1; attempt += 1) {
    let query = supabase.from(table).insert(payload);
    if (returnRow) query = query.select('*').single();
    const result = await query;
    if (!result.error) return result;
    const message = `${result.error.message || ''} ${result.error.details || ''} ${result.error.hint || ''}`;
    const unknownColumn = /column|schema cache|unknown/i.test(message) && Object.keys(payload).find((key) => message.toLowerCase().includes(key.toLowerCase()));
    if (!unknownColumn) return result;
    delete payload[unknownColumn];
    columns = columns.filter((column) => column !== unknownColumn);
    orderColumns = table === 'orders' ? columns : orderColumns;
    if (!Object.keys(payload).length) return result;
  }
  return { data: null, error: new Error(`Could not map a supported ${table} schema.`) };
};

const logOrderCreated = async (order) => {
  try {
    const { data, error } = await supabase.from('audit_logs').select('*').limit(1);
    if (error) throw error;
    const columns = data?.length ? Object.keys(data[0]) : ['user_id', 'user_name', 'user_email', 'action', 'module', 'resource_type', 'severity', 'details', 'created_at'];
    const candidate = {
      action: 'New Order Created', module: 'Sales', resource_type: 'order', severity: 'info',
      details: `${order.orderNumber} for ${order.customerName}: ₹${order.totalAmount.toFixed(2)}`,
      user_id: null, user_name: 'Workspace', user_email: null, created_at: new Date().toISOString(),
    };
    const payload = filteredPayload(candidate, columns);
    if (Object.keys(payload).length) {
      const { error: insertError } = await insertWithColumnFallback('audit_logs', payload, columns);
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.warn('Order was created, but its audit entry could not be written:', error.message);
  }
};

export const orderService = {
  async fetchOrders() {
    const columns = await inspectOrderColumns();
    const dateColumn = ['created_at', 'createdAt', 'timestamp'].find((column) => columns.includes(column));
    let query = supabase.from('orders').select('*');
    if (dateColumn) query = query.order(dateColumn, { ascending: false });
    let { data, error } = await query;
    if (error && dateColumn && /column|schema cache|unknown/i.test(error.message || '')) {
      orderColumns = columns.filter((column) => column !== dateColumn);
      ({ data, error } = await supabase.from('orders').select('*'));
    }
    if (error) throw error;
    if (data?.length) orderColumns = Object.keys(data[0]);
    return (data || []).map(mapOrder);
  },

  async createOrder(input) {
    const columns = await inspectOrderColumns();
    const createdAt = new Date().toISOString();
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const quantity = Math.max(1, Number(input.quantity || 1));
    const unitPrice = Number(input.unitPrice || 0);
    const items = [{ product_id: input.productId || null, product_name: input.productName || 'Custom item', sku: input.sku || '', quantity, unit_price: unitPrice }];
    const candidate = {
      order_number: orderNumber,
      customer_name: input.customerName,
      customer_email: input.customerEmail || null,
      product_id: input.productId || null,
      product_name: input.productName || 'Custom item',
      sku: input.sku || null,
      items,
      quantity,
      unit_price: unitPrice,
      total_amount: Number(input.totalAmount ?? unitPrice * quantity),
      status: ORDER_STATUSES.includes(String(input.status || '').toLowerCase()) ? String(input.status).toLowerCase() : 'pending',
      created_at: createdAt,
    };
    const payload = filteredPayload(candidate, columns);
    if (!Object.keys(payload).length) throw new Error('The public.orders table has no supported order columns.');
    const { data, error } = await insertWithColumnFallback('orders', payload, columns, true);
    if (error) throw error;
    if (data) orderColumns = Object.keys(data);
    const createdOrder = mapOrder(data);
    await logOrderCreated(createdOrder);

    if (input.productId && input.decrementStock !== false && quantity > 0) {
      try {
        const product = await productService.getProducts().then((rows) => rows.find((row) => String(row.id) === String(input.productId)));
        if (product) await productService.updateStock(product.id, Math.max(0, Number(product.stock || 0) - quantity));
      } catch (error) {
        console.warn('Order created, but matching product stock could not be adjusted:', error.message);
      }
    }
    return createdOrder;
  },

  async updateOrderStatus(id, newStatus) {
    const status = String(newStatus || '').toLowerCase();
    if (!ORDER_STATUSES.includes(status)) throw new Error(`Unsupported order status: ${newStatus}`);
    const columns = await inspectOrderColumns();
    const statusColumn = ['status', 'order_status'].find((column) => columns.includes(column));
    if (!statusColumn) throw new Error('The public.orders table does not include a status column.');
    const { data, error } = await supabase.from('orders').update({ [statusColumn]: status }).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) orderColumns = Object.keys(data);
    return mapOrder(data);
  },

  async deleteOrder(id, { isAdmin = false } = {}) {
    if (!isAdmin) throw new Error('Deleting orders requires Admin privileges.');
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  },

  async rollbackImportedOrder(id, { isManager = false } = {}) {
    if (!isManager) throw new Error('Rolling back an imported order requires Manager or Admin privileges.');
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  },

  async restoreOrder(order, { isAdmin = false } = {}) {
    if (!isAdmin) throw new Error('Restoring deleted orders requires Admin privileges.');
    const columns = await inspectOrderColumns();
    const source = order?.raw || {};
    const candidate = Object.keys(source).length ? source : {
      id: order.id, order_number: order.orderNumber, customer_name: order.customerName,
      customer_email: order.customerEmail, product_id: order.productId, product_name: order.productName,
      sku: order.sku, quantity: order.quantity, unit_price: order.unitPrice, total_amount: order.totalAmount,
      status: order.status, created_at: order.createdAt,
    };
    const payload = filteredPayload(candidate, columns);
    const { data, error } = await insertWithColumnFallback('orders', payload, columns, true);
    if (error) throw error;
    return mapOrder(data);
  },
};
