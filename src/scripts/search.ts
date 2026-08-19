/** 站内搜索：顶栏按钮打开弹层，首次打开才懒加载 Pagefind UI */

const btn = document.getElementById('search-btn');
const modal = document.getElementById('search-modal');
let loaded = false;

function openModal() {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  loadUI();
  // 等待 UI 挂载后聚焦输入框
  setTimeout(() => {
    modal.querySelector('input')?.focus();
  }, 120);
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

function loadUI() {
  if (loaded) return;
  loaded = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pagefind/pagefind-ui.css';
  document.head.appendChild(link);

  const s = document.createElement('script');
  s.src = '/pagefind/pagefind-ui.js';
  s.onload = () => {
    new (window as unknown as { PagefindUI: new (o: unknown) => unknown }).PagefindUI({
      element: '#search',
      showSubResults: true,
      showImages: false,
      translations: {
        placeholder: '搜索本站…',
        zero_results: '没有找到结果',
        many_results: '找到 {x} 个结果',
        one_result: '找到 1 个结果',
        searching: '搜索中…',
        load_more: '加载更多',
      },
    });
  };
  document.body.appendChild(s);
}

btn?.addEventListener('click', openModal);
modal?.querySelector('[data-close-search]')?.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
