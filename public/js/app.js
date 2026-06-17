var API = window.API || '/api';
let currentUser = null;
let currentPage = 1;
let currentAdminSection = 'dashboard';
let productQty = 1;
let cartItems = [];

// ─── UTILS ──────────────────────────────────────────────────────────────────

function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast'; }, 3200);
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 
    'Content-Type': 'application/json', 
    ...(token ? { Authorization: `Bearer ${token}` } : {}), 
    ...options.headers 
  };
  const res = await fetch(API + url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Request failed');
  }
  return data;
}

function statusBadge(status) {
  return `<span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

function formatPrice(n) { return '$' + Number(n).toFixed(2); }

function productEmoji(category = '') {
  const map = {
    electronics: '[E]', clothing: '[C]', shoes: '[S]', books: '[B]',
    food: '[F]', beauty: '[B]', sports: '[S]', toys: '[T]', home: '[H]', jewelry: '[J]'
  };
  return map[category.toLowerCase()] || '[P]';
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    const imgurl = parsed.searchParams.get('imgurl');
    if (imgurl) return decodeURIComponent(imgurl);
  } catch (_) {}

  const match = trimmed.match(/[?&]imgurl=([^&]+)/i);
  if (match) {
    try { return decodeURIComponent(match[1]); } catch (_) {}
  }

  return trimmed;
}

function getProductImageUrl(product) {
  return normalizeImageUrl(product?.imageUrl || product?.imageURL || product?.image || product?.img || '');
}

// ─── PAGE ROUTING ────────────────────────────────────────────────────────────

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById('page-' + name);
  if (pageEl) pageEl.classList.add('active');
  if (name === 'products') loadProducts();
  if (name === 'cart') loadCart();
  if (name === 'myOrders') loadMyOrders();
  if (name === 'admin') { adminSection(currentAdminSection); }
  if (name === 'checkout') prepareCheckout();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

function updateNav() {
  const loggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  document.getElementById('loginLink').style.display = loggedIn ? 'none' : '';
  document.getElementById('registerLink').style.display = loggedIn ? 'none' : '';
  document.getElementById('logoutLink').style.display = loggedIn ? '' : 'none';
  document.getElementById('cartLink').style.display = (loggedIn && !isAdmin) ? '' : 'none';
  document.getElementById('ordersLink').style.display = (loggedIn && !isAdmin) ? '' : 'none';
  document.getElementById('adminLink').style.display = isAdmin ? '' : 'none';
  document.getElementById('userGreeting').textContent = loggedIn ? `👤 ${currentUser.name}` : '';
}

async function login() {
  const identifier = document.getElementById('loginIdentifier').value.trim();
  const passwordField = document.getElementById('loginPassword');
  const password = passwordField.value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      currentUser = data.user;

      document.getElementById('loginIdentifier').value = '';
      passwordField.value = '';

      updateNav();
      await refreshCartCount();

      toast('Logged in successfully!', 'success');

      showPage('products');
    } else {
      passwordField.value = '';
      toast(data.message || 'Invalid email/username or password.', 'error');
    }
  } catch (err) {
    passwordField.value = '';
    console.error(err);
    toast('Network error during login.', 'error');
  }
}

async function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  try {
    const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    updateNav();
    toast('Account created!', 'success');
    showPage('products');
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function logout() {
  try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (_) {}
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  cartItems = [];
  updateNav();
  updateCartCount();
  toast('Logged out.', 'info');
  showPage('products');
}

async function tryAutoLogin() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const data = await apiFetch('/auth/me');
    currentUser = data.user;
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    updateNav();
  } catch (_) {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        currentUser = JSON.parse(cachedUser);
        updateNav();
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      localStorage.removeItem('token');
    }
  }
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

async function loadProducts(page = 1) {
  currentPage = page;
  const search = document.getElementById('searchInput')?.value || '';
  const category = document.getElementById('categoryFilter')?.value || '';
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="spinner"></div>';
  try {
    let url = `/products?page=${page}&limit=12`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    const data = await apiFetch(url);
    renderProducts(data);
    renderPagination(data.page, data.pages);
    loadCategories();
  } catch (err) {
    grid.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function renderProducts(data) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  if (!data.products.length) {
    grid.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }
  grid.innerHTML = data.products.map(p => {
    const imgSource = getProductImageUrl(p);
    return `
      <div class="product-card" onclick="viewProduct('${p._id}')">
        <div class="product-card-img">
          ${imgSource ? `<img src="${imgSource}" alt="${p.name}" style="display:block; width:100%; height:100%; object-fit:cover; border-radius:8px;" onerror="this.parentElement.innerHTML='${productEmoji(p.category)}'">` : productEmoji(p.category)}
        </div>
        <div class="product-card-body">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-cat">${p.category}</div>
          <div class="product-card-price">${formatPrice(p.price)}</div>
          <div class="product-card-stock ${p.stockQuantity === 0 ? 'out-of-stock' : ''}">
            ${p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Out of stock'}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function loadCategories() {
  try {
    const sel = document.getElementById('categoryFilter');
    if (!sel) return;

    // Fetch categories from API (works for public - no auth required)
    const data = await apiFetch('/categories').catch(() => null);
    if (!data || !data.categories || data.categories.length === 0) return;

    const current = sel.value;
    sel.innerHTML = '<option value="">All Categories</option>' +
      data.categories.map(c => `<option value="${c.name}" ${c.name === current ? 'selected' : ''}>${c.name}</option>`).join('');
  } catch (_) {}
}

function searchProducts() {
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(() => loadProducts(1), 300);
}

function renderPagination(page, pages) {
  const el = document.getElementById('pagination');
  if (!el) return;
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="${i === page ? 'active' : ''}" onclick="loadProducts(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

async function viewProduct(id) {
  showPage('productDetail');
  const el = document.getElementById('productDetailContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  productQty = 1;
  try {
    const data = await apiFetch(`/products/${id}`);
    const p = data.product;
    
    const imgSource = getProductImageUrl(p);

    el.innerHTML = `
      <button class="btn btn-outline btn-sm back-btn" onclick="showPage('products')">← Back</button>
      <div class="product-detail">
        <div class="product-detail-img">
          ${imgSource ? `<img src="${imgSource}" alt="${p.name}" style="display:block; width:100%; height:100%; object-fit:cover; border-radius:12px;" onerror="this.parentElement.innerHTML='${productEmoji(p.category)}'">` : productEmoji(p.category)}
        </div>
        <div class="product-detail-info">
          <h2>${p.name}</h2>
          <div class="product-detail-cat">${p.category}</div>
          <div class="product-detail-price">${formatPrice(p.price)}</div>
          <div class="product-detail-desc">${p.description || 'No description available.'}</div>
          <div class="product-card-stock ${p.stockQuantity === 0 ? 'out-of-stock' : ''}">
            ${p.stockQuantity > 0 ? `${p.stockQuantity} units available` : 'Out of stock'}
          </div>
          ${p.stockQuantity > 0 && currentUser?.role === 'customer' ? `
            <div class="quantity-control" style="margin-top:1rem">
              <button onclick="changeQty(-1)">−</button>
              <span id="qtyDisplay">1</span>
              <button onclick="changeQty(1)">+</button>
            </div>
            <button class="btn btn-primary" onclick="addToCart('${p._id}', '${p.name}')">Add to Cart</button>
          ` : ''}
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function changeQty(delta) {
  productQty = Math.max(1, productQty + delta);
  const qtyDisplay = document.getElementById('qtyDisplay');
  if (qtyDisplay) qtyDisplay.textContent = productQty;
}

// ─── CART ────────────────────────────────────────────────────────────────────

async function addToCart(productId) {
  if (!currentUser) { toast('Please log in first.', 'error'); showPage('login'); return; }
  try {
    await apiFetch('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: productQty }) });
    toast('Added to cart!', 'success');
    await refreshCartCount();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function refreshCartCount() {
  if (!currentUser || currentUser.role !== 'customer') return;
  try {
    const data = await apiFetch('/cart');
    cartItems = data.cart?.items || [];
    const count = cartItems.reduce((s, i) => s + i.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = count;
  } catch (_) {}
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = 0;
}

async function loadCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/cart');
    cartItems = data.cart?.items || [];
    renderCart();
  } catch (err) {
    el.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;
  if (!cartItems.length) {
    el.innerHTML = '<p class="empty-state">Your cart is empty. <a href="#" onclick="showPage(\'products\')">Browse products</a></p>';
    return;
  }
  const total = cartItems.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  el.innerHTML = cartItems.map(item => {
    const p = item.productId;
    if (!p) return '';
    const imgSource = getProductImageUrl(p);
    return `
      <div class="cart-item">
        <div class="cart-item-icon">
          ${imgSource ? `<img src="${imgSource}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" onerror="this.parentElement.innerHTML='${productEmoji(p.category)}'">` : productEmoji(p.category)}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${formatPrice(p.price)} × ${item.quantity} = ${formatPrice(p.price * item.quantity)}</div>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <button class="btn btn-outline btn-sm" onclick="updateQty('${p._id}', ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button class="btn btn-outline btn-sm" onclick="updateQty('${p._id}', ${item.quantity + 1})">+</button>
          <button class="btn btn-danger btn-sm" onclick="removeItem('${p._id}')">✕</button>
        </div>
      </div>
    `;
  }).join('') + `
    <div class="cart-total">
      <span class="cart-total-label">Total</span>
      <span class="cart-total-amount">${formatPrice(total)}</span>
    </div>
    <div style="display:flex;gap:0.8rem;margin-top:1rem">
      <button class="btn btn-primary" onclick="showPage('checkout')">Checkout</button>
      <button class="btn btn-outline" onclick="showPage('products')">Continue Shopping</button>
    </div>
  `;
}

async function updateQty(productId, qty) {
  try {
    await apiFetch(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity: qty }) });
    await loadCart();
    refreshCartCount();
  } catch (err) { toast(err.message, 'error'); }
}

async function removeItem(productId) {
  try {
    await apiFetch(`/cart/${productId}`, { method: 'DELETE' });
    await loadCart();
    refreshCartCount();
  } catch (err) { toast(err.message, 'error'); }
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────

function prepareCheckout() {
  const el = document.getElementById('checkoutSummary');
  if (!el) return;
  if (!cartItems.length) { showPage('cart'); return; }
  let html = '';
  let total = 0;
  cartItems.forEach(item => {
    const p = item.productId;
    if (!p) return;
    const subtotal = p.price * item.quantity;
    total += subtotal;
    html += `<div><span>${p.name} × ${item.quantity}</span><span>${formatPrice(subtotal)}</span></div>`;
  });
  html += `<div><span>Total</span><span>${formatPrice(total)}</span></div>`;
  el.innerHTML = html;
}

async function placeOrder() {
  const address = document.getElementById('shippingAddress').value.trim();
  if (!address) { toast('Please enter a shipping address.', 'error'); return; }
  if (!cartItems.length) { toast('Cart is empty.', 'error'); return; }
  
  if (!currentUser) {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try { currentUser = JSON.parse(cachedUser); } catch (_) {}
    }
  }

  if (!currentUser || (!currentUser._id && !currentUser.id)) { 
    toast('You must be logged in to place an order.', 'error'); 
    return; 
  }

  const userId = currentUser._id || currentUser.id;

  const items = cartItems.map(i => ({ 
    productId: i.productId?._id || i.productId?.id || i.productId, 
    quantity: i.quantity 
  }));

  const payload = {
    items,
    shippingAddress: address,
    createdBy: userId,
    customerId: userId,
    user: userId,
    userId: userId
  };

  try {
    await apiFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });
    cartItems = [];
    updateCartCount();
    toast('Order placed successfully!', 'success');
    showPage('myOrders');
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ─── MY ORDERS ───────────────────────────────────────────────────────────────

async function loadMyOrders() {
  const el = document.getElementById('myOrdersContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/orders/my-orders');
    if (!data.orders || !data.orders.length) {
      el.innerHTML = '<p class="empty-state">No orders yet. <a href="#" onclick="showPage(\'products\')">Start shopping</a></p>';
      return;
    }
    el.innerHTML = data.orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">Order #${o._id.slice(-8).toUpperCase()}</span>
          ${statusBadge(o.status)}
        </div>
        <ul class="order-items">
          ${o.items.map(i => `<li>${i.productName || i.productId?.name || 'Product'} × ${i.quantity} — ${formatPrice((i.priceAtOrder || i.price || 0) * i.quantity)}</li>`).join('')}
        </ul>
        <div class="order-total">Total: ${formatPrice(o.totalAmount || o.total || 0)}</div>
        <div class="order-address">📍 ${o.shippingAddress}</div>
        <div style="font-size:0.77rem;color:var(--text-muted);margin-top:0.3rem">${new Date(o.createdAt).toLocaleDateString()}</div>
      </div>
    `).join('');
  } catch (err) {
    el.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

function adminSection(name) {
  currentAdminSection = name;
  document.querySelectorAll('.admin-nav').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById(`anav-${name}`);
  if (navEl) navEl.classList.add('active');
  if (name === 'dashboard') loadAdminDashboard();
  else if (name === 'products') loadAdminProducts();
  else if (name === 'orders') loadAdminOrders();
  else if (name === 'users') loadAdminUsers();
  else if (name === 'categories') loadAdminCategories();
}

async function loadAdminDashboard() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/admin/dashboard');
    const s = data.stats;
    el.innerHTML = `
      <h2 style="margin-bottom:1.2rem">Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-value">${s.totalOrders}</div></div>
        <div class="stat-card"><div class="stat-label">Revenue</div><div class="stat-value">${formatPrice(s.totalRevenue)}</div></div>
        <div class="stat-card"><div class="stat-label">Products</div><div class="stat-value">${s.totalProducts}</div></div>
        <div class="stat-card"><div class="stat-label">Customers</div><div class="stat-value">${s.totalCustomers}</div></div>
      </div>
      <div class="section-title">Pending Orders <span class="pending-badge">${data.pendingOrders.length}</span></div>
      ${data.pendingOrders.length ? data.pendingOrders.map(o => `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">#${o._id.slice(-8).toUpperCase()}</span>
            <span>${o.customerId?.name || 'Unknown'} — ${o.customerId?.email || ''}</span>
            ${statusBadge(o.status)}
          </div>
          <ul class="order-items">${o.items.map(i => `<li>${i.productName || i.productId?.name || 'Product'} × ${i.quantity}</li>`).join('')}</ul>
          <div class="order-total">${formatPrice(o.totalAmount || o.total || 0)}</div>
          <div style="margin-top:0.6rem;display:flex;gap:0.5rem">
            <button class="btn btn-primary btn-sm" onclick="quickStatus('${o._id}','processing')">Accept</button>
            <button class="btn btn-danger btn-sm" onclick="quickStatus('${o._id}','cancelled')">Cancel</button>
          </div>
        </div>
      `).join('') : '<p class="empty-state">No pending orders.</p>'}
      <div class="section-title" style="margin-top:1.5rem">Recent Orders</div>
      ${data.recentOrders.map(o => `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">#${o._id.slice(-8).toUpperCase()}</span>
            <span style="font-size:0.85rem">${o.customerId?.name || ''}</span>
            ${statusBadge(o.status)}
            <span class="order-total">${formatPrice(o.totalAmount || o.total || 0)}</span>
          </div>
        </div>
      `).join('')}
    `;
  } catch (err) {
    el.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

async function quickStatus(orderId, status) {
  try {
    await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast(`Order ${status}`, 'success');
    loadAdminDashboard();
  } catch (err) { toast(err.message, 'error'); }
}

async function loadAdminProducts() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
let url = '/products?limit=50';
    const searchInput = document.getElementById('adminProductSearchInput');
    const search = searchInput ? searchInput.value.trim() : '';
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const data = await apiFetch(url);
    el.innerHTML = `
      <div class="section-header">
        <h2>Products</h2>
        <button class="btn btn-primary btn-sm" onclick="openProductModal()">+ Add Product</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${data.products.map(p => {
            const secureProductData = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
            return `
            <tr>
              <td>${p.name}</td>
              <td>${p.category}</td>
              <td>${formatPrice(p.price)}</td>
              <td>${p.stockQuantity}</td>
              <td>${p.isActive ? '<span class="status-badge status-delivered">Active</span>' : '<span class="status-badge status-cancelled">Inactive</span>'}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openProductModal(JSON.parse('${secureProductData}'))">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}')">Delete</button>
              </td>
            </tr>
            `;
          }).join('')}</tbody>
        </table>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function adminSearchProducts() {
  clearTimeout(window._adminProductSearchTimer);
  window._adminProductSearchTimer = setTimeout(() => loadAdminProducts(), 250);
}

function openProductModal(product = null) {
  const isEdit = !!product;
  const imgSource = product ? getProductImageUrl(product) : '';

  document.getElementById('modalContent').innerHTML = `
    <h3>${isEdit ? 'Edit' : 'Add'} Product</h3>
    <div class="form-group"><label>Name</label><input id="pName" value="${product?.name || ''}"/></div>
    <div class="form-group"><label>Category</label><input id="pCat" value="${product?.category || ''}"/></div>
    <div class="form-group"><label>Price</label><input id="pPrice" type="number" min="0" step="0.01" value="${product?.price || ''}"/></div>
    <div class="form-group"><label>Stock Quantity</label><input id="pStock" type="number" min="0" value="${product?.stockQuantity ?? ''}"/></div>
    <div class="form-group"><label>Image URL <span style="font-weight:normal;color:var(--text-muted)">(paste a direct image link, not a Google search page)</span></label><input id="pImg" value="${imgSource}"/></div>
    <div class="form-group"><label>Description</label><textarea id="pDesc" rows="3">${product?.description || ''}</textarea></div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveProduct('${product?._id || ''}')">${isEdit ? 'Update' : 'Create'}</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveProduct(id) {
  const imgValue = normalizeImageUrl(document.getElementById('pImg').value);
  const body = {
    name: document.getElementById('pName').value.trim(),
    category: document.getElementById('pCat').value.trim(),
    price: parseFloat(document.getElementById('pPrice').value),
    stockQuantity: parseInt(document.getElementById('pStock').value),
    imageUrl: imgValue,
    imageURL: imgValue,
    image: imgValue,
    img: imgValue,
    description: document.getElementById('pDesc').value.trim()
  };

  try {
    if (id) {
      await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await apiFetch('/products', { method: 'POST', body: JSON.stringify(body) });
    }
    closeModal();
    toast(id ? 'Product updated.' : 'Product created.', 'success');
    loadAdminProducts();
  } catch (err) { 
    toast(err.message, 'error'); 
  }
}

async function deleteProduct(id) {
  if (!confirm('Remove this product?')) return;
  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    toast('Product removed.', 'success');
    loadAdminProducts();
  } catch (err) { toast(err.message, 'error'); }
}

async function loadAdminOrders() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/orders?limit=50');
    el.innerHTML = `
      <div class="section-header"><h2>All Orders</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>${data.orders.map(o => `
            <tr>
              <td class="order-id">#${o._id.slice(-8).toUpperCase()}</td>
              <td>${o.customerId?.name || 'N/A'}<br><small style="color:var(--text-muted)">${o.customerId?.email || ''}</small></td>
              <td>${o.items.map(i => `${i.productName || i.productId?.name || 'Product'} ×${i.quantity}`).join(', ')}</td>
              <td>${formatPrice(o.totalAmount || o.total || 0)}</td>
              <td>${statusBadge(o.status)}</td>
              <td style="font-size:0.8rem">${new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <select onchange="updateOrderStatus('${o._id}', this.value)" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:5px;padding:4px 6px;font-size:0.8rem">
                  ${['pending','processing','shipped','delivered','cancelled'].map(s =>
                    `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
                  ).join('')}
                </select>
              </td>
            </tr>
            `).join('')}</tbody>
        </table>
      </div>
    `;
  } catch (err) { el.innerHTML = `<p class="empty-state">${err.message}</p>`; }
}

async function updateOrderStatus(id, status) {
  try {
    await apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast('Status updated.', 'success');
  } catch (err) { toast(err.message, 'error'); }
}

async function loadAdminUsers() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/admin/users');
    el.innerHTML = `
      <div class="section-header"><h2>Customers</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
          <tbody>${data.users.map(u => `
            <tr>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>${u.isActive ? '<span class="status-badge status-delivered">Active</span>' : '<span class="status-badge status-cancelled">Blocked</span>'}</td>
              <td style="font-size:0.8rem">${new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}"
                  onclick="toggleUser('${u._id}', ${!u.isActive})">
                  ${u.isActive ? 'Block' : 'Unblock'}
                </button>
              </td>
            </tr>
            `).join('')}</tbody>
        </table>
      </div>
    `;
  } catch (err) { el.innerHTML = `<p class="empty-state">${err.message}</p>`; }
}

async function toggleUser(id, isActive) {
  try {
    await apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify({ isActive }) });
    toast(`User ${isActive ? 'unblocked' : 'blocked'}.`, 'success');
    loadAdminUsers();
  } catch (err) { toast(err.message, 'error'); }
}

async function loadAdminCategories() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  el.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await apiFetch('/admin/categories');
    el.innerHTML = `
      <div class="section-header">
        <h2>Categories</h2>
        <button class="btn btn-primary btn-sm" onclick="openCategoryModal()">+ Add Category</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>${data.categories.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.description || '—'}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick='openCategoryModal(${JSON.stringify(c)})'>Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory('${c._id}')">Delete</button>
              </td>
            </tr>
            `).join('')}</tbody>
        </table>
      </div>
    `;
  } catch (err) { el.innerHTML = `<p class="empty-state">${err.message}</p>`; }
}

function openCategoryModal(cat = null) {
  document.getElementById('modalContent').innerHTML = `
    <h3>${cat ? 'Edit' : 'Add'} Category</h3>
    <div class="form-group"><label>Name</label><input id="cName" value="${cat?.name || ''}"/></div>
    <div class="form-group"><label>Description</label><input id="cDesc" value="${cat?.description || ''}"/></div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCategory('${cat?._id || ''}')">${cat ? 'Update' : 'Create'}</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveCategory(id) {
  const name = document.getElementById('cName').value.trim();
  const description = document.getElementById('cDesc').value.trim();
  try {
    if (id) await apiFetch(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name, description }) });
    else await apiFetch('/admin/categories', { method: 'POST', body: JSON.stringify({ name, description }) });
    closeModal();
    toast('Category saved.', 'success');
    loadAdminCategories();
  } catch (err) { toast(err.message, 'error'); }
}

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  try {
    await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
    toast('Category deleted.', 'success');
    loadAdminCategories();
  } catch (err) { toast(err.message, 'error'); }
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

function closeModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) modal.classList.remove('open');
}

// ─── INIT ────────────────────────────────────────────────────────────────────

(async () => {
  await tryAutoLogin();
  await refreshCartCount();
  showPage('products');
})();