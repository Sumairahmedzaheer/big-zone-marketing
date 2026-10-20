// Bigzone Marketing admin panel.
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const { esc, url, pkr, date } = BZ;

  const TYPES = ["House", "Apartment", "Plot", "Commercial", "Farmhouse"];
  const AREA_GROUPS = Store.KARACHI_AREA_GROUPS;
  const KARACHI_AREAS = AREA_GROUPS.flatMap(group => group.areas);

  // Form definitions for each kind of content
  const SCHEMAS = {
    listings: {
      label: "Listing", plural: "Listings", page: "property.html",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. 10 Marla Modern House", wide: true },
        { name: "purpose", label: "For", type: "select", options: [["Buy", "Sale"], ["Rent", "Rent"]] },
        { name: "type", label: "Property type", type: "select", options: TYPES },
        { name: "price", label: "Price (PKR)", type: "price", required: true, help: "Full amount in rupees. For rent, the monthly rent." },
        { name: "status", label: "Status", type: "select", options: [["published", "Published"], ["draft", "Draft (hidden)"], ["sold", "Sold / Rented"]] },
        { name: "city", label: "City", type: "select", options: [["Karachi", "Karachi"]], required: true },
        { name: "area_category", label: "Area category", type: "select", options: [["", "Select a category"], ...AREA_GROUPS.map(group => [group.name, group.name])] },
        { name: "area", label: "Area / Society", type: "text", list: KARACHI_AREAS, placeholder: "Choose a suggestion or type a new area" },
        { name: "size", label: "Size", type: "text", placeholder: "e.g. 10 Marla, 1 Kanal, 1,850 sq ft" },
        { name: "beds", label: "Bedrooms", type: "number" },
        { name: "baths", label: "Bathrooms", type: "number" },
        { name: "featured", label: "Show first on the home page (featured)", type: "checkbox", wide: true },
        { name: "images", label: "Photos", type: "images", wide: true, help: "The first photo is the cover. Upload several to show a gallery." },
        { name: "video_url", label: "Video link (YouTube, Facebook)", type: "url", wide: true, placeholder: "https://" },
        { name: "description", label: "Description", type: "textarea", rows: 6, wide: true },
      ],
      defaults: { purpose: "Buy", type: "House", status: "published", images: [], featured: false, beds: 0, baths: 0, price: 0 },
      thumb: r => (r.images || [])[0],
      sub: r => `${pkr(r.price)}${r.purpose === "Rent" ? "/mo" : ""} · ${[r.area, r.city].filter(Boolean).join(", ")} · ${r.type}`,
      search: r => [r.title, r.city, r.area, r.type, r.purpose].join(" "),
    },
    projects: {
      label: "Project", plural: "Projects", page: "index.html#projects",
      fields: [
        { name: "title", label: "Project name", type: "text", required: true, wide: true },
        { name: "category", label: "Category", type: "text", list: ["Apartments", "Commercial", "Housing Society", "Farmhouses"], placeholder: "e.g. Housing Society" },
      { name: "status", label: "Status", type: "select", options: [["published", "Published"], ["draft", "Draft (hidden)"]] },
      { name: "price", label: "Starting price (PKR)", type: "price", help: "Optional. Enter the full amount in rupees." },
        { name: "location", label: "Location", type: "text", wide: true, placeholder: "e.g. Bahria Town, Karachi" },
        { name: "image", label: "Cover photo", type: "image", wide: true },
        { name: "highlights", label: "Highlights (one per line)", type: "textarea", rows: 4, wide: true, placeholder: "5, 10 & 20 marla plots\n3-year installment plan" },
        { name: "description", label: "Description", type: "textarea", rows: 4, wide: true },
        { name: "link", label: "Link (brochure, website or video)", type: "url", wide: true, placeholder: "https://" },
      ],
      defaults: { status: "published" },
        defaults: { status: "published", price: 0 },
        defaults: { purpose: "Buy", type: "House", status: "published", city: "Karachi", images: [], featured: false, beds: 0, baths: 0, price: 0 },
      thumb: r => r.image,
      sub: r => [r.category, r.location].filter(Boolean).join(" · "),
      search: r => [r.title, r.category, r.location].join(" "),
    },
    posts: {
      label: "Post", plural: "Posts", page: "post.html",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, wide: true },
        { name: "status", label: "Status", type: "select", options: [["published", "Published"], ["draft", "Draft (hidden)"]] },
        { name: "image", label: "Photo", type: "image", wide: true },
        { name: "excerpt", label: "Short summary", type: "textarea", rows: 2, wide: true, help: "Shown on the post card." },
        { name: "body", label: "Full text", type: "textarea", rows: 8, wide: true, help: "Leave an empty line between paragraphs. Web addresses become links." },
        { name: "link", label: "Button link (optional)", type: "url", placeholder: "https://" },
        { name: "link_label", label: "Button text", type: "text", placeholder: "e.g. Watch on Facebook" },
      ],
      defaults: { status: "published" },
      thumb: r => r.image,
      sub: r => date(r.created_at) + (r.excerpt ? " · " + r.excerpt : ""),
      search: r => [r.title, r.excerpt].join(" "),
    },
  };

  const SETTINGS_FIELDS = [
    { group: "Contact details" },
    { name: "phone", label: "Phone (shown on site)", type: "text" },
    { name: "whatsapp", label: "WhatsApp number", type: "text", help: "Country code and number, digits only. e.g. 923001234567" },
    { name: "email", label: "Email", type: "text" },
    { name: "hours", label: "Office hours", type: "text" },
    { name: "address", label: "Office address", type: "text", wide: true },
    { group: "Social media links" },
    { name: "facebook", label: "Facebook", type: "url" },
    { name: "instagram", label: "Instagram", type: "url" },
    { name: "youtube", label: "YouTube", type: "url" },
    { name: "tiktok", label: "TikTok", type: "url" },
    { group: "Home page text" },
    { name: "hero_title", label: "Headline", type: "text" },
    { name: "hero_highlight", label: "Headline (blue part)", type: "text" },
    { name: "hero_subtitle", label: "Text under headline", type: "textarea", rows: 3, wide: true },
    { name: "about_text", label: "About us", type: "textarea", rows: 5, wide: true },
    { name: "owner_image", label: "Owner photo", type: "image", wide: true, help: "Upload a clear owner portrait for the About section." },
    { group: "Numbers on the home page" },
    { name: "stat_followers", label: "Facebook followers", type: "number" },
    { name: "stat_listed", label: "Properties listed", type: "number" },
    { name: "stat_clients", label: "Happy clients", type: "number" },
    { name: "stat_cities", label: "Karachi area groups", type: "number" },
  ];

  // ---------- Small UI helpers ----------
  let toastTimer;
  function toast(msg, bad) {
    const t = $("#toast");
    t.textContent = msg; t.className = "toast" + (bad ? " bad" : ""); t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 3200);
  }
  function showError(el, msg) { el.textContent = msg; el.hidden = !msg; }
  const statusPill = s => `<span class="pill ${esc(s)}">${{ published: "Published", draft: "Draft", sold: "Sold" }[s] || esc(s)}</span>`;

  // ---------- Auth ----------
  async function checkAdmin() {
    if (Store.isDemo) return true;
    const { data, error } = await Store.client.from("admins").select("email").limit(1);
    if (error) throw new Error("Could not check admin access: " + error.message);
    return !!(data && data.length);
  }

  async function start() {
    if (Store.isDemo) {
      $("#demoLogin").innerHTML = `<strong>Demo mode</strong><br>Email: ${esc(Store.DEMO_LOGIN.email)}<br>Password: ${esc(Store.DEMO_LOGIN.password)}`;
      $("#demoLogin").hidden = false;
    } else {
      $("#forgotBtn").hidden = false;
      Store.client.auth.onAuthStateChange(evt => {
        if (evt === "PASSWORD_RECOVERY") { $("#appView").hidden = true; $("#loginView").hidden = false; $("#loginForm").hidden = true; $("#newPassForm").hidden = false; }
      });
    }
    const user = await Store.getUser().catch(() => null);
    if (user && (await checkAdmin().catch(() => false))) openApp(user);
    else $("#loginView").hidden = false;
  }

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(e.target), btn = e.target.querySelector("button[type=submit]");
    showError($("#loginError"), ""); btn.disabled = true; btn.textContent = "Logging in…";
    try {
      const user = await Store.signIn(f.get("email"), f.get("password"));
      if (!(await checkAdmin().catch(async err => { await Store.signOut(); throw err; }))) { await Store.signOut(); throw new Error("This account is not an admin. Add its email to the admins table in Supabase."); }
      openApp(user);
    } catch (err) { showError($("#loginError"), err.message); }
    btn.disabled = false; btn.textContent = "Log in";
  });

  $("#forgotBtn").addEventListener("click", async () => {
    const email = $("#loginForm").elements.email.value;
    if (!email) return showError($("#loginError"), "Type your email above first, then click Forgot password.");
    try { await Store.resetPassword(email); toast("Password reset email sent. Check your inbox."); }
    catch (err) { showError($("#loginError"), err.message); }
  });

  $("#newPassForm").addEventListener("submit", async e => {
    e.preventDefault();
    try {
      await Store.updatePassword(new FormData(e.target).get("password"));
      toast("Password updated.");
      history.replaceState(null, "", "admin.html");
      location.reload();
    } catch (err) { showError($("#newPassError"), err.message); }
  });

  $("#logoutBtn").addEventListener("click", async () => { await Store.signOut(); location.hash = ""; location.reload(); });

  function openApp(user) {
    $("#loginView").hidden = true;
    $("#appView").hidden = false;
    $("#userEmail").textContent = user.email;
    $("#demoBanner").hidden = !Store.isDemo;
    route();
  }

  $("#resetDemo").addEventListener("click", async () => {
    if (!confirm("Reset all demo content to the original samples?")) return;
    await Store.resetDemo(); toast("Demo data reset."); route();
  });

  // ---------- Routing ----------
  window.addEventListener("hashchange", () => { if (!$("#appView").hidden) route(); });
  $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  function route() {
    const view = (location.hash.slice(1) || "dashboard").split("/")[0];
    $$(".sidebar nav a").forEach(a => a.classList.toggle("active", a.dataset.view === view));
    $("#sidebar").classList.remove("open");
    const title = { dashboard: "Dashboard", settings: "Settings" }[view] || SCHEMAS[view]?.plural || "Dashboard";
    $("#viewTitle").textContent = title;
    if (SCHEMAS[view]) return renderTable(view);
    if (view === "settings") return renderSettings();
    renderDashboard();
  }

  // ---------- Dashboard ----------
  async function renderDashboard() {
    const c = $("#content");
    c.innerHTML = `<div class="loading">Loading…</div>`;
    try {
      const [listings, projects, posts] = await Promise.all(["listings", "projects", "posts"].map(t => Store.list(t, { all: true })));
      const count = (rows, st) => rows.filter(r => r.status === st).length;
      c.innerHTML = `
        <div class="stat-grid">
          <a class="stat-card" href="#listings"><span>Published listings</span><strong>${count(listings, "published")}</strong><small>${count(listings, "draft")} drafts · ${count(listings, "sold")} sold</small></a>
          <a class="stat-card" href="#projects"><span>Projects</span><strong>${projects.length}</strong><small>${count(projects, "draft")} drafts</small></a>
          <a class="stat-card" href="#posts"><span>Posts</span><strong>${posts.length}</strong><small>${count(posts, "draft")} drafts</small></a>
          <a class="stat-card" href="index.html" target="_blank"><span>Website</span><strong>Live</strong><small>Open the site ↗</small></a>
        </div>
        <div class="quick">
          <button class="btn btn-primary" data-new="listings">＋ Add listing</button>
          <button class="btn btn-outline" data-new="projects">＋ Add project</button>
          <button class="btn btn-outline" data-new="posts">＋ Add post</button>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Latest listings</h2><a href="#listings">See all →</a></div>
          ${rowsHtml("listings", listings.slice(0, 5))}
        </div>`;
      bindRowActions(c, "listings", listings);
      $$("[data-new]", c).forEach(b => b.addEventListener("click", () => openEditor(b.dataset.new)));
    } catch (err) { c.innerHTML = `<div class="panel error-panel">Could not load data: ${esc(err.message)}</div>`; }
  }

  // ---------- Content tables ----------
  function rowsHtml(table, rows) {
    const sc = SCHEMAS[table];
    if (!rows.length) return `<div class="empty-state">No ${sc.plural.toLowerCase()} yet.</div>`;
    return `<div class="rows">${rows.map(r => `
      <div class="row-item" data-id="${esc(r.id)}">
        <img class="row-thumb" src="${url(sc.thumb(r)) || "images/favicon.png"}" alt="">
        <div class="row-main">
          <strong>${esc(r.title)}</strong>${r.featured ? ' <span class="star" title="Featured">★</span>' : ""}
          <small>${esc(sc.sub(r))}</small>
        </div>
        ${statusPill(r.status)}
        <div class="row-actions">
          <button type="button" class="btn btn-sm" data-act="edit">Edit</button>
          <button type="button" class="btn btn-sm btn-ghost" data-act="toggle">${r.status === "draft" ? "Publish" : "Unpublish"}</button>
          <a class="btn btn-sm btn-ghost" href="${sc.page.includes("#") ? sc.page : sc.page + "?id=" + encodeURIComponent(r.id)}" target="_blank" title="View on site">View</a>
          <button type="button" class="btn btn-sm btn-danger" data-act="delete" title="Delete">Delete</button>
        </div>
      </div>`).join("")}</div>`;
  }

  function bindRowActions(root, table, rows, refresh = route) {
    root.querySelectorAll(".row-item").forEach(el => {
      const r = rows.find(x => String(x.id) === el.dataset.id);
      el.querySelector("[data-act=edit]").addEventListener("click", () => openEditor(table, r));
      el.querySelector("[data-act=toggle]").addEventListener("click", async () => {
        try {
          await Store.save(table, { id: r.id, status: r.status === "draft" ? "published" : "draft" });
          toast(r.status === "draft" ? "Published." : "Moved to drafts."); refresh();
        } catch (err) { toast(err.message, true); }
      });
      el.querySelector("[data-act=delete]").addEventListener("click", async () => {
        if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
        try { await Store.remove(table, r.id); toast("Deleted."); refresh(); } catch (err) { toast(err.message, true); }
      });
    });
  }

  async function renderTable(table) {
    const sc = SCHEMAS[table], c = $("#content");
    c.innerHTML = `<div class="loading">Loading…</div>`;
    let rows;
    try { rows = await Store.list(table, { all: true }); }
    catch (err) { c.innerHTML = `<div class="panel error-panel">Could not load: ${esc(err.message)}</div>`; return; }
    c.innerHTML = `
      <div class="toolbar">
        <input type="search" id="q" placeholder="Search ${sc.plural.toLowerCase()}…">
        <select id="st"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>${table === "listings" ? '<option value="sold">Sold</option>' : ""}</select>
        <button class="btn btn-primary" id="addBtn">＋ Add ${sc.label.toLowerCase()}</button>
      </div>
      <div class="panel" id="list"></div>`;
    const draw = () => {
      const q = $("#q").value.trim().toLowerCase(), st = $("#st").value;
      const shown = rows.filter(r => (!st || r.status === st) && (!q || sc.search(r).toLowerCase().includes(q)));
      $("#list").innerHTML = rowsHtml(table, shown);
      bindRowActions($("#list"), table, shown);
    };
    $("#q").addEventListener("input", draw);
    $("#st").addEventListener("change", draw);
    $("#addBtn").addEventListener("click", () => openEditor(table));
    draw();
  }

  // ---------- Form fields ----------
  function fieldHtml(f, v) {
    if (f.group) return `<h3 class="group">${esc(f.group)}</h3>`;
    const id = "f_" + f.name, help = f.help ? `<small class="help">${esc(f.help)}</small>` : "";
    const cls = "field" + (f.wide || ["textarea", "images", "image"].includes(f.type) ? " wide" : "");
    const req = f.required ? " required" : "";
    switch (f.type) {
      case "select":
        return `<label class="${cls}">${f.label}<select name="${f.name}" id="${id}">${f.options.map(o => {
          const [val, lab] = Array.isArray(o) ? o : [o, o];
          return `<option value="${esc(val)}"${String(v) === String(val) ? " selected" : ""}>${esc(lab)}</option>`;
        }).join("")}</select>${help}</label>`;
      case "textarea":
        return `<label class="${cls}">${f.label}<textarea name="${f.name}" id="${id}" rows="${f.rows || 4}" placeholder="${esc(f.placeholder || "")}"${req}>${esc(v)}</textarea>${help}</label>`;
      case "checkbox":
        return `<label class="${cls} check"><input type="checkbox" name="${f.name}" id="${id}"${v ? " checked" : ""}> ${f.label}</label>`;
      case "price":
        return `<label class="${cls}">${f.label}<input type="number" min="0" step="1" name="${f.name}" id="${id}" value="${esc(v ?? "")}"${req}><small class="help price-preview" data-for="${id}">${v ? pkr(v) : ""}</small>${help}</label>`;
      case "images":
      case "image":
        return `<div class="${cls}" data-images="${f.name}" data-multi="${f.type === "images"}"><span class="field-label">${f.label}</span>
          <div class="img-list"></div>
          <div class="img-add">
            <label class="btn btn-outline btn-sm upload-btn">⬆ Upload photo${f.type === "images" ? "s" : ""}<input type="file" accept="image/*"${f.type === "images" ? " multiple" : ""} hidden></label>
            <input type="url" class="img-link" placeholder="or paste an image link (https://…)">
            <button type="button" class="btn btn-sm btn-ghost add-link">Add</button>
          </div>${help}</div>`;
      default: {
        const list = f.list ? ` list="${id}_list"` : "";
        const dl = f.list ? `<datalist id="${id}_list">${f.list.map(o => `<option value="${esc(o)}">`).join("")}</datalist>` : "";
        return `<label class="${cls}">${f.label}<input type="${f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}"${f.type === "number" ? ' min="0"' : ""} name="${f.name}" id="${id}" value="${esc(v ?? "")}" placeholder="${esc(f.placeholder || "")}"${list}${req}>${dl}${help}</label>`;
      }
    }
  }

  // Image picker: keeps its list of URLs on the element
  function setupImages(root, values) {
    root.querySelectorAll("[data-images]").forEach(box => {
      const multi = box.dataset.multi === "true";
      let imgs = [].concat(values[box.dataset.images] || []).filter(Boolean);
      const draw = () => {
        box._value = multi ? imgs : imgs[0] || "";
        box.querySelector(".img-list").innerHTML = imgs.map((src, i) => `
          <div class="img-item${i === 0 && multi ? " cover" : ""}">
            <img src="${url(src)}" alt="">
            ${i === 0 && multi ? '<span class="cover-tag">Cover</span>' : ""}
            <div class="img-tools">
              ${multi && i > 0 ? `<button type="button" data-cover="${i}" title="Make cover">★</button>` : ""}
              <button type="button" data-del="${i}" title="Remove">×</button>
            </div>
          </div>`).join("") || `<div class="img-empty">No photo yet</div>`;
      };
      const add = list => { imgs = multi ? imgs.concat(list) : list.slice(-1); draw(); };
      box.addEventListener("click", e => {
        const d = e.target.closest("[data-del]"), cv = e.target.closest("[data-cover]");
        if (d) { imgs.splice(+d.dataset.del, 1); draw(); }
        if (cv) { const [x] = imgs.splice(+cv.dataset.cover, 1); imgs.unshift(x); draw(); }
      });
      box.querySelector("input[type=file]").addEventListener("change", async e => {
        const files = [...e.target.files]; e.target.value = "";
        const lbl = box.querySelector(".upload-btn"); lbl.classList.add("busy");
        const urls = [];
        for (const file of files) {
          try { urls.push(await Store.uploadImage(file)); } catch (err) { toast(err.message, true); }
        }
        lbl.classList.remove("busy");
        if (urls.length) { add(urls); toast(`${urls.length} photo${urls.length > 1 ? "s" : ""} uploaded.`); }
      });
      box.querySelector(".add-link").addEventListener("click", () => {
        const inp = box.querySelector(".img-link"), v = inp.value.trim();
        if (!/^https?:\/\//i.test(v)) return toast("Paste a full image link starting with https://", true);
        add([v]); inp.value = "";
      });
      draw();
    });
  }

  function readForm(form, fields) {
    const out = {};
    for (const f of fields) {
      if (f.group) continue;
      if (f.type === "images" || f.type === "image") { out[f.name] = form.querySelector(`[data-images="${f.name}"]`)._value; continue; }
      const el = form.elements[f.name];
      if (f.type === "checkbox") out[f.name] = el.checked;
      else if (f.type === "number" || f.type === "price") out[f.name] = el.value === "" ? 0 : Math.max(0, Math.round(+el.value));
      else out[f.name] = el.value.trim();
    }
    return out;
  }

  function validate(form, fields, data) {
    for (const f of fields) {
      if (!f.required) continue;
      const v = data[f.name];
      if (v === "" || v == null || (f.type === "price" && !v)) {
        form.elements[f.name]?.focus();
        return `${f.label} is required.`;
      }
    }
    for (const f of fields) {
      if (f.type === "url" && data[f.name] && !/^https?:\/\//i.test(data[f.name])) return `${f.label} must start with https://`;
    }
    return "";
  }

  function bindPricePreview(root) {
    root.querySelectorAll(".price-preview").forEach(p => {
      const inp = root.querySelector("#" + p.dataset.for);
      inp.addEventListener("input", () => (p.textContent = +inp.value ? "= " + pkr(+inp.value) : ""));
      if (+inp.value) p.textContent = "= " + pkr(+inp.value);
    });
  }

  // ---------- Editor drawer ----------
  let editing = null;
  function openEditor(table, row) {
    const sc = SCHEMAS[table];
    const values = { ...sc.defaults, ...(row || {}) };
    editing = { table, id: row?.id };
    $("#editorTitle").textContent = (row ? "Edit " : "Add ") + sc.label.toLowerCase();
    $("#editorBody").innerHTML = `<div class="form-grid">${sc.fields.map(f => fieldHtml(f, values[f.name])).join("")}</div>`;
    setupImages($("#editorBody"), values);
    bindPricePreview($("#editorBody"));
    showError($("#editorError"), "");
    $("#editorBody").oninput = () => showError($("#editorError"), "");
    $("#drawer").hidden = false;
    document.body.classList.add("no-scroll");
    $("#editorBody").scrollTop = 0;
    setTimeout(() => $("#editorBody input")?.focus(), 50);
  }
  function closeEditor() { $("#drawer").hidden = true; document.body.classList.remove("no-scroll"); editing = null; }
  $("#closeDrawer").addEventListener("click", closeEditor);
  $("#cancelEdit").addEventListener("click", closeEditor);
  $("#drawer").addEventListener("click", e => { if (e.target.id === "drawer") closeEditor(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#drawer").hidden) closeEditor(); });

  $("#editorForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!editing) return;
    const sc = SCHEMAS[editing.table], form = e.target;
    const data = readForm(form, sc.fields);
    const err = validate(form, sc.fields, data);
    if (err) return showError($("#editorError"), err);
    const btn = $("#saveBtn"); btn.disabled = true; btn.textContent = "Saving…";
    try {
      await Store.save(editing.table, editing.id ? { ...data, id: editing.id } : data);
      toast(`${sc.label} saved.`);
      closeEditor(); route();
    } catch (ex) { showError($("#editorError"), ex.message); }
    btn.disabled = false; btn.textContent = "Save";
  });

  // ---------- Settings ----------
  async function renderSettings() {
    const c = $("#content");
    c.innerHTML = `<div class="loading">Loading…</div>`;
    const s = await Store.getSettings();
    c.innerHTML = `
      <form class="panel settings-form" id="settingsForm" novalidate>
        <div class="form-grid">${SETTINGS_FIELDS.map(f => fieldHtml(f, s[f.name])).join("")}</div>
        <div class="settings-foot"><p class="error" id="settingsError" hidden></p><button class="btn btn-primary" type="submit">Save settings</button></div>
      </form>`;
    $("#settingsForm").addEventListener("submit", async e => {
      e.preventDefault();
      const data = readForm(e.target, SETTINGS_FIELDS);
      data.whatsapp = String(data.whatsapp).replace(/\D/g, "");
      const err = validate(e.target, SETTINGS_FIELDS, data);
      if (err) return showError($("#settingsError"), err);
      try { await Store.saveSettings(data); showError($("#settingsError"), ""); toast("Settings saved."); }
      catch (ex) { showError($("#settingsError"), ex.message); }
    });
  }

  start();
})();
