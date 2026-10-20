(async function () {
  const { $, $$, card, postCard } = Layout;
  const { esc, url, wa } = BZ;
  const AREA_GROUPS = Store.KARACHI_AREA_GROUPS;
  const isKarachi = value => /karachi/i.test(String(value || ""));

  const s = await Layout.init("home");
  const [allListings, allProjects, posts] = await Promise.all(["listings", "projects", "posts"].map(t => Store.list(t).catch(() => [])));
  const listings = allListings.filter(l => l.city === "Karachi");
  const projects = allProjects.filter(p => isKarachi(p.location));
  const active = listings.filter(l => l.status !== "sold");

  // Contact links and hero
  $("#cPhone").href = "tel:" + s.phone.replace(/\s/g, "");
  $("#cEmail").href = "mailto:" + s.email;
  if (+s.stat_followers) $("#heroEyebrow").textContent = `Trusted by ${Math.round(s.stat_followers / 1000)}K+ followers`;

  // Featured listings with type chips (home page shows up to 6)
  let type = "";
  function renderListings() {
    const list = active.filter(l => !type || l.type === type).slice(0, 6);
    $("#propertyGrid").innerHTML = list.length ? list.map(card).join("")
      : `<div class="empty">No ${type ? type.toLowerCase() + " " : ""}listings right now. <a href="#contact">Tell us what you need</a> and we will find it.</div>`;
    $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.filter === type));
  }
  $("#filters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (chip) { type = chip.dataset.filter; renderListings(); }
  });
  renderListings();

  // Karachi areas are grouped for browsing; each area remains a direct filter.
  $("#cityGrid").innerHTML = AREA_GROUPS.map(group => `
    <article class="area-group">
      <h3>${esc(group.name)}</h3>
      <div class="area-links">${group.areas.map(area => `<a href="properties.html?area=${encodeURIComponent(area)}">${esc(area)}</a>`).join("")}</div>
    </article>`).join("");
  const areaOptions = AREA_GROUPS.map(group => `<optgroup label="${esc(group.name)}">${group.areas.map(area => `<option value="${esc(area)}">${esc(area)}</option>`).join("")}</optgroup>`).join("");
  $$(".area-select").forEach(sel => sel.insertAdjacentHTML("beforeend", areaOptions));

  const ownerPhoto = $("#ownerPhoto");
  if (ownerPhoto) ownerPhoto.src = url(s.owner_image) || "images/about.svg";

  // Projects
  $("#projectGrid").innerHTML = projects.length ? projects.slice(0, 6).map(p => {
    const msg = `Hi ${s.company}, please send me the payment plan for ${p.title}.`;
    return `
      <article class="project">
        <img src="${url(p.image) || "images/proj1.svg"}" alt="${esc(p.title)}" loading="lazy">
        <div class="project-body">
          <span class="tag">${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          ${+p.price ? `<div class="project-price">${BZ.pkr(p.price)} <small>starting price</small></div>` : ""}
          ${p.location ? `<p>📍 ${esc(p.location)}</p>` : ""}
          <ul>${String(p.highlights || "").split("\n").filter(x => x.trim()).map(h => `<li>${esc(h)}</li>`).join("")}</ul>
          <div class="project-actions">
            <a href="${wa(s.whatsapp, msg)}" target="_blank" rel="noopener" class="btn btn-outline-light">Get Payment Plan</a>
            ${url(p.link) ? `<a href="${url(p.link)}" target="_blank" rel="noopener" class="btn btn-link-light">Details →</a>` : ""}
          </div>
        </div>
      </article>`;
  }).join("") : `<div class="empty light">New projects coming soon.</div>`;

  // News
  $("#postGrid").innerHTML = posts.length ? posts.slice(0, 3).map(postCard).join("") : `<div class="empty">No updates yet.</div>`;
  if (!posts.length) $("#news").hidden = true;

  // Stat counters
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +s[el.dataset.countKey] || 0, start = performance.now();
    const step = t => {
      const k = Math.min((t - start) / 1400, 1);
      const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      el.textContent = (target >= 10000 ? Math.round(v / 1000) + "K" : v.toLocaleString("en-PK")) + "+";
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    io.unobserve(el);
  }), { threshold: 0.4 });
  $$("[data-count-key]").forEach(el => io.observe(el));

  // Search: Buy / Rent go to the properties page, Projects scrolls to projects
  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    $("#sPurpose").value = tab.dataset.purpose;
  }));
  $("#searchForm").addEventListener("submit", e => {
    if ($("#sPurpose").value === "Projects") { e.preventDefault(); $("#projects").scrollIntoView(); return; }
    // Drop empty fields so the address stays clean
    $$("#searchForm [name]").forEach(f => { f.disabled = !f.value; });
    setTimeout(() => $$("#searchForm [name]").forEach(f => { f.disabled = false; }));
  });

  // Contact form opens WhatsApp with the enquiry
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hi ${s.company},\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nI want to: ${f.get("purpose")}\nCity: ${f.get("city")}\n${f.get("message") || ""}`;
    window.open(wa(s.whatsapp, msg), "_blank");
  });

  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
})();
