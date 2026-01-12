// Frontend JS: auth UI, hamburger menu, product modal, and API helpers
const API_BASE = 'http://127.0.0.1:5000';

/* Storage helpers */
function setToken(token){ localStorage.setItem('eshop_token', token); }
function getToken(){ return localStorage.getItem('eshop_token'); }
function clearToken(){ localStorage.removeItem('eshop_token'); }
function setUser(u){ localStorage.setItem('eshop_user', JSON.stringify(u)); }
function getUser(){ const s = localStorage.getItem('eshop_user'); return s ? JSON.parse(s) : null; }
function clearUser(){ localStorage.removeItem('eshop_user'); }

/* API wrapper */
async function apiFetch(path, opts = {}){
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, {...opts, headers});
  if(res.status === 401){ clearToken(); clearUser(); }
  return res;
}

/* Auth */
async function login(email, password){
  const res = await apiFetch('/api/auth/login', {method: 'POST', body: JSON.stringify({email, password})});
  const data = await res.json();
  if(res.ok && data.access_token){ setToken(data.access_token); setUser(data.user); updateNavUser(); return {ok:true, user:data.user}; }
  return {ok:false, msg: data.msg || 'login failed'};
}

async function signup(username, email, password){
  const res = await apiFetch('/api/auth/signup', {method: 'POST', body: JSON.stringify({username, email, password})});
  const data = await res.json();
  return {ok: res.ok, data};
}

/* Products */
async function fetchProducts(){
  const res = await apiFetch('/api/products/');
  if(!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
async function fetchProduct(id){
  const res = await apiFetch(`/api/products/${id}`);
  if(!res.ok) throw new Error('Product not found');
  return await res.json();
}

/* UI helpers */
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

function productCardHTML(p){
  return `
    <article class="product-card" data-id="${p.id}">
      <img src="${p.image || 'image1.jpeg'}" alt="${escapeHTML(p.title)}">
      <h3>${escapeHTML(p.title)}</h3>
      <p>${escapeHTML(p.description || '')}</p>
      <div class="price">$${Number(p.price).toFixed(2)}</div>
      <div class="product-actions">
        <a class="btn" href="#" data-buy="${p.id}">Buy</a>
        <button class="btn secondary" data-add="${p.id}">Add to cart</button>
      </div>
    </article>
  `;
}

function renderGrid(container, products){ container.innerHTML = products.map(productCardHTML).join('\n'); }

/* Modal for product details */
function openProductModal(product){
  const modal = document.createElement('div'); modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-inner" role="dialog" aria-modal="true">
      <img src="${product.image || 'image1.jpeg'}" alt="${escapeHTML(product.title)}">
      <div class="meta">
        <h2>${escapeHTML(product.title)}</h2>
        <p class="subtitle">${escapeHTML(product.description || '')}</p>
        <div class="price">$${Number(product.price).toFixed(2)}</div>
        <div style="margin-top:12px;"><button class="btn">Buy now</button> <button class="btn secondary" id="modal-add">Add to cart</button></div>
      </div>
      <button class="modal-close" aria-label="Close">✕</button>
    </div>
  `;
  document.body.appendChild(modal);
  // close handlers
  modal.querySelector('.modal-close').addEventListener('click', ()=> modal.remove());
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.remove(); });
  document.addEventListener('keydown', function esc(e){ if(e.key === 'Escape'){ modal.remove(); document.removeEventListener('keydown', esc); } });
}

/* Nav user UI */
function updateNavUser(){
  const user = getUser();
  const info = document.getElementById('user-info');
  const signupLink = document.getElementById('signup-link');
  if(!info) return;
  info.innerHTML = '';
  if(user){
    info.innerHTML = `<span style="margin-right:12px">${escapeHTML(user.username)}</span><button class="btn secondary" id="logout-btn">Logout</button>`;
    if(signupLink) signupLink.style.display = 'none';
    const out = document.getElementById('logout-btn');
    out && out.addEventListener('click', ()=>{ clearToken(); clearUser(); updateNavUser(); window.location.href = 'HOME.html'; });
  } else {
    if(signupLink) signupLink.style.display = '';
  }
}

/* Hamburger toggle */
function setupHamburger(){
  const hb = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if(!hb || !links) return;
  hb.addEventListener('click', ()=>{
    links.classList.toggle('mobile-open');
  });
}

/* Active nav link */
function setActiveNav(){
  const path = location.pathname.split('/').pop() || 'HOME.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (href === 'HOME.html' && path === ''));
  });
}

/* Delegated product click to open modal */
function setupProductClicks(){
  document.body.addEventListener('click', async (e)=>{
    const card = e.target.closest('.product-card');
    if(card){
      const id = card.getAttribute('data-id');
      try{ const p = await fetchProduct(id); openProductModal(p); } catch(err){ console.error(err); }
      return;
    }
    // handle add to cart or buy actions (demo)
    if(e.target.matches('[data-add]')){ alert('Add to cart (demo)'); }
    if(e.target.matches('[data-buy]')){ alert('Buy flow not implemented in demo'); }
  });
}

/* Page init */
window.addEventListener('DOMContentLoaded', async ()=>{
  try{
    setActiveNav();
    updateNavUser();
    setupHamburger();
    setupProductClicks();

    const featuredGrid = document.getElementById('featured-grid');
    if(featuredGrid){ const products = await fetchProducts(); renderGrid(featuredGrid, products.slice(0,3)); }

    const productsGrid = document.getElementById('products-grid');
    if(productsGrid){ const products = await fetchProducts(); renderGrid(productsGrid, products); }

    const loginForm = document.getElementById('login-form');
    if(loginForm){
      loginForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const r = await login(email, password);
        if(r.ok){ window.location.href = 'HOME.html'; } else { alert(r.msg || 'Login failed'); }
      });
    }

    const signupForm = document.getElementById('signup-form');
    if(signupForm){
      signupForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const r = await signup(username, email, password);
        if(r.ok){ alert('Account created — you can now log in'); window.location.href = 'LOGIN SIGNUP.html'; }
        else{ alert(r.data?.msg || 'Signup failed'); }
      });
    }

  }catch(err){ console.error(err); }
});
