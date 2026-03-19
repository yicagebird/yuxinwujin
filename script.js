// 全局放大图片函数
function openModal(imgSrc) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = imgSrc;
}

// 初始化产品页面（接收默认分类）
function initProductPage(defaultCategory) {
  // ========== 请修改这里的配置为你的实际图片数量 ==========
  const RESIN_TOTAL = 23;  // 树脂过油产品数量
  const NYLON_TOTAL = 30;   // 尼龙产品数量
  const WATER_TOTAL = 14;   // 防水产品数量
  // ======================================================

  // 生成产品数据
  const productList = [];
  // 树脂过油系列
  for (let i = 1; i <= RESIN_TOTAL; i++) {
    productList.push({
      id: `resin_${i}`,
      series: "树脂过油",
      fullName: `树脂过油系列${i}`,
      shortName: `树脂过油${i}`,
      img: `images/树脂过油_${i}.jpg` // 图片路径请对应你的实际路径
    });
  }
  // 尼龙系列
  for (let i = 1; i <= NYLON_TOTAL; i++) {
    productList.push({
      id: `nylon_${i}`,
      series: "尼龙",
      fullName: `尼龙系列${i}`,
      shortName: `尼龙${i}`,
      img: `images/尼龙_${i}.jpg`
    });
  }
  // 防水系列
  for (let i = 1; i <= WATER_TOTAL; i++) {
    productList.push({
      id: `water_${i}`,
      series: "防水",
      fullName: `防水系列${i}`,
      shortName: `防水${i}`,
      img: `images/防水_${i}.jpg`
    });
  }

  // 获取页面元素
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');
  const modal = document.getElementById("imgModal");
  const closeBtn = document.getElementsByClassName("close-btn")[0];
  const categoryBtns = document.querySelectorAll('.category-btn');
  let currentCategory = defaultCategory;

  // 处理URL中的搜索参数（首页跳转过来的搜索）
  const urlParams = new URLSearchParams(window.location.search);
  const searchFromHome = urlParams.get('search');
  if (searchFromHome) {
    input.value = decodeURIComponent(searchFromHome);
  }

  // 分类筛选函数
  function filterByCategory(products, category) {
    return category === 'all' ? products : products.filter(p => p.series === category);
  }

  // 搜索+分类联动函数（修复数字搜索）
  function showProducts() {
    const keyword = input.value.trim().toLowerCase();
    let filtered = filterByCategory(productList, currentCategory);
    
    // 关键词筛选：精准匹配数字/文字
    if (keyword) {
      // 提取纯数字（用于匹配序号）
      const numberOnly = keyword.replace(/[^0-9]/g, '');
      filtered = filtered.filter(p => {
        // 匹配产品名/简称/序号
        const matchShort = p.shortName.toLowerCase().includes(keyword);
        const matchFull = p.fullName.toLowerCase().includes(keyword);
        // 数字匹配：如果输入了数字，匹配产品序号
        const matchNumber = numberOnly ? p.fullName.includes(numberOnly) : false;
        
        return matchShort || matchFull || matchNumber;
      });
    }

    // 渲染产品
    renderProducts(filtered);
  }

  // 渲染产品列表
  function renderProducts(products) {
    if (products.length === 0) {
      results.innerHTML = '<div class="no-result">未找到相关产品</div>';
      return;
    }

    let html = '<div class="product-grid">';
    products.forEach(p => {
      html += `
        <div class="product-card">
          <img src="${p.img}" alt="${p.fullName}" class="product-img" onclick="openModal('${p.img}')">
          <div class="product-info">
            <div class="product-name">${p.fullName}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    results.innerHTML = html;
  }

  // 分类按钮事件
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.category;
      showProducts();
    });
  });

  // 弹窗关闭事件
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => e.target === modal && (modal.style.display = "none");
  document.onkeydown = (e) => e.key === "Escape" && modal.style.display === "flex" && (modal.style.display = "none");

  // 搜索事件（按钮+回车）
  btn.addEventListener('click', showProducts);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') showProducts();
  });

  // 初始化：选中默认分类并显示产品
  categoryBtns.forEach(btn => {
    if (btn.dataset.category === defaultCategory) {
      btn.classList.add('active');
    }
  });
  // 如果有首页过来的搜索参数，自动执行搜索
  if (searchFromHome) {
    showProducts();
  } else {
    showProducts();
  }
}