(async function () {
  await Layout.init("blog");
  const posts = await Store.list("posts").catch(() => []);
  Layout.$("#postGrid").innerHTML = posts.length ? posts.map(Layout.postCard).join("") : `<div class="empty">No updates yet.</div>`;
})();
