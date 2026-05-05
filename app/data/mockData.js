/**
 * mockData.js
 * ─────────────────────────────────────────────────────────────
 * NexStore — E-commerce Operations Admin Panel
 * Central mock data file — imported by all pages
 * ─────────────────────────────────────────────────────────────
 */

// ─── CUSTOMERS ───────────────────────────────────────────────
export const customers = [
  { id: 'C001', name: 'Sarah Johnson',  email: 'sarah.j@gmail.com',      phone: '+1 555-0101', role: 'Customer', status: 'Active',    joined: '2024-01-15', lastLogin: '2 hours ago',    totalOrders: 12, totalSpent: 1840.50, avatar: 'SJ', city: 'New York',     country: 'US' },
  { id: 'C002', name: 'Mike Chen',      email: 'mike.chen@outlook.com',   phone: '+1 555-0102', role: 'Customer', status: 'Active',    joined: '2024-02-20', lastLogin: '1 day ago',      totalOrders: 8,  totalSpent: 2340.00, avatar: 'MC', city: 'San Francisco',country: 'US' },
  { id: 'C003', name: 'Emily Brown',    email: 'emily.b@yahoo.com',       phone: '+1 555-0103', role: 'Customer', status: 'Active',    joined: '2024-03-10', lastLogin: '5 minutes ago',  totalOrders: 23, totalSpent: 5670.75, avatar: 'EB', city: 'Chicago',      country: 'US' },
  { id: 'C004', name: 'David Lee',      email: 'david.lee@gmail.com',     phone: '+1 555-0104', role: 'Customer', status: 'Inactive',  joined: '2023-11-05', lastLogin: '1 week ago',     totalOrders: 3,  totalSpent: 450.00,  avatar: 'DL', city: 'Houston',      country: 'US' },
  { id: 'C005', name: 'Lisa Anderson',  email: 'lisa.a@gmail.com',        phone: '+1 555-0105', role: 'Customer', status: 'Suspended', joined: '2023-09-22', lastLogin: '2 weeks ago',    totalOrders: 1,  totalSpent: 89.99,   avatar: 'LA', city: 'Phoenix',      country: 'US' },
  { id: 'C006', name: 'Tom Harris',     email: 'tom.h@icloud.com',        phone: '+1 555-0106', role: 'Customer', status: 'Active',    joined: '2024-04-01', lastLogin: '30 minutes ago', totalOrders: 17, totalSpent: 3210.25, avatar: 'TH', city: 'Los Angeles',  country: 'US' },
  { id: 'C007', name: 'Amy Martinez',   email: 'amy.m@gmail.com',         phone: '+1 555-0107', role: 'Customer', status: 'Active',    joined: '2024-05-14', lastLogin: '4 hours ago',    totalOrders: 6,  totalSpent: 980.00,  avatar: 'AM', city: 'Miami',        country: 'US' },
  { id: 'C008', name: 'James Wilson',   email: 'james.w@outlook.com',     phone: '+1 555-0108', role: 'Customer', status: 'Active',    joined: '2024-06-03', lastLogin: '2 days ago',     totalOrders: 9,  totalSpent: 1560.50, avatar: 'JW', city: 'Seattle',      country: 'US' },
];

// ─── STAFF ───────────────────────────────────────────────────
export const staff = [
  { id: 'S001', name: 'John Doe',       email: 'john@nexstore.com',       phone: '+1 555-0201', role: 'Admin',   status: 'Active', joined: '2023-01-10', lastLogin: '1 hour ago',    department: 'Management',     avatar: 'JD', permissions: ['all'] },
  { id: 'S002', name: 'Sarah Wilson',   email: 'sarah@nexstore.com',      phone: '+1 555-0202', role: 'Manager', status: 'Active', joined: '2023-03-15', lastLogin: '3 hours ago',   department: 'Operations',     avatar: 'SW', permissions: ['orders', 'products', 'customers'] },
  { id: 'S003', name: 'Mike Johnson',   email: 'mike@nexstore.com',       phone: '+1 555-0203', role: 'Staff',   status: 'Active', joined: '2023-06-20', lastLogin: '30 minutes ago',department: 'Customer Support',avatar: 'MJ', permissions: ['messages', 'customers'] },
  { id: 'S004', name: 'Emily Davis',    email: 'emily@nexstore.com',      phone: '+1 555-0204', role: 'Staff',   status: 'Active', joined: '2023-08-05', lastLogin: '2 hours ago',   department: 'Inventory',      avatar: 'ED', permissions: ['products', 'inventory'] },
  { id: 'S005', name: 'Robert Taylor',  email: 'robert@nexstore.com',     phone: '+1 555-0205', role: 'Manager', status: 'Active', joined: '2022-11-12', lastLogin: '1 day ago',     department: 'Analytics',      avatar: 'RT', permissions: ['analytics', 'reports'] },
];

// ─── PRODUCTS ────────────────────────────────────────────────
export const products = [
  { id: 'P001', name: 'iPhone 15 Pro',         category: 'Smartphones',  brand: 'Apple',   price: 999.99,  stock: 45,  sold: 234, rating: 4.8, status: 'Active',      image: '📱', sku: 'APL-IP15P-001', description: 'Latest Apple flagship with titanium design'   },
  { id: 'P002', name: 'Samsung Galaxy S24',    category: 'Smartphones',  brand: 'Samsung', price: 849.99,  stock: 62,  sold: 189, rating: 4.6, status: 'Active',      image: '📱', sku: 'SAM-GS24-001',  description: 'Android flagship with AI features'             },
  { id: 'P003', name: 'MacBook Pro 14"',       category: 'Laptops',      brand: 'Apple',   price: 1999.99, stock: 23,  sold: 98,  rating: 4.9, status: 'Active',      image: '💻', sku: 'APL-MBP14-001', description: 'M3 Pro chip, perfect for professionals'        },
  { id: 'P004', name: 'Dell XPS 15',           category: 'Laptops',      brand: 'Dell',    price: 1599.99, stock: 31,  sold: 76,  rating: 4.5, status: 'Active',      image: '💻', sku: 'DEL-XPS15-001', description: 'OLED display, Intel Core i9'                   },
  { id: 'P005', name: 'Sony WH-1000XM5',       category: 'Headphones',   brand: 'Sony',    price: 349.99,  stock: 88,  sold: 412, rating: 4.7, status: 'Active',      image: '🎧', sku: 'SNY-WH1000-001', description: 'Industry-leading noise cancellation'           },
  { id: 'P006', name: 'AirPods Pro 2',         category: 'Headphones',   brand: 'Apple',   price: 249.99,  stock: 120, sold: 567, rating: 4.8, status: 'Active',      image: '🎧', sku: 'APL-APP2-001',  description: 'Active noise cancellation, H2 chip'            },
  { id: 'P007', name: 'iPad Air 5',            category: 'Tablets',      brand: 'Apple',   price: 749.99,  stock: 55,  sold: 143, rating: 4.7, status: 'Active',      image: '📱', sku: 'APL-IPA5-001',  description: 'M1 chip, perfect for creativity'               },
  { id: 'P008', name: 'Logitech MX Master 3',  category: 'Accessories',  brand: 'Logitech',price: 99.99,   stock: 210, sold: 890, rating: 4.6, status: 'Active',      image: '🖱️', sku: 'LOG-MXM3-001',  description: 'Advanced wireless mouse for power users'       },
  { id: 'P009', name: 'Samsung 4K Monitor',    category: 'Monitors',     brand: 'Samsung', price: 599.99,  stock: 18,  sold: 67,  rating: 4.4, status: 'Active',      image: '🖥️', sku: 'SAM-4KM-001',   description: '27" 4K UHD IPS display'                        },
  { id: 'P010', name: 'Anker USB-C Hub',       category: 'Accessories',  brand: 'Anker',   price: 49.99,   stock: 340, sold: 1240,rating: 4.5, status: 'Active',      image: '🔌', sku: 'ANK-USBC-001',  description: '7-in-1 USB-C hub with 4K HDMI'                 },
  { id: 'P011', name: 'GoPro Hero 12',         category: 'Cameras',      brand: 'GoPro',   price: 399.99,  stock: 34,  sold: 156, rating: 4.6, status: 'Active',      image: '📷', sku: 'GOP-H12-001',   description: '5.3K video, HyperSmooth 6.0'                   },
  { id: 'P012', name: 'Apple Watch Series 9',  category: 'Wearables',    brand: 'Apple',   price: 399.99,  stock: 5,   sold: 321, rating: 4.8, status: 'Low Stock',   image: '⌚', sku: 'APL-AWS9-001',  description: 'S9 chip, Double Tap gesture'                   },
  { id: 'P013', name: 'Kindle Paperwhite',     category: 'E-Readers',    brand: 'Amazon',  price: 139.99,  stock: 0,   sold: 445, rating: 4.7, status: 'Out of Stock',image: '📚', sku: 'AMZ-KPW-001',   description: '6.8" display, adjustable warm light'          },
  { id: 'P014', name: 'Razer DeathAdder V3',   category: 'Accessories',  brand: 'Razer',   price: 69.99,   stock: 156, sold: 678, rating: 4.5, status: 'Active',      image: '🖱️', sku: 'RAZ-DAV3-001',  description: 'Ergonomic gaming mouse, 30K DPI'               },
  { id: 'P015', name: 'LG 65" OLED TV',        category: 'TVs',          brand: 'LG',      price: 1799.99, stock: 12,  sold: 45,  rating: 4.9, status: 'Active',      image: '📺', sku: 'LGE-65OL-001',  description: 'Gallery Series OLED evo, 4K 120Hz'            },
];

// ─── CATEGORIES ──────────────────────────────────────────────
export const categories = [
  { id: 'CAT001', name: 'Smartphones',  productCount: 2,  revenue: 320000, growth: 12.5, icon: '📱' },
  { id: 'CAT002', name: 'Laptops',      productCount: 2,  revenue: 280000, growth: 8.3,  icon: '💻' },
  { id: 'CAT003', name: 'Headphones',   productCount: 2,  revenue: 175000, growth: 15.2, icon: '🎧' },
  { id: 'CAT004', name: 'Accessories',  productCount: 3,  revenue: 145000, growth: 22.1, icon: '🖱️' },
  { id: 'CAT005', name: 'Tablets',      productCount: 1,  revenue: 107000, growth: 6.8,  icon: '📱' },
  { id: 'CAT006', name: 'Monitors',     productCount: 1,  revenue: 40000,  growth: -2.3, icon: '🖥️' },
  { id: 'CAT007', name: 'Cameras',      productCount: 1,  revenue: 62000,  growth: 9.4,  icon: '📷' },
  { id: 'CAT008', name: 'Wearables',    productCount: 1,  revenue: 128000, growth: 18.7, icon: '⌚' },
];

// ─── ORDERS ──────────────────────────────────────────────────
export const orders = [
  { id: 'ORD-1001', customerId: 'C001', customerName: 'Sarah Johnson',  products: ['P005', 'P008'], total: 449.98,  status: 'Delivered', date: '2024-12-01', paymentMethod: 'Credit Card', address: 'New York, US'     },
  { id: 'ORD-1002', customerId: 'C002', customerName: 'Mike Chen',      products: ['P003'],         total: 1999.99, status: 'Processing',date: '2024-12-02', paymentMethod: 'PayPal',      address: 'San Francisco, US'},
  { id: 'ORD-1003', customerId: 'C003', customerName: 'Emily Brown',    products: ['P001', 'P006'], total: 1249.98, status: 'Delivered', date: '2024-12-01', paymentMethod: 'Credit Card', address: 'Chicago, US'      },
  { id: 'ORD-1004', customerId: 'C006', customerName: 'Tom Harris',     products: ['P009'],         total: 599.99,  status: 'Shipped',   date: '2024-12-03', paymentMethod: 'Debit Card',  address: 'Los Angeles, US'  },
  { id: 'ORD-1005', customerId: 'C007', customerName: 'Amy Martinez',   products: ['P010', 'P014'], total: 119.98,  status: 'Delivered', date: '2024-11-30', paymentMethod: 'Credit Card', address: 'Miami, US'        },
  { id: 'ORD-1006', customerId: 'C008', customerName: 'James Wilson',   products: ['P007'],         total: 749.99,  status: 'Processing',date: '2024-12-03', paymentMethod: 'PayPal',      address: 'Seattle, US'      },
  { id: 'ORD-1007', customerId: 'C001', customerName: 'Sarah Johnson',  products: ['P012'],         total: 399.99,  status: 'Shipped',   date: '2024-12-02', paymentMethod: 'Credit Card', address: 'New York, US'     },
  { id: 'ORD-1008', customerId: 'C003', customerName: 'Emily Brown',    products: ['P015'],         total: 1799.99, status: 'Processing',date: '2024-12-03', paymentMethod: 'Credit Card', address: 'Chicago, US'      },
  { id: 'ORD-1009', customerId: 'C006', customerName: 'Tom Harris',     products: ['P002', 'P005'], total: 1199.98, status: 'Delivered', date: '2024-11-29', paymentMethod: 'Debit Card',  address: 'Los Angeles, US'  },
  { id: 'ORD-1010', customerId: 'C002', customerName: 'Mike Chen',      products: ['P011'],         total: 399.99,  status: 'Delivered', date: '2024-11-28', paymentMethod: 'PayPal',      address: 'San Francisco, US'},
];

// ─── REVENUE (Monthly) ───────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Jan', revenue: 38500,  orders: 142, customers: 89  },
  { month: 'Feb', revenue: 42300,  orders: 158, customers: 102 },
  { month: 'Mar', revenue: 39800,  orders: 149, customers: 95  },
  { month: 'Apr', revenue: 51200,  orders: 187, customers: 134 },
  { month: 'May', revenue: 48900,  orders: 175, customers: 118 },
  { month: 'Jun', revenue: 55600,  orders: 201, customers: 156 },
  { month: 'Jul', revenue: 61200,  orders: 224, customers: 178 },
  { month: 'Aug', revenue: 58700,  orders: 215, customers: 165 },
  { month: 'Sep', revenue: 63400,  orders: 231, customers: 189 },
  { month: 'Oct', revenue: 71800,  orders: 262, customers: 210 },
  { month: 'Nov', revenue: 89200,  orders: 325, customers: 267 },
  { month: 'Dec', revenue: 45231,  orders: 165, customers: 132 },
];

// ─── WEEKLY REVENUE (Last 7 days) ────────────────────────────
export const weeklyRevenue = [
  { day: 'Mon', revenue: 12500, orders: 45, visitors: 1240 },
  { day: 'Tue', revenue: 15200, orders: 52, visitors: 1580 },
  { day: 'Wed', revenue: 13800, orders: 48, visitors: 1390 },
  { day: 'Thu', revenue: 18900, orders: 67, visitors: 1820 },
  { day: 'Fri', revenue: 21500, orders: 78, visitors: 2140 },
  { day: 'Sat', revenue: 24300, orders: 89, visitors: 2560 },
  { day: 'Sun', revenue: 19800, orders: 71, visitors: 2180 },
];

// ─── MESSAGES ────────────────────────────────────────────────
export const messages = [
  { id: 'MSG001', from: 'Sarah Johnson',  email: 'sarah.j@gmail.com',    subject: 'Order not received',          body: 'Hi, I placed order ORD-1001 5 days ago but haven\'t received it yet. Can you help?', time: '2 min ago',   status: 'Unread',   priority: 'High',   tag: 'Support',  orderId: 'ORD-1001' },
  { id: 'MSG002', from: 'Mike Chen',      email: 'mike.chen@outlook.com', subject: 'Return request for MacBook',  body: 'I would like to return my MacBook Pro. It has a defect on the screen.',              time: '15 min ago',  status: 'Unread',   priority: 'High',   tag: 'Returns',  orderId: 'ORD-1002' },
  { id: 'MSG003', from: 'Emily Brown',    email: 'emily.b@yahoo.com',     subject: 'Great service!',              body: 'Just wanted to say the iPhone 15 Pro I ordered arrived quickly and is perfect!',    time: '1 hour ago',  status: 'Read',     priority: 'Low',    tag: 'Feedback', orderId: 'ORD-1003' },
  { id: 'MSG004', from: 'Tom Harris',     email: 'tom.h@icloud.com',      subject: 'Wrong item delivered',        body: 'I ordered Samsung Monitor but received a different model. Please resolve.',         time: '3 hours ago', status: 'Replied',  priority: 'High',   tag: 'Support',  orderId: 'ORD-1004' },
  { id: 'MSG005', from: 'Amy Martinez',   email: 'amy.m@gmail.com',       subject: 'Discount code not working',   body: 'The discount code SAVE20 is not applying at checkout. Please help.',                 time: '5 hours ago', status: 'Unread',   priority: 'Medium', tag: 'Support',  orderId: null       },
  { id: 'MSG006', from: 'James Wilson',   email: 'james.w@outlook.com',   subject: 'Bulk order inquiry',          body: 'We are interested in placing a bulk order of 50 units. Can you offer a discount?',  time: '1 day ago',   status: 'Read',     priority: 'Medium', tag: 'Sales',    orderId: null       },
  { id: 'MSG007', from: 'David Lee',      email: 'david.lee@gmail.com',   subject: 'Account access issue',        body: 'I cannot log into my account. Password reset is not working.',                      time: '2 days ago',  status: 'Replied',  priority: 'Low',    tag: 'Account',  orderId: null       },
  { id: 'MSG008', from: 'Lisa Anderson',  email: 'lisa.a@gmail.com',      subject: 'Complaint about product',     body: 'The AirPods I bought stopped working after 2 weeks. This is unacceptable.',         time: '3 days ago',  status: 'Archived', priority: 'High',   tag: 'Complaint',orderId: null       },
];

// ─── EVENTS / CALENDAR ───────────────────────────────────────
export const events = [
  { id: 'EVT001', title: 'Black Friday Sale Launch',    date: '2024-11-29', time: '00:00', type: 'Sale',     priority: 'High',   assignee: 'S001', description: 'Annual Black Friday sale — 30% off all electronics' },
  { id: 'EVT002', title: 'New iPhone Stock Arrival',    date: '2024-12-05', time: '10:00', type: 'Inventory',priority: 'High',   assignee: 'S004', description: 'New batch of iPhone 15 Pro arriving at warehouse'    },
  { id: 'EVT003', title: 'Team Weekly Standup',         date: '2024-12-04', time: '09:00', type: 'Meeting',  priority: 'Medium', assignee: 'S001', description: 'Weekly team sync — review targets and blockers'      },
  { id: 'EVT004', title: 'Q4 Performance Review',       date: '2024-12-15', time: '14:00', type: 'Review',   priority: 'High',   assignee: 'S002', description: 'End of year performance reviews for all staff'       },
  { id: 'EVT005', title: 'Christmas Sale Planning',     date: '2024-12-10', time: '11:00', type: 'Sale',     priority: 'High',   assignee: 'S002', description: 'Plan Christmas promotions and discount strategy'     },
  { id: 'EVT006', title: 'Inventory Audit',             date: '2024-12-08', time: '13:00', type: 'Inventory',priority: 'Medium', assignee: 'S004', description: 'Monthly inventory count and reconciliation'          },
  { id: 'EVT007', title: 'Customer Support Training',   date: '2024-12-06', time: '15:00', type: 'Training', priority: 'Medium', assignee: 'S003', description: 'New support ticket system training for team'          },
  { id: 'EVT008', title: 'MacBook Restock Reminder',    date: '2024-12-07', time: '09:00', type: 'Reminder', priority: 'Low',    assignee: 'S004', description: 'MacBook Pro stock running low — place reorder'        },
];

// ─── REMINDERS ───────────────────────────────────────────────
export const reminders = [
  { id: 'REM001', title: 'Restock Apple Watch Series 9', dueDate: '2024-12-05', status: 'Active',    priority: 'High',   assignee: 'S004', recurring: false },
  { id: 'REM002', title: 'Weekly Sales Report',           dueDate: '2024-12-06', status: 'Active',    priority: 'Medium', assignee: 'S005', recurring: true  },
  { id: 'REM003', title: 'Process Pending Returns',        dueDate: '2024-12-04', status: 'Overdue',   priority: 'High',   assignee: 'S003', recurring: false },
  { id: 'REM004', title: 'Update Product Descriptions',    dueDate: '2024-12-10', status: 'Active',    priority: 'Low',    assignee: 'S004', recurring: false },
  { id: 'REM005', title: 'Monthly Revenue Review',         dueDate: '2024-12-31', status: 'Active',    priority: 'Medium', assignee: 'S005', recurring: true  },
];

// ─── PERMISSIONS / ROLES ─────────────────────────────────────
export const roles = [
  { id: 'ROL001', name: 'Admin',   description: 'Full access to all modules',              staffCount: 1, permissions: ['dashboard','users','products','orders','analytics','messages','calendar','reports','security','performance','settings'] },
  { id: 'ROL002', name: 'Manager', description: 'Access to operations and reports',        staffCount: 2, permissions: ['dashboard','users','products','orders','analytics','messages','calendar','reports'] },
  { id: 'ROL003', name: 'Staff',   description: 'Limited access to assigned modules only', staffCount: 2, permissions: ['dashboard','messages','products'] },
];

// ─── API KEYS ─────────────────────────────────────────────────
export const apiKeys = [
  { id: 'KEY001', name: 'Shopify Integration',    key: 'nx_live_sk_1a2b3c4d5e6f',  created: '2024-01-15', lastUsed: '2 hours ago',    status: 'Active',   requests: 45230 },
  { id: 'KEY002', name: 'Analytics Dashboard',    key: 'nx_live_sk_7g8h9i0j1k2l',  created: '2024-03-20', lastUsed: '5 minutes ago',  status: 'Active',   requests: 128900},
  { id: 'KEY003', name: 'Email Service (SendGrid)',key: 'nx_live_sk_3m4n5o6p7q8r',  created: '2024-02-10', lastUsed: '1 day ago',      status: 'Active',   requests: 8920  },
  { id: 'KEY004', name: 'Payment Gateway',        key: 'nx_live_sk_9s0t1u2v3w4x',  created: '2023-11-05', lastUsed: '1 week ago',     status: 'Inactive', requests: 2340  },
  { id: 'KEY005', name: 'Mobile App (iOS)',        key: 'nx_live_sk_5y6z7a8b9c0d',  created: '2024-05-01', lastUsed: '3 hours ago',    status: 'Active',   requests: 67800 },
];

// ─── AUDIT LOGS ──────────────────────────────────────────────
export const auditLogs = [
  { id: 'LOG001', action: 'User Login',          user: 'John Doe',      module: 'Auth',     details: 'Successful login from 192.168.1.1',         time: '2 hours ago',   severity: 'Info'    },
  { id: 'LOG002', action: 'Product Updated',     user: 'Emily Davis',   module: 'Products', details: 'Updated stock for iPhone 15 Pro (P001)',     time: '3 hours ago',   severity: 'Info'    },
  { id: 'LOG003', action: 'Order Cancelled',     user: 'Sarah Wilson',  module: 'Orders',   details: 'Order ORD-1005 cancelled by manager',       time: '5 hours ago',   severity: 'Warning' },
  { id: 'LOG004', action: 'Failed Login Attempt',user: 'Unknown',       module: 'Auth',     details: '3 failed attempts from IP 203.45.12.89',    time: '6 hours ago',   severity: 'Critical'},
  { id: 'LOG005', action: 'API Key Generated',   user: 'John Doe',      module: 'Security', details: 'New API key created for Mobile App (iOS)',   time: '1 day ago',     severity: 'Info'    },
  { id: 'LOG006', action: 'Staff Permission Changed', user: 'John Doe', module: 'Security', details: 'Mike Johnson role changed from Admin to Staff', time: '1 day ago',  severity: 'Warning' },
  { id: 'LOG007', action: 'Bulk Import',         user: 'Emily Davis',   module: 'Products', details: '15 new products imported via CSV',           time: '2 days ago',    severity: 'Info'    },
  { id: 'LOG008', action: 'Settings Changed',    user: 'John Doe',      module: 'Settings', details: 'Email notification settings updated',        time: '3 days ago',    severity: 'Info'    },
];

// ─── KRAs (Key Result Areas) ─────────────────────────────────
export const kras = [
  { id: 'KRA001', staffId: 'S002', staffName: 'Sarah Wilson',  title: 'Increase Monthly Orders by 20%',      target: 200,  current: 187, unit: 'orders',  deadline: '2024-12-31', status: 'On Track'  },
  { id: 'KRA002', staffId: 'S003', staffName: 'Mike Johnson',  title: 'Resolve 95% tickets within 24 hours', target: 95,   current: 88,  unit: '%',        deadline: '2024-12-31', status: 'At Risk'   },
  { id: 'KRA003', staffId: 'S004', staffName: 'Emily Davis',   title: 'Maintain stock accuracy above 98%',    target: 98,   current: 99,  unit: '%',        deadline: '2024-12-31', status: 'Achieved'  },
  { id: 'KRA004', staffId: 'S005', staffName: 'Robert Taylor', title: 'Deliver 4 analytics reports per month',target: 4,    current: 3,   unit: 'reports',  deadline: '2024-12-31', status: 'On Track'  },
  { id: 'KRA005', staffId: 'S002', staffName: 'Sarah Wilson',  title: 'Reduce return rate below 5%',          target: 5,    current: 6.2, unit: '%',        deadline: '2024-12-31', status: 'At Risk'   },
];

// ─── SUMMARY STATS (used by Dashboard) ───────────────────────
export const summaryStats = {
  totalRevenue:    45231.89,
  revenueChange:   '+20.1%',
  activeUsers:     2350,
  usersChange:     '+180.1%',
  totalOrders:     12234,
  ordersChange:    '+19%',
  conversionRate:  3.24,
  conversionChange:'-4.3%',
  totalProducts:   products.length,
  lowStockCount:   products.filter(p => p.stock > 0 && p.stock <= 10).length,
  outOfStockCount: products.filter(p => p.stock === 0).length,
  unreadMessages:  messages.filter(m => m.status === 'Unread').length,
  pendingOrders:   orders.filter(o => o.status === 'Processing').length,
};