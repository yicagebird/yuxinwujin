function openModal(imgSrc) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = imgSrc;
}

function initProductPage(defaultCategory) {
  const RESIN_TOTAL = 200;
  const NYLON_TOTAL = 30;
  const WATER_TOTAL = 14;

  const productList = [];

  for (let i = 1; i <= RESIN_TOTAL; i++) {
    productList.push({
      id: "resin_" + i,
      series: "树脂过油",
      fullName: "树脂过油系列" + i,
      shortName: "树脂过油" + i,
      img: "images/树脂过油_" + i + ".jpg"
    });
  }
  for (let i = 1; i <= NYLON_TOTAL; i++) {
    productList.push({
      id: "nylon_" + i,
      series: "尼龙",
      fullName: "尼龙系列" + i,
      shortName: "尼龙" + i,
      img: "images/尼龙_" + i + ".jpg"
    });
  }
  for (let i = 1; i <= WATER_TOTAL; i++) {
    productList.push({
      id: "water_" + i,
      series: "防水",
      fullName: "防水系列" + i,
      shortName: "防水" + i,
      img: "images/防水_" + i + ".jpg"
    });
  }

  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');
  const categoryBtns = document.querySelectorAll('.category-btn');
  let currentCategory = defaultCategory;

  const urlParams = new URLSearchParams(window.location.search);
  const searchKw = urlParams.get('search');
  if (searchKw) input.value = searchKw;

  // ========== 搜索逻辑已修复 ==========
  function showProducts() {
    const kw = input.value.trim().toLowerCase();
    let filtered = productList;

    // 1. 先按当前分类筛选
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.series === currentCategory);
    }

    // 2. 精准搜索：必须完整包含你输入的内容
    if (kw) {
      filtered = filtered.filter(p => {
        const full = p.fullName.toLowerCase();
        const short = p.shortName.toLowerCase();
        return full.includes(kw) || short.includes(kw);
      });
    }

    if (filtered.length === 0) {
      results.innerHTML = '<div class="no-result">未找到产品</div>';
      return;
    }

    let html = '<div class="product-grid">';
    filtered.forEach(p => {
      html += `
        <div class="product-card">
          <img loading="lazy" class="product-img" src="${p.img}" alt="${p.fullName}" onclick="openModal('${p.img}')">
          <div class="product-info">
            <div class="product-name">${p.fullName}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    results.innerHTML = html;
  }

  categoryBtns.forEach(b => {
    b.addEventListener('click', () => {
      categoryBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentCategory = b.dataset.category;
      showProducts();
    });
  });

  btn.addEventListener('click', showProducts);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') showProducts();
  });

  categoryBtns.forEach(b => {
    if (b.dataset.category === defaultCategory) b.classList.add('active');
  });

  showProducts();

  document.querySelector('.close-btn').onclick = () => {
    document.getElementById("imgModal").style.display = "none";
  };
  window.onclick = e => {
    if (e.target === document.getElementById("imgModal")) {
      document.getElementById("imgModal").style.display = "none";
    }
  };
}