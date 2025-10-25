/* ===== Preflight: set theme before first paint (inline in <head>) =====
(function () {
  const KEY = "color-scheme";
  const saved = localStorage.getItem(KEY);
  const system = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = saved || system || "light";
  document.documentElement.setAttribute("data-color-scheme", theme);
})();
*/

/* ===== Main site behaviors ===== */
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  // THEME
  const KEY = "color-scheme";
  const themeToggleBtn = document.getElementById("theme-toggle");
  const getTheme = () => root.getAttribute("data-color-scheme") || "light";
  const setTheme = (t) => { root.setAttribute("data-color-scheme", t); localStorage.setItem(KEY, t); themeToggleBtn?.setAttribute("aria-pressed", t==="dark"); };
  setTheme(localStorage.getItem(KEY) || getTheme());
  themeToggleBtn?.addEventListener("click", () => setTheme(getTheme()==="light" ? "dark" : "light"));

  // MOBILE ISLAND PANEL
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobilePanel = document.getElementById("mobile-panel");
  const navbar = document.getElementById("site-navbar");

  function setPanelHeight(open){
    if(open){
      mobilePanel.style.maxHeight = "0px";
      requestAnimationFrame(()=>{ mobilePanel.style.maxHeight = mobilePanel.scrollHeight + "px"; });
    } else {
      mobilePanel.style.maxHeight = mobilePanel.scrollHeight + "px";
      requestAnimationFrame(()=>{ mobilePanel.style.maxHeight = "0px"; });
    }
  }
  function openPanel(){
    navbar.classList.add("is-open");
    mobilePanel.classList.add("is-open");
    mobilePanel.setAttribute("aria-hidden","false");
    document.body.classList.add("panel-open");
    mobileMenuToggle.setAttribute("aria-expanded","true");
    setPanelHeight(true);
  }
  function closePanel(){
    navbar.classList.remove("is-open");
    mobilePanel.classList.remove("is-open");
    mobilePanel.setAttribute("aria-hidden","true");
    document.body.classList.remove("panel-open");
    mobileMenuToggle.setAttribute("aria-expanded","false");
    setPanelHeight(false);
  }
  function togglePanel(){ mobilePanel.classList.contains("is-open") ? closePanel() : openPanel(); }

  mobileMenuToggle?.addEventListener("click", togglePanel);
  mobilePanel?.addEventListener("click", (e)=>{ if(e.target.closest("a")) closePanel(); });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape" && mobilePanel.classList.contains("is-open")) closePanel(); });
  const mq = window.matchMedia("(min-width: 992px)");
  mq.addEventListener?.("change", ()=>{ if(mq.matches) closePanel(); });

  // Ensure main content never hides under navbar (in case custom themes tweak heights)
  const main = document.querySelector(".site-main");
  if(main){
    const padTop = `calc(var(--nav-height) + var(--page-pad))`;
    main.style.paddingTop = padTop;
  }
});
