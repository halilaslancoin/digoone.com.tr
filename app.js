const STORAGE_KEY = 'digoone_posts_v1';
const ADMIN_SESSION_KEY = 'digoone_admin_auth_v1';

// Kimlik bilgileri hashlenmiş olarak tutulur (Kullanıcı adı: iamhiaslan | Şifre: Hasyek333)
const ADMIN_USER_HASH = '12d848a0c38764f9d9566eb62f98f4a6b48276c1f2e08710b9e933be224b04c8';
const ADMIN_PASS_HASH = '84c7c2fa7703095619929756665493a30816e636120464e362c52d2759128541';

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_POSTS;
let activeCategory = 'Tümü';
let searchQuery = '';

const featuredMainEl = document.getElementById('featuredMain');
const featuredSubEl = document.getElementById('featuredSub');
const featuredSectionEl = document.getElementById('featuredSection');
const latestGridEl = document.getElementById('latestGrid');
const postCountEl = document.getElementById('postCount');
const latestHeadingEl = document.getElementById('latestHeading');

// HTTP bağlantılarda da çalışabilen güvenli SHA-256 fonksiyonu
function sha256Fallback(str) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = '';
  const words = [];
  const asciiBitLength = str.length * 8;
  let hash = (sha256Fallback.h = sha256Fallback.h || []);
  const primeCounter = (sha256Fallback.k = sha256Fallback.k || []);
  let isPrime = primeCounter.length;
  const primes = {};

  for (let candidate = 2; isPrime < 64; candidate++) {
    if (!primes[candidate]) {
      for (let i = 0; i < 313; i += candidate) primes[i] = candidate;
      hash[isPrime] = (mathPow(candidate, 0.5) * maxWord) | 0;
      primeCounter[isPrime++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  str += '\x80';
  while ((str.length % 64) - 56) str += '\x00';
  for (let i = 0; i < str.length; i++) {
    const j = str.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (let j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    hash = hash.slice(0, 8);

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        primeCounter[i] +
        (w[i] = (i < 16) ? w[i] : (
          w[i - 16] +
          (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
          w[i - 7] +
          (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

async function computeHash(text) {
  if (window.crypto && window.crypto.subtle && window.isSecureContext) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return sha256Fallback(unescape(encodeURIComponent(text)));
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function updateAdminUI() {
  const loggedIn = isAdminLoggedIn();
  const editorBtn = document.getElementById('openEditorBtn');
  const exportLink = document.getElementById('exportLink');
  const adminLink = document.getElementById('adminToggleLink');

  if (editorBtn) editorBtn.style.display = loggedIn ? 'inline-block' : 'none';
  if (exportLink) exportLink.style.display = loggedIn ? 'inline' : 'none';
  if (adminLink) adminLink.textContent = loggedIn ? 'Admin Çıkış' : 'Admin Girişi';
}

function handleAdminClick(e) {
  e.preventDefault();
  if (isAdminLoggedIn()) {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    updateAdminUI();
  } else {
    document.getElementById('adminError').style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    openModal('adminModal');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
  renderPosts();
  setupEvents();
});

function setupEvents() {
  // Kategori Filtreleme
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderPosts();
    });
  });

  // Arama
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderPosts();
  });

  // Koyu Mod
  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').textContent = isDark ? 'Açık Mod' : 'Koyu Mod';
  });

  // Editor Açma
  document.getElementById('openEditorBtn').addEventListener('click', () => {
    if (!isAdminLoggedIn()) return;
    openModal('editorModal');
  });

  // Admin Giriş Formu
  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('adminUsername').value.trim();
    const passInput = document.getElementById('adminPassword').value;

    const userHash = await computeHash(userInput);
    const passHash = await computeHash(passInput);

    if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      closeModal('adminModal');
      updateAdminUI();
    } else {
      document.getElementById('adminError').style.display = 'block';
    }
  });

  // Yeni Yazı Formu
  document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn()) return;

    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const image = document.getElementById('postImage').value.trim() ||
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80';
    const featured = document.getElementById('postFeatured').checked;
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postBody').value.trim();

    const words = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(words / 180))} dk okuma`;
    const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    const newPost = {
      id: Date.now(),
      title,
      category,
      date: today,
      readTime,
      featured,
      image,
      excerpt,
      content
    };

    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    document.getElementById('postForm').reset();
    closeModal('editorModal');
    renderPosts();
  });
}

function createCardHTML(post) {
  return `
    <article class="post-card" onclick="openPost(${post.id})">
      <img src="${post.image}" alt="${post.title}" class="post-thumb" loading="lazy" />
      <div class="post-body">
        <div class="post-meta">
          <span>📅 ${post.date}</span>
          <span>⏱ ${post.readTime}</span>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-footer">
          <div class="author-mini">
            <span class="author-dot">d</span>
            <span>digoone Editör</span>
          </div>
          <span class="cat-tag">${post.category}</span>
        </div>
      </div>
    </article>
  `;
}

function renderPosts() {
  const isFiltered = activeCategory !== 'Tümü' || searchQuery !== '';

  if (!isFiltered) {
    featuredSectionEl.style.display = 'block';
    const featuredPosts = posts.filter(p => p.featured);

    if (featuredPosts.length > 0) {
      featuredMainEl.innerHTML = createCardHTML(featuredPosts[0]);
      featuredSubEl.innerHTML = featuredPosts.slice(1, 3).map(createCardHTML).join('');
    } else {
      featuredSectionEl.style.display = 'none';
    }
    latestHeadingEl.textContent = 'Güncel Yazılar';
  } else {
    featuredSectionEl.style.display = 'none';
    latestHeadingEl.textContent = activeCategory !== 'Tümü' ? `${activeCategory} Yazıları` : 'Arama Sonuçları';
  }

  const filtered = posts.filter(post => {
    const matchCat = activeCategory === 'Tümü' || post.category === activeCategory;
    const matchSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  postCountEl.textContent = `${filtered.length} yazı`;
  latestGridEl.innerHTML = filtered.length
    ? filtered.map(createCardHTML).join('')
    : '<p style="color:var(--text-muted)">Aradığınız kriterlere uygun yazı bulunamadı.</p>';
}

function openPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const paragraphs = post.content
    .split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${p}</p>`)
    .join('');

  document.getElementById('readerContent').innerHTML = `
    <span class="cat-tag">${post.category}</span>
    <h1 class="reader-title">${post.title}</h1>
    <div class="post-meta">
      <span>📅 ${post.date}</span>
      <span>⏱ ${post.readTime}</span>
      <span>✍️ digoone Editör</span>
    </div>
    <img src="${post.image}" alt="${post.title}" class="reader-cover" />
    <div class="reader-text">${paragraphs}</div>
  `;
  openModal('readerModal');
}

function resetFilters() {
  activeCategory = 'Tümü';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === 'Tümü');
  });
  renderPosts();
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function exportPostsJS() {
  if (!isAdminLoggedIn()) return;
  const fileContent = `const INITIAL_POSTS = ${JSON.stringify(posts, null, 2)};\n`;
  const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.js';
  a.click();
  URL.revokeObjectURL(url);
}
