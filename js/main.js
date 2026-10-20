// ---- Site settings: replace with real details ----
const WHATSAPP_NUMBER = "920000000000"; // international format, no + or spaces

// ---- Listings: edit this list to add, change or remove properties ----
// price is in PKR; purpose is "Buy" or "Rent" (rent prices are per month)
const PROPERTIES = [
  { id: 1, title: "10 Marla Modern House", type: "House", purpose: "Buy", city: "Lahore", area: "DHA Phase 6", price: 58000000, beds: 5, baths: 6, size: "10 Marla", image: "images/p1.svg" },
  { id: 2, title: "3 Bed Luxury Apartment", type: "Apartment", purpose: "Buy", city: "Islamabad", area: "Gulberg Greens", price: 32500000, beds: 3, baths: 3, size: "1,850 sq ft", image: "images/p2.svg" },
  { id: 3, title: "1 Kanal Designer Villa", type: "House", purpose: "Buy", city: "Karachi", area: "Bahria Town", price: 95000000, beds: 6, baths: 7, size: "1 Kanal", image: "images/p3.svg" },
  { id: 4, title: "5 Marla Residential Plot", type: "Plot", purpose: "Buy", city: "Rawalpindi", area: "Bahria Town Phase 8", price: 8500000, beds: 0, baths: 0, size: "5 Marla", image: "images/p4.svg" },
  { id: 5, title: "Ground Floor Shop", type: "Commercial", purpose: "Rent", city: "Lahore", area: "Johar Town", price: 180000, beds: 0, baths: 1, size: "450 sq ft", image: "images/p5.svg" },
  { id: 6, title: "7 Marla Family House", type: "House", purpose: "Rent", city: "Faisalabad", area: "Canal Road", price: 95000, beds: 4, baths: 4, size: "7 Marla", image: "images/p6.svg" },
  { id: 7, title: "2 Bed Furnished Flat", type: "Apartment", purpose: "Rent", city: "Karachi", area: "Clifton Block 2", price: 150000, beds: 2, baths: 2, size: "1,200 sq ft", image: "images/p7.svg" },
  { id: 8, title: "4 Kanal Farmhouse", type: "Farmhouse", purpose: "Buy", city: "Islamabad", area: "Bani Gala", price: 150000000, beds: 5, baths: 5, size: "4 Kanal", image: "images/p8.svg" },
  { id: 9, title: "1 Kanal Commercial Plot", type: "Plot", purpose: "Buy", city: "Multan", area: "DHA Multan", price: 27500000, beds: 0, baths: 0, size: "1 Kanal", image: "images/p9.svg" },
];

const CITIES = [
  { name: "Lahore", icon: "🕌" },
  { name: "Karachi", icon: "🌊" },
  { name: "Islamabad", icon: "⛰️" },
  { name: "Rawalpindi", icon: "🏙️" },
  { name: "Faisalabad", icon: "🏭" },
  { name: "Multan", icon: "🌴" },
];

// ---- Helpers ----
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function formatPKR(n) {
  if (n >= 10000000) return "PKR " + +(n / 10000000).toFixed(2) + " Crore";
  if (n >= 100000) return "PKR " + +(n / 100000).toFixed(2) + " Lakh";
  return "PKR " + n.toLocaleString("en-PK");
}

function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// ---- State ----
const state = { purpose: "", type: "", city: "", budget: 0 };

function filtered() {
  return PROPERTIES.filter(p =>
    (!state.purpose || p.purpose === state.purpose) &&
    (!state.type || p.type === state.type) &&
    (!state.city || p.city === state.city) &&
    (!state.budget || p.price <= state.budget)
  );
}

function features(p) {
  const f = [];
  if (p.beds) f.push(`🛏️ ${p.beds} Beds`);
  if (p.baths) f.push(`🛁 ${p.baths} Baths`);
  f.push(`📐 ${p.size}`);
  return f.map(x => `<span>${x}</span>`).join("");
}

function renderProperties() {
  const list = filtered();
  const grid = $("#propertyGrid");
  grid.innerHTML = list.length
    ? list.map(p => `
      <article class="card" data-id="${p.id}" tabindex="0">
        <div class="card-media">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <span class="badge ${p.purpose === "Rent" ? "rent" : ""}">For ${p.purpose === "Rent" ? "Rent" : "Sale"}</span>
          <span class="badge badge-type">${p.type}</span>
        </div>
        <div class="card-body">
          <div class="price">${formatPKR(p.price)}${p.purpose === "Rent" ? " <small>/ month</small>" : ""}</div>
          <h3>${p.title}</h3>
          <div class="location">📍 ${p.area}, ${p.city}</div>
          <div class="features">${features(p)}</div>
        </div>
      </article>`).join("")
    : `<div class="empty">No properties match your search yet. Contact us and we will find one for you.</div>`;

  const active = [state.purpose && (state.purpose === "Rent" ? "for rent" : "for sale"), state.type, state.city && "in " + state.city, state.budget && "under " + formatPKR(state.budget)].filter(Boolean);
  $("#resultsNote").innerHTML = active.length
    ? `Showing ${list.length} ${list.length === 1 ? "property" : "properties"} ${active.join(", ")}. <button type="button" id="clearFilters">Clear</button>`
    : "";
  $("#clearFilters")?.addEventListener("click", resetFilters);

  $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.filter === state.type));
}

function resetFilters() {
  Object.assign(state, { purpose: "", type: "", city: "", budget: 0 });
  $("#searchForm").reset();
  renderProperties();
}

function renderCities() {
  $("#cityGrid").innerHTML = CITIES.map(c => {
    const n = PROPERTIES.filter(p => p.city === c.name).length;
    return `<div class="city" data-city="${c.name}" tabindex="0"><div class="city-icon">${c.icon}</div><strong>${c.name}</strong><span>${n} ${n === 1 ? "listing" : "listings"}</span></div>`;
  }).join("");
}

function showCity(name) {
  Object.assign(state, { city: name, type: "", purpose: "", budget: 0 });
  $("#sCity").value = name;
  renderProperties();
  $("#properties").scrollIntoView();
}

function openModal(p) {
  $("#modalBody").innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <div class="modal-content">
      <div class="price">${formatPKR(p.price)}${p.purpose === "Rent" ? " <small>/ month</small>" : ""}</div>
      <h3>${p.title}</h3>
      <div class="location">📍 ${p.area}, ${p.city}</div>
      <div class="features">${features(p)}<span>🏷️ For ${p.purpose === "Rent" ? "Rent" : "Sale"}</span></div>
      <p>Contact Bigzone Marketing for full details, more photos and a site visit of this ${p.type.toLowerCase()}.</p>
      <div class="modal-actions">
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${waLink(`Hi Bigzone Marketing, I'm interested in "${p.title}" in ${p.area}, ${p.city} (${formatPKR(p.price)}).`)}">Enquire on WhatsApp</a>
        <a class="btn btn-white" style="border-color:var(--border)" href="tel:+${WHATSAPP_NUMBER}">Call Now</a>
      </div>
    </div>`;
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}

function animateCounters() {
  const els = $$("[data-count]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now();
      const step = t => {
        const k = Math.min((t - start) / 1400, 1);
        const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
        el.textContent = (target >= 10000 ? Math.round(v / 1000) + "K" : v.toLocaleString("en-PK")) + "+";
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}

// ---- Events ----
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  $("#whatsappBtn").href = waLink("Hi Bigzone Marketing, I'd like to know about available properties.");
  renderProperties();
  renderCities();
  animateCounters();

  // Search tabs
  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  }));

  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    const purpose = $(".tab.active").dataset.purpose;
    if (purpose === "Projects") { $("#projects").scrollIntoView(); return; }
    Object.assign(state, { purpose, city: $("#sCity").value, type: $("#sType").value, budget: +$("#sBudget").value || 0 });
    renderProperties();
    $("#properties").scrollIntoView();
  });

  $("#filters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.type = chip.dataset.filter;
    $("#sType").value = state.type;
    renderProperties();
  });

  $("#propertyGrid").addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openModal(PROPERTIES.find(p => p.id === +card.dataset.id));
  });
  $("#propertyGrid").addEventListener("keydown", e => {
    const card = e.target.closest(".card");
    if (card && e.key === "Enter") openModal(PROPERTIES.find(p => p.id === +card.dataset.id));
  });

  $("#cityGrid").addEventListener("click", e => {
    const c = e.target.closest(".city");
    if (c) showCity(c.dataset.city);
  });
  $$("[data-city-link]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); showCity(a.dataset.cityLink); }));

  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Mobile nav
  $("#navToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
  window.addEventListener("scroll", () => $("#navbar").classList.toggle("scrolled", scrollY > 10));

  // Contact form opens WhatsApp with the enquiry
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hi Bigzone Marketing,\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nI want to: ${f.get("purpose")}\nCity: ${f.get("city")}\n${f.get("message") || ""}`;
    window.open(waLink(msg), "_blank");
  });
});
