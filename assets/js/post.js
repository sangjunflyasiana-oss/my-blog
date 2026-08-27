// post.html 전용: ?post=<파일명> 쿼리로 지정된 글을 fetch해 렌더링한다.
(async function () {
  const root = document.getElementById("post-root");
  const filename = new URLSearchParams(window.location.search).get("post");

  if (!filename) {
    root.innerHTML = `<p class="error-state">글이 지정되지 않았습니다.</p>`;
    return;
  }

  try {
    const res = await fetch(`posts/${filename}`);
    if (!res.ok) throw new Error("not found");
    const raw = await res.text();
    const { meta, body } = parseFrontMatter(raw);

    document.title = `${meta.title || filename} · my-blog`;
    root.innerHTML = `
      <article>
        <header class="post-header">
          <h1>${escapeHtml(meta.title || filename)}</h1>
          ${meta.date ? `<span class="post-date">${escapeHtml(meta.date)}</span>` : ""}
        </header>
        ${renderMarkdownBody(body)}
      </article>
    `;
  } catch (err) {
    root.innerHTML = `<p class="error-state">글을 찾을 수 없습니다.</p>`;
  }
})();
