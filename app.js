const STORAGE_KEY = 'digoone_posts_v1';
let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_POSTS;
let activeCategory = 'Tümü';
let searchQuery = '';

// Elementler
const featuredMainEl = document.getElementById('featuredMain');
const featuredSubEl = document.getElementById('featuredSub');
const featuredSectionEl = document.getElementById('featuredSection');
const latestGridEl = document.getElementById('latestGrid');
const postCountEl = document.getElementById('postCount');
const latestHeadingEl = document.getElementById('latestHeading');

// Başlangıç
document.addEventListener('DOMContentLoaded', () => {
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
    openModal('editorModal');
  });

  // Yeni Yazı Formu
  document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
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

  // Öne çıkanlar sadece ana görünümdeyken gösterilir
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

// Git reposuna yüklemek üzere güncel posts.js dosyasını indirir
function exportPostsJS() {
  const fileContent = `const INITIAL_POSTS = ${JSON.stringify(posts, null, 2)};\n`;
  const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.js';
  a.click();
  URL.revokeObjectURL(url);
}
