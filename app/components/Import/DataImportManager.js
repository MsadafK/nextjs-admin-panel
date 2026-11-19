'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, Download, FileJson, FileSpreadsheet, FileUp, History, LoaderCircle, Lock, Plus, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';
import { authService } from '@/services/authService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { supabase } from '@/lib/supabase';

const HISTORY_KEY = 'adminpro_import_history';
const DATASETS = [
  { id: 'products', label: 'Products Catalog', columns: ['name', 'sku', 'category', 'price', 'stock', 'description'], required: ['name', 'sku', 'price', 'stock'] },
  { id: 'users', label: 'Users Directory', columns: ['name', 'email', 'role', 'department', 'status'], required: ['name', 'email'] },
  { id: 'orders', label: 'Sales Orders', columns: ['customer_name', 'customer_email', 'product_name', 'sku', 'quantity', 'unit_price', 'total_amount', 'status'], required: ['customer_name', 'product_name', 'quantity', 'total_amount'] },
];
const SAMPLE_ROWS = {
  products: [
    { name: 'Wireless Keyboard', sku: 'DEMO-KEY-101', category: 'Electronics', price: 2499, stock: 38, description: 'Compact wireless keyboard' },
    { name: 'Desk Lamp', sku: 'DEMO-LAMP-102', category: 'Home Office', price: 1899, stock: 24, description: 'Adjustable LED desk lamp' },
    { name: 'Notebook Set', sku: 'DEMO-NOTE-103', category: 'Stationery', price: 499, stock: 72, description: 'Three piece notebook set' },
    { name: 'Travel Bottle', sku: 'DEMO-BOTTLE-104', category: 'Accessories', price: 799, stock: 46, description: 'Insulated stainless steel bottle' },
    { name: 'Laptop Stand', sku: 'DEMO-STAND-105', category: 'Electronics', price: 1599, stock: 19, description: 'Foldable aluminum laptop stand' },
  ],
  users: [
    { name: 'Aarav Mehta', email: 'aarav.mehta@example.test', role: 'User', department: 'Engineering', status: 'Active' },
    { name: 'Priya Nair', email: 'priya.nair@example.test', role: 'Manager', department: 'Management', status: 'Active' },
    { name: 'Kabir Shah', email: 'kabir.shah@example.test', role: 'User', department: 'Marketing', status: 'Active' },
    { name: 'Anaya Rao', email: 'anaya.rao@example.test', role: 'User', department: 'Support', status: 'Active' },
    { name: 'Ishaan Das', email: 'ishaan.das@example.test', role: 'User', department: 'Engineering', status: 'Active' },
  ],
  orders: [
    { customer_name: 'Rohan Kapoor', customer_email: 'rohan.kapoor@example.test', product_name: 'Wireless Keyboard', sku: 'DEMO-KEY-101', quantity: 1, unit_price: 2499, total_amount: 2499, status: 'pending' },
    { customer_name: 'Meera Iyer', customer_email: 'meera.iyer@example.test', product_name: 'Desk Lamp', sku: 'DEMO-LAMP-102', quantity: 2, unit_price: 1899, total_amount: 3798, status: 'processing' },
    { customer_name: 'Dev Patel', customer_email: 'dev.patel@example.test', product_name: 'Notebook Set', sku: 'DEMO-NOTE-103', quantity: 3, unit_price: 499, total_amount: 1497, status: 'pending' },
    { customer_name: 'Sara Khan', customer_email: 'sara.khan@example.test', product_name: 'Travel Bottle', sku: 'DEMO-BOTTLE-104', quantity: 2, unit_price: 799, total_amount: 1598, status: 'completed' },
    { customer_name: 'Neil Joseph', customer_email: 'neil.joseph@example.test', product_name: 'Laptop Stand', sku: 'DEMO-STAND-105', quantity: 1, unit_price: 1599, total_amount: 1599, status: 'pending' },
  ],
};

const aliases = {
  name: ['name', 'full_name', 'customer', 'customer_name', 'customername'],
  email: ['email', 'customer_email', 'customeremail'],
  customer_name: ['customer_name', 'customername', 'customer', 'name'],
  customer_email: ['customer_email', 'customeremail', 'email'],
  product_name: ['product_name', 'productname', 'product', 'item'],
  sku: ['sku', 'product_sku'],
  price: ['price', 'unit_price', 'unitprice'],
  unit_price: ['unit_price', 'unitprice', 'price'],
  stock: ['stock', 'stock_quantity', 'stockquantity', 'quantity_in_stock'],
  quantity: ['quantity', 'qty'],
  total_amount: ['total_amount', 'totalamount', 'amount', 'total'],
  category: ['category', 'category_name', 'categoryname'],
  department: ['department', 'team'],
  role: ['role', 'user_role'],
  status: ['status', 'state'],
  description: ['description', 'details'],
};
const normalizeHeaders = (row) => Object.fromEntries(Object.entries(row || {}).map(([key, value]) => [String(key).trim().toLowerCase().replace(/[\s-]+/g, '_'), value]));
const getField = (row, key) => {
  const normalized = normalizeHeaders(row);
  const match = aliases[key] || [key];
  const value = match.map((field) => normalized[field]).find((item) => item !== undefined && item !== null && String(item).trim() !== '');
  return value === undefined ? '' : String(value).trim();
};

function parseCsv(text) {
  const records = [];
  let record = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { field += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { record.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      record.push(field); field = '';
      if (record.some((cell) => String(cell).trim())) records.push(record);
      record = [];
    } else field += char;
  }
  record.push(field);
  if (record.some((cell) => String(cell).trim())) records.push(record);
  if (!records.length) return [];
  const headers = records.shift().map((header) => String(header).replace(/^\uFEFF/, '').trim());
  return records.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function parseFileText(text, extension) {
  if (extension === 'json') {
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.data) ? parsed.data : [parsed];
    return rows.filter((row) => row && typeof row === 'object' && !Array.isArray(row));
  }
  return parseCsv(text);
}

function validateRow(dataset, source) {
  const problems = [];
  if (dataset.id === 'products') {
    const name = getField(source, 'name'); const sku = getField(source, 'sku');
    const price = Number(getField(source, 'price')); const stock = Number(getField(source, 'stock'));
    if (!name) problems.push('Product name is required');
    if (!sku) problems.push('SKU is required');
    if (!getField(source, 'price') || !Number.isFinite(price) || price < 0) problems.push('Price must be a valid non-negative number');
    if (!getField(source, 'stock') || !Number.isInteger(stock) || stock < 0) problems.push('Stock must be a non-negative whole number');
    return { valid: !problems.length, problems, value: { name, sku, category: getField(source, 'category') || 'Uncategorized', price, stock, description: getField(source, 'description'), status: 'active' } };
  }
  if (dataset.id === 'users') {
    const name = getField(source, 'name'); const email = getField(source, 'email'); const role = getField(source, 'role') || 'User';
    if (!name) problems.push('Name is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push('A valid email is required');
    if (!['admin', 'manager', 'user'].includes(role.toLowerCase())) problems.push('Role must be Admin, Manager, or User');
    return { valid: !problems.length, problems, value: { name, email, role, department: getField(source, 'department') || 'General', status: getField(source, 'status') || 'Active' } };
  }
  const customerName = getField(source, 'customer_name'); const customerEmail = getField(source, 'customer_email'); const productName = getField(source, 'product_name');
  const qty = Number(getField(source, 'quantity')); const amount = Number(getField(source, 'total_amount')); const unitPriceRaw = getField(source, 'unit_price');
  const unitPrice = unitPriceRaw ? Number(unitPriceRaw) : (Number.isFinite(amount / qty) ? amount / qty : 0);
  if (!customerName) problems.push('Customer name is required');
  if (!productName) problems.push('Product name is required');
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) problems.push('Customer email is invalid');
  if (!Number.isInteger(qty) || qty < 1) problems.push('Quantity must be a positive whole number');
  if (!getField(source, 'total_amount') || !Number.isFinite(amount) || amount < 0) problems.push('Total amount must be a valid non-negative number');
  if (!Number.isFinite(unitPrice) || unitPrice < 0) problems.push('Unit price must be non-negative');
  const status = getField(source, 'status').toLowerCase() || 'pending';
  if (!['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) problems.push('Order status is not supported');
  return { valid: !problems.length, problems, value: { customerName, customerEmail, productName, sku: getField(source, 'sku'), quantity: qty, unitPrice, totalAmount: amount, status, decrementStock: false } };
}

function readHistory() {
  try { const value = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}

function downloadFile(filename, content, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function DataImportManager({ mode = 'data' }) {
  const router = useRouter();
  const { currentUser, isManager } = useAuth();
  const { pushToast } = useToast();
  const [datasetId, setDatasetId] = useState('products');
  const [rows, setRows] = useState([]);
  const [sourceName, setSourceName] = useState('Sample batch');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dataset = DATASETS.find((item) => item.id === datasetId) || DATASETS[0];
  const validRows = rows.filter((row) => row.valid);
  const invalidCount = rows.length - validRows.length;

  useEffect(() => { setHistory(readHistory()); }, []);

  const setDataset = (next) => { setDatasetId(next); setRows([]); setError(''); setSourceName('Sample batch'); };
  const loadRows = (sourceRows, filename) => {
    const next = sourceRows.map((source, index) => ({ id: `${Date.now()}-${index}`, source, ...validateRow(dataset, source) }));
    setRows(next); setSourceName(filename); setError(next.length ? '' : 'No data rows were found in that file.');
  };

  const processFile = async (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json'].includes(extension)) { setError('Choose a .csv or .json file.'); return; }
    try { loadRows(parseFileText(await file.text(), extension), file.name); }
    catch (parseError) { setRows([]); setError(parseError.message || 'Could not parse this file.'); }
  };

  const loadSampleBatch = () => { setError(''); loadRows(SAMPLE_ROWS[datasetId], 'Sample batch'); };

  const createRecord = async (value) => {
    if (datasetId === 'products') {
      const categories = await productService.getCategories().catch(() => []);
      const category = categories.find((item) => item.name?.toLowerCase() === value.category.toLowerCase());
      return productService.createProduct({ ...value, category_id: category?.id || null });
    }
    if (datasetId === 'users') return userService.createUser(value);
    return orderService.createOrder(value);
  };

  const undoImport = async (jobId, targetDataset, imported, { notify = true } = {}) => {
    for (const record of [...imported].reverse()) {
      if (targetDataset === 'products') await productService.deleteProduct(record.id);
      else if (targetDataset === 'users') {
        try { await userService.SoftDeleteUser(record.id); }
        catch { const { error: deleteError } = await supabase.from('users').delete().eq('id', record.id); if (deleteError) throw deleteError; }
      }
      else await orderService.rollbackImportedOrder(record.id, { isManager });
    }
    const nextHistory = readHistory().map((item) => item.id === jobId ? { ...item, undoneAt: new Date().toISOString() } : item);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
    if (notify) pushToast({ title: 'Import batch undone', subtitle: `${imported.length} imported ${targetDataset} records were rolled back.` });
  };

  const runImport = async () => {
    if (!isManager || !validRows.length) return;
    setBusy(true); setError('');
    const imported = [];
    try {
      for (const row of validRows) imported.push(await createRecord(row.value));
      const jobId = `${Date.now()}`;
      const job = { id: jobId, dataset: datasetId, datasetLabel: dataset.label, rowCount: imported.length, operator: currentUser?.name || 'Workspace User', createdAt: new Date().toISOString(), source: sourceName, auditSynced: false };
      let auditError = '';
      try { await authService.logAuditEvent(currentUser, 'Bulk Data Import', `${imported.length} ${dataset.label} records imported from ${sourceName}.`); job.auditSynced = true; }
      catch (logError) { auditError = logError.message || 'Audit log unavailable'; }
      const nextHistory = [job, ...readHistory()].slice(0, 100);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      setHistory(nextHistory);
      setRows([]);
      pushToast({ title: `${imported.length} rows imported`, subtitle: auditError ? `Import saved; audit sync failed: ${auditError}` : `${dataset.label} · ${currentUser?.name || 'Workspace User'}`, onUndo: () => undoImport(jobId, datasetId, imported) });
    } catch (importError) {
      if (imported.length) {
        const rollbackErrors = [];
        try { await undoImport(`partial-${Date.now()}`, datasetId, imported, { notify: false }); } catch (rollbackError) { rollbackErrors.push(rollbackError.message); }
        setError(`Import stopped after ${imported.length} row(s): ${importError.message}${rollbackErrors.length ? ` Rollback issue: ${rollbackErrors.join(', ')}` : ' Completed rows were rolled back.'}`);
      } else setError(importError.message || 'Import failed. Check the row values and Supabase permissions.');
    } finally { setBusy(false); }
  };

  const downloadTemplate = (targetDataset, format) => {
    const spec = DATASETS.find((item) => item.id === targetDataset);
    const sample = SAMPLE_ROWS[targetDataset];
    if (format === 'json') downloadFile(`${targetDataset}-template.json`, JSON.stringify(sample, null, 2), 'application/json');
    else {
      const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const csv = [spec.columns, ...sample.map((row) => spec.columns.map((column) => row[column] ?? ''))].map((line) => line.map(escape).join(',')).join('\r\n');
      downloadFile(`${targetDataset}-template.csv`, csv, 'text/csv;charset=utf-8');
    }
  };

  const pageTitle = mode === 'templates' ? 'Import Templates' : mode === 'history' ? 'Import History' : 'Bulk Data Import';
  const pageDescription = mode === 'templates' ? 'Download schema-aligned CSV or JSON starter files.' : mode === 'history' ? 'Review completed import jobs and their audit sync status.' : 'Validate a CSV or JSON batch before writing records to Supabase.';

  const header = <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight text-foreground">{pageTitle}</h1><span className="h-2 w-2 rounded-full bg-foreground" aria-label="Live import module"/></div><p className="mt-1 text-sm text-muted-foreground">{pageDescription}</p></div><div className="flex flex-wrap gap-2">{mode !== 'data' && <button type="button" onClick={() => router.push('/reports/import/data')} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90"><Plus size={14}/>Run New Import</button>}{mode === 'data' && <button type="button" onClick={() => router.push('/reports/import/history')} className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"><History size={14}/>Import History</button>}</div></header>;

  const dataView = <>
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5"><div className="mb-3"><h2 className="text-sm font-semibold text-foreground">Target Dataset</h2><p className="mt-1 text-xs text-muted-foreground">Choose the Supabase table to receive the validated rows.</p></div><div role="group" aria-label="Target dataset" className="grid grid-cols-1 gap-2 sm:grid-cols-3">{DATASETS.map((item) => <button key={item.id} type="button" aria-pressed={datasetId === item.id} onClick={() => setDataset(item.id)} className={`min-h-10 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${datasetId === item.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:bg-muted'}`}>{item.label}</button>)}</div></section>
    <section onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); processFile(event.dataTransfer.files?.[0]); }} className={`rounded-xl border-2 border-dashed p-6 text-center transition-all sm:p-8 ${dragging ? 'border-foreground/70 bg-muted/50' : 'border-border hover:border-foreground/50'}`}>
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground"><FileUp size={19}/></span><h2 className="mt-3 text-sm font-semibold text-foreground">Drop a CSV or JSON file here</h2><p className="mt-1 text-xs text-muted-foreground">Headers are matched to the selected {dataset.label.toLowerCase()} schema.</p><div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3.5 text-xs font-medium text-foreground hover:bg-muted"><Upload size={14}/>Choose File</button><button type="button" onClick={loadSampleBatch} className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3.5 text-xs font-medium text-background hover:opacity-90">Load Instant Sample Batch (Demo)</button></div><input ref={fileInputRef} type="file" accept=".csv,.json,text/csv,application/json" className="hidden" onChange={(event) => processFile(event.target.files?.[0])}/>
    </section>
    {error && <p role="alert" className="flex items-start gap-2 rounded-lg border border-border bg-muted p-3 text-xs text-foreground"><AlertCircle size={14} className="mt-0.5 shrink-0"/>{error}</p>}
    {rows.length > 0 && <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-foreground">Pre-Import Validation</h2><p className="mt-1 text-xs text-muted-foreground">{sourceName} · {rows.length} parsed rows · {validRows.length} ready · {invalidCount} invalid</p></div><button type="button" onClick={() => { setRows([]); setError(''); }} className="inline-flex h-8 items-center gap-1.5 self-start rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted"><X size={13}/>Clear Preview</button></div><div className="w-full overflow-x-auto"><table className="w-full min-w-[840px] border-collapse text-left text-xs"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-3 py-3">Row</th><th className="px-3 py-3">Validation</th>{dataset.columns.slice(0, 5).map((column) => <th key={column} className="px-3 py-3">{column.replace(/_/g, ' ')}</th>)}<th className="px-3 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{rows.map((row, index) => <tr key={row.id} className="align-top"><td className="px-3 py-3 font-mono text-muted-foreground">{index + 1}</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-1 font-mono text-[9px] font-semibold uppercase ${row.valid ? 'border-foreground bg-foreground text-background' : 'border-border bg-muted text-muted-foreground'}`}>{row.valid ? <Check size={10}/> : <AlertCircle size={10}/>} {row.valid ? 'READY' : 'INVALID / MISSING FIELDS'}</span>{!row.valid && <p className="mt-1 max-w-48 text-[10px] text-muted-foreground">{row.problems.join(' · ')}</p>}</td>{dataset.columns.slice(0, 5).map((column) => <td key={column} className="max-w-56 truncate px-3 py-3 text-foreground">{String(row.source[column] ?? getField(row.source, column) ?? '—')}</td>)}<td className="whitespace-nowrap px-3 py-3 text-right"><button type="button" aria-label={`Remove row ${index + 1}`} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-[10px] font-medium hover:bg-muted"><Trash2 size={11}/>Remove Row</button></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">{isManager ? `${validRows.length} valid row(s) will be added to ${dataset.label}.` : 'Importing requires Manager or Admin privileges.'}</p><button type="button" onClick={runImport} disabled={!isManager || !validRows.length || busy} title={!isManager ? 'Requires Manager or Admin privileges' : undefined} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle size={14} className="animate-spin"/> : !isManager ? <Lock size={14}/> : <Check size={14}/>}Import {validRows.length} Valid Rows to Supabase</button></div></section>}
  </>;

  const templatesView = <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">{DATASETS.map((item) => <article key={item.id} className="rounded-xl border border-border bg-card p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-foreground">{item.label}</h2><p className="mt-1 text-xs text-muted-foreground">Required: {item.required.join(', ')}</p></div><FileSpreadsheet size={17} className="text-muted-foreground"/></div><div className="mt-4 rounded-lg border border-border bg-muted/20 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Schema columns</p><p className="mt-2 break-words font-mono text-[10px] text-foreground">{item.columns.join(' · ')}</p></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => downloadTemplate(item.id, 'csv')} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground hover:bg-muted"><Download size={13}/>CSV</button><button type="button" onClick={() => downloadTemplate(item.id, 'json')} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-foreground px-2 text-xs font-medium text-background hover:opacity-90"><FileJson size={13}/>JSON</button></div></article>)}</section>;

  const historyView = <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b border-border p-4"><div><h2 className="text-sm font-semibold text-foreground">Completed Import Jobs</h2><p className="mt-1 text-xs text-muted-foreground">{history.length} job(s) stored in this browser workspace.</p></div><History size={16} className="text-muted-foreground"/></div>{history.length ? <div className="w-full overflow-x-auto"><table className="w-full min-w-[700px] border-collapse text-left text-xs"><thead><tr className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3">Target Dataset</th><th className="px-4 py-3">Rows</th><th className="px-4 py-3">Operator</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Audit</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-border">{history.map((job) => <tr key={job.id}><td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-muted-foreground">{new Date(job.createdAt).toLocaleString('en-IN')}</td><td className="px-4 py-3 font-medium text-foreground">{job.datasetLabel}</td><td className="px-4 py-3 font-mono">{job.rowCount}</td><td className="px-4 py-3">{job.operator}</td><td className="max-w-48 truncate px-4 py-3 text-muted-foreground">{job.source}</td><td className="px-4 py-3"><span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">{job.auditSynced ? 'Synced' : 'Pending'}</span></td><td className="px-4 py-3">{job.undoneAt ? <span className="text-muted-foreground">Undone</span> : <span className="font-medium text-foreground">Completed</span>}</td></tr>)}</tbody></table></div> : <div className="p-12 text-center"><p className="text-sm font-medium text-foreground">No import jobs yet</p><p className="mt-1 text-xs text-muted-foreground">Completed imports will appear here.</p><button type="button" onClick={() => router.push('/reports/import/data')} className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:opacity-90"><Plus size={13}/>Run New Import</button></div>}</section>;

  return <div className="page-container space-y-5">{header}{mode === 'templates' ? templatesView : mode === 'history' ? historyView : dataView}</div>;
}
