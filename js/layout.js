// Shared header, footer and WhatsApp button for every public page.
// Pages call Layout.init() and get the site settings back.
window.Layout = (function () {
  const { esc, url, wa } = window.BZ;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function header(s, active) {
    const link = (href, label, key) => `<a href="${href}"${active === key ? ' class="active"' : ""}>${label}</a>`;
    return `
    <div class="topbar">
      <div class="container topbar-inner">
        <div class="topbar-info">
          <a href="tel:${esc(s.phone.replace(/\s/g, ""))}">📞 ${esc(s.phone)}</a>
          <a href="mailto:${esc(s.email)}">✉️ ${esc(s.email)}</a>
        </div>
        <div class="topbar-social">${socials(s)}</div>
      </div>
    </div>
    <header class="navbar" id="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="brand">
          <img src="images/logo-mark.png" alt="${esc(s.company)} logo">
          <span class="brand-text"><strong>Bigzone</strong><small>Marketing</small></span>
        </a>
        <nav class="nav-links" id="navLinks">
          ${link("index.html", "Home", "home")}
          ${link("properties.html", "Properties", "properties")}
          ${link("index.html#projects", "Projects", "projects")}
          ${link("blog.html", "News", "blog")}
          ${link("index.html#about", "About", "about")}
          ${link("index.html#contact", "Contact", "contact")}
          <a href="index.html#contact" class="btn btn-primary nav-cta">List Your Property</a>
        </nav>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu"><span></span><span></span><span></span></button>
      </div>
    </header>`;
  }

  function socials(s) {
    return [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"], ["tiktok", "TikTok"]]
      .filter(([k]) => url(s[k]))
      .map(([k, label]) => `<a href="${url(s[k])}" target="_blank" rel="noopener">${label}</a>`).join("");
  }

  function footer(s) {
    const areas = ["Gulistan-e-Johar Block 1", "Gulshan-e-Iqbal Block 1", "Gulshan-e-Maymar", "Scheme 33", "Tariq Road", "Bahadurabad", "DHA Phase 6"];
    return `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <a href="index.html" class="brand brand-footer">
            <img src="images/logo-mark.png" alt="${esc(s.company)} logo">
            <span class="brand-text"><strong>Bigzone</strong><small>Marketing</small></span>
          </a>
          <p>${esc(s.tagline)}. Buy, sell, rent and invest with a team you can trust.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="properties.html">Properties</a><a href="index.html#projects">Projects</a><a href="blog.html">News &amp; Updates</a><a href="index.html#about">About Us</a><a href="index.html#contact">Contact</a>
        </div>
        <div>
          <h4>Karachi Areas</h4>
          ${areas.map(area => `<a href="properties.html?area=${encodeURIComponent(area)}">${esc(area)}</a>`).join("")}
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:${esc(s.phone.replace(/\s/g, ""))}">${esc(s.phone)}</a>
          <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>
          <p class="footer-address">${esc(s.address)}</p>
          <div class="footer-social">${socials(s)}</div>
        </div>
      </div>
      <div class="container footer-bottom">© ${new Date().getFullYear()} ${esc(s.company)}™. All rights reserved.</div>
    </footer>
    <a class="whatsapp" href="${wa(s.whatsapp, `Hi ${s.company}, I'd like to know about available properties.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>
    </a>`;
  }

  // Property card used on the home page and the properties page.
  function card(p) {
    const img = url((p.images || [])[0]) || "images/p1.svg";
    const rent = p.purpose === "Rent";
    const feats = [p.beds ? `🛏️ ${+p.beds} Beds` : "", p.baths ? `🛁 ${+p.baths} Baths` : "", p.size ? `📐 ${esc(p.size)}` : ""].filter(Boolean);
    return `
      <a class="card" href="property.html?id=${encodeURIComponent(p.id)}">
        <div class="card-media">
          <img src="${img}" alt="${esc(p.title)}" loading="lazy">
          ${p.status === "sold" ? '<span class="badge sold">Sold</span>' : `<span class="badge ${rent ? "rent" : ""}">For ${rent ? "Rent" : "Sale"}</span>`}
          <span class="badge badge-type">${esc(p.type)}</span>
          ${p.featured ? '<span class="badge badge-featured">★ Featured</span>' : ""}
        </div>
        <div class="card-body">
          <div class="price">${BZ.pkr(p.price)}${rent ? " <small>/ month</small>" : ""}</div>
          <h3>${esc(p.title)}</h3>
          <div class="location">📍 ${esc([p.area, p.city].filter(Boolean).join(", "))}</div>
          <div class="features">${feats.map(f => `<span>${f}</span>`).join("")}</div>
        </div>
      </a>`;
  }

  function postCard(p) {
    return `
      <a class="post-card" href="post.html?id=${encodeURIComponent(p.id)}">
        <div class="post-media"><img src="${url(p.image) || "images/hero.svg"}" alt="${esc(p.title)}" loading="lazy"></div>
        <div class="post-body">
          <span class="post-date">${BZ.date(p.created_at)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <span class="read-more">Read more →</span>
        </div>
      </a>`;
  }

  async function init(active) {
    let s;
    try { s = await Store.getSettings(); } catch (e) { s = { ...Store.DEFAULT_SETTINGS }; }
    $("#site-header").innerHTML = header(s, active);
    $("#site-footer").innerHTML = footer(s);
    $("#navToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
    $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
    window.addEventListener("scroll", () => $("#navbar").classList.toggle("scrolled", scrollY > 10));
    // Fill any element marked with data-setting="key"
    $$("[data-setting]").forEach(el => { if (s[el.dataset.setting] != null) el.textContent = s[el.dataset.setting]; });
    return s;
  }

  return { init, card, postCard, $, $$ };
})();
