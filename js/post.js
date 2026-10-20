(async function () {
  const { esc, url, paragraphs, date } = BZ;
  const s = await Layout.init("blog");
  const id = BZ.param("id");
  const p = id ? await Store.get("posts", id).catch(() => null) : null;
  const el = Layout.$("#post");
  if (!p || p.status === "draft") {
    el.innerHTML = `<div class="empty"><h2>Post not found</h2><p><a class="btn btn-primary" href="blog.html">All updates</a></p></div>`;
    return;
  }
  document.title = `${p.title} | ${s.company}`;
  const link = url(p.link);
  el.innerHTML = `
    <a href="blog.html" class="back-link">← All updates</a>
    <article class="article">
      <span class="post-date">${date(p.created_at)}</span>
      <h1>${esc(p.title)}</h1>
      ${url(p.image) ? `<img class="article-img" src="${url(p.image)}" alt="${esc(p.title)}">` : ""}
      ${paragraphs(p.body || p.excerpt)}
      ${link ? `<p><a class="btn btn-primary" href="${link}" target="_blank" rel="noopener">${esc(p.link_label || "Open link")}</a></p>` : ""}
    </article>`;
})();
