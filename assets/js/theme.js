// 테마 토글 + localStorage 저장. index.html, post.html 공용.
// 기본은 네온 다크. 저장값이 없으면 prefers-color-scheme: light일 때만 라이트로 전환.
(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  // 이 블로그의 정체성은 네온 다크. 저장된 수동 선택만 존중하고 기본은 항상 다크.
  const stored = localStorage.getItem(STORAGE_KEY);
  applyTheme(stored === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  });
})();
