// index.html 전용: posts/index.json을 읽어 글 목록을 렌더링한다.
(async function () {
  const listEl = document.getElementById("post-list");

  let filenames;
  try {
    const res = await fetch("posts/index.json");
    if (!res.ok) throw new Error("manifest fetch failed");
    filenames = await res.json();
  } catch (err) {
    listEl.outerHTML = `<p class="error-state">글 목록을 불러오지 못했습니다. 정적 서버로 열었는지 확인해 주세요.</p>`;
    return;
  }

  if (!filenames.length) {
    listEl.outerHTML = `<p class="empty-state">아직 작성된 글이 없습니다.</p>`;
    return;
  }

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      try {
        const res = await fetch(`posts/${filename}`);
        const raw = await res.text();
        const { meta } = parseFrontMatter(raw);
        return {
          filename,
          title: meta.title || filename,
          date: meta.date || "",
        };
      } catch {
        return { filename, title: filename, date: "" };
      }
    })
  );

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  listEl.innerHTML = posts
    .map(
      (post) => `
        <li>
          <a href="post.html?post=${encodeURIComponent(post.filename)}">${escapeHtml(post.title)}</a>
          ${post.date ? `<span class="post-date">${escapeHtml(post.date)}</span>` : ""}
        </li>`
    )
    .join("");
})();
