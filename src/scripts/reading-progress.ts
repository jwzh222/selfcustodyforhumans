/** 阅读进度条：挂在内容区（.content）滚动容器上 */

const bar = document.getElementById('reading-progress');
const scroller = document.getElementById('content');

if (bar && scroller) {
  const update = () => {
    const max = scroller.scrollHeight - scroller.clientHeight;
    const pct = max > 0 ? (scroller.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  scroller.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
