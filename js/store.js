// Data layer shared by the public site and the admin panel.
// Uses Supabase when js/config.js has keys, otherwise a demo store in localStorage.
(function () {
  const cfg = window.BIGZONE_CONFIG || {};
  const LIVE = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const TABLES = ["listings", "projects", "posts"];
  const KARACHI_AREA_GROUPS = [
    { name: "Gulistan-e-Johar", areas: Array.from({ length: 20 }, (_, i) => `Gulistan-e-Johar Block ${i + 1}`) },
    { name: "Gulshan-e-Iqbal", areas: Array.from({ length: 19 }, (_, i) => `Gulshan-e-Iqbal Block ${i + 1}`) },
    { name: "Gulshan-e-Maymar", areas: ["Gulshan-e-Maymar"] },
    { name: "Scheme 33 Societies", areas: ["Scheme 33", "Saadi Town", "Saima Arabian Villas", "Gulshan-e-Kaneez Fatima", "Punjabi Saudagar City", "Sachal Goth", "Memon Nagar"] },
    { name: "Nazimabad", areas: Array.from({ length: 7 }, (_, i) => `Nazimabad No. ${i + 1}`) },
    { name: "North Nazimabad", areas: "ABCDEFGH".split("").map(block => `North Nazimabad Block ${block}`) },
    { name: "Tariq Road & Bahadurabad", areas: ["Tariq Road", "Bahadurabad"] },
    { name: "DHA", areas: Array.from({ length: 8 }, (_, i) => `DHA Phase ${i + 1}`) },
    { name: "Clifton", areas: Array.from({ length: 9 }, (_, i) => `Clifton Block ${i + 1}`) },
    { name: "PECHS", areas: Array.from({ length: 6 }, (_, i) => `PECHS Block ${i + 1}`) },
    { name: "Other Karachi Areas", areas: ["Malir", "Korangi", "Landhi", "Gulshan-e-Hadeed", "Federal B Area", "Saddar", "Shah Faisal Colony", "Bahria Town Karachi"] },
  ];

  // ---------- Default content (used for demo mode and as fallbacks) ----------
  const DEFAULT_SETTINGS = {
    company: "Bigzone Marketing",
    tagline: "Karachi Property: Buy, Sell and Rent",
    phone: "+92 300 0000000",
    whatsapp: "920000000000",
    email: "info@bigzonemarketing.com",
    address: "Office address, City, Pakistan",
    hours: "Mon to Sat, 10:00 am to 7:00 pm",
    facebook: "https://www.facebook.com/bigzonemarketing/",
    instagram: "",
    youtube: "",
    tiktok: "",
    hero_title: "Karachi Property",
    hero_highlight: "Buy, Sell & Rent",
    hero_subtitle: "Houses, apartments, plots and commercial spaces across Karachi. Verified listings, honest advice and complete paperwork support.",
    about_text: "Bigzone Marketing is a real estate and property marketing company helping families, investors and overseas Pakistanis buy, sell and rent with confidence. With a community of more than 11,000 followers, we connect genuine buyers with genuine sellers every day.",
    owner_image: "",
    stat_followers: 11000,
    stat_listed: 1200,
    stat_clients: 850,
    stat_cities: KARACHI_AREA_GROUPS.length,
  };

  const now = Date.now();
  const ago = d => new Date(now - d * 86400000).toISOString();
  const SEED = {
    listings: [
      { id: "l1", title: "10 Marla Modern House", type: "House", purpose: "Buy", city: "Lahore", area: "DHA Phase 6", price: 58000000, beds: 5, baths: 6, size: "10 Marla", images: ["images/p1.svg"], featured: true, status: "published", created_at: ago(1), description: "Brand new double storey house with modern elevation, imported fittings, a double kitchen and a spacious lawn. Close to the park, mosque and main boulevard." },
      { id: "l2", title: "3 Bed Luxury Apartment", type: "Apartment", purpose: "Buy", city: "Islamabad", area: "Gulberg Greens", price: 32500000, beds: 3, baths: 3, size: "1,850 sq ft", images: ["images/p2.svg"], featured: true, status: "published", created_at: ago(2), description: "Corner apartment with a mountain view, lift, 24/7 security, backup power and a reserved parking space." },
      { id: "l3", title: "1 Kanal Designer Villa", type: "House", purpose: "Buy", city: "Karachi", area: "Bahria Town", price: 95000000, beds: 6, baths: 7, size: "1 Kanal", images: ["images/p3.svg"], featured: true, status: "published", created_at: ago(3), description: "Architect-designed villa with a basement, home theatre, servant quarter and solar system. Possession ready." },
      { id: "l4", title: "5 Marla Residential Plot", type: "Plot", purpose: "Buy", city: "Rawalpindi", area: "Bahria Town Phase 8", price: 8500000, beds: 0, baths: 0, size: "5 Marla", images: ["images/p4.svg"], featured: false, status: "published", created_at: ago(4), description: "Possession plot on a 40 ft road with all dues clear. Ideal for building or investment." },
      { id: "l5", title: "Ground Floor Shop", type: "Commercial", purpose: "Rent", city: "Lahore", area: "Johar Town", price: 180000, beds: 0, baths: 1, size: "450 sq ft", images: ["images/p5.svg"], featured: false, status: "published", created_at: ago(5), description: "Main road facing shop in a busy commercial area with heavy footfall. Suitable for a brand outlet, pharmacy or bank." },
      { id: "l6", title: "7 Marla Family House", type: "House", purpose: "Rent", city: "Faisalabad", area: "Canal Road", price: 95000, beds: 4, baths: 4, size: "7 Marla", images: ["images/p6.svg"], featured: false, status: "published", created_at: ago(6), description: "Well maintained full house for rent with separate gas and electricity meters. Family preferred." },
      { id: "l7", title: "2 Bed Furnished Flat", type: "Apartment", purpose: "Rent", city: "Karachi", area: "Clifton Block 2", price: 150000, beds: 2, baths: 2, size: "1,200 sq ft", images: ["images/p7.svg"], featured: false, status: "published", created_at: ago(7), description: "Fully furnished sea-facing flat with air conditioning, a modern kitchen and building security." },
      { id: "l8", title: "4 Kanal Farmhouse", type: "Farmhouse", purpose: "Buy", city: "Islamabad", area: "Bani Gala", price: 150000000, beds: 5, baths: 5, size: "4 Kanal", images: ["images/p8.svg"], featured: false, status: "published", created_at: ago(8), description: "Luxury farmhouse with a swimming pool, fruit garden and lake view. Perfect for weekends and events." },
      { id: "l9", title: "1 Kanal Commercial Plot", type: "Plot", purpose: "Buy", city: "Multan", area: "DHA Multan", price: 27500000, beds: 0, baths: 0, size: "1 Kanal", images: ["images/p9.svg"], featured: false, status: "published", created_at: ago(9), description: "Commercial plot in a prime sector with high growth potential. Transfer ready." },
    ],
    projects: [
      { id: "pr1", title: "Skyline Residency", category: "Apartments", location: "Gulberg, Islamabad", highlights: "2 & 3 bed apartments\n3-year installment plan\nPossession 2028", description: "A modern residential tower with a rooftop garden, gym and 24/7 security.", image: "images/proj1.svg", link: "", status: "published", created_at: ago(1) },
      { id: "pr2", title: "Business Square Plaza", category: "Commercial", location: "Johar Town, Lahore", highlights: "Shops & offices\nRental return guarantee\nReady to book", description: "A commercial plaza on the main boulevard with shops, offices and a food court.", image: "images/proj2.svg", link: "", status: "published", created_at: ago(2) },
      { id: "pr3", title: "Green Valley Homes", category: "Housing Society", location: "Bahria Town, Karachi", highlights: "5, 10 & 20 marla plots\nGated community\nBalloting soon", description: "A gated community with parks, schools and a grand mosque.", image: "images/proj3.svg", link: "", status: "published", created_at: ago(3) },
    ],
    posts: [
      { id: "po1", title: "New booking open: Skyline Residency apartments", excerpt: "Book a 2 or 3 bed apartment on a 3-year easy installment plan.", body: "Booking is now open for Skyline Residency in Gulberg, Islamabad. Apartments are available on a 3-year installment plan with 20% down payment.\n\nContact us on WhatsApp for the payment plan and floor plans.", image: "images/proj1.svg", link: "", link_label: "", status: "published", created_at: ago(1) },
      { id: "po2", title: "5 tips before buying a plot in Pakistan", excerpt: "Check NOC, verify the file and visit the site before you pay.", body: "1. Check the society's NOC from the development authority.\n2. Verify the file or plot number with the society office.\n3. Visit the site and check the exact location.\n4. Ask for all dues clearance.\n5. Do the transfer only at the official office.", image: "images/p4.svg", link: "", link_label: "", status: "published", created_at: ago(4) },
      { id: "po3", title: "Follow us on Facebook for daily listings", excerpt: "More than 11,000 people follow our page for new property every day.", body: "We post new properties, booking updates and market news every day on our Facebook page.", image: "images/hero.svg", link: "https://www.facebook.com/bigzonemarketing/", link_label: "Visit our Facebook page", status: "published", created_at: ago(6) },
    ],
  };

  // ---------- Demo store (localStorage) ----------
  const LS_KEY = "bigzone_demo_v1";
  const SESSION_KEY = "bigzone_demo_session";
  const DEMO_LOGIN = { email: "admin@bigzonemarketing.com", password: "demo1234" };

  function demoLoad() {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY));
      if (d && d.listings) return d;
    } catch (e) {}
    return { settings: { ...DEFAULT_SETTINGS }, ...JSON.parse(JSON.stringify(SEED)) };
  }
  function demoSave(d) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(d)); }
    catch (e) { throw new Error("Browser storage is full. In demo mode photos are kept in your browser; remove some photos or connect Supabase."); }
  }
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  function sortRows(rows) {
    return rows.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || String(b.created_at).localeCompare(String(a.created_at)));
  }

  // Shrinks an image file to a JPEG data URL (demo mode only).
  function fileToDataUrl(file, max = 1280) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.8));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => reject(new Error("That file is not an image we can read."));
      img.src = URL.createObjectURL(file);
    });
  }

  const demo = {
    async getSettings() {
      const settings = { ...DEFAULT_SETTINGS, ...demoLoad().settings };
      if (settings.tagline === "We Deal in Property All over Pakistan") settings.tagline = DEFAULT_SETTINGS.tagline;
      if (settings.hero_title === "We Deal in Property") settings.hero_title = DEFAULT_SETTINGS.hero_title;
      if (settings.hero_highlight === "All over Pakistan") settings.hero_highlight = DEFAULT_SETTINGS.hero_highlight;
      if (settings.hero_subtitle.includes("Lahore, Karachi, Islamabad")) settings.hero_subtitle = DEFAULT_SETTINGS.hero_subtitle;
      if (settings.stat_cities === 25) settings.stat_cities = DEFAULT_SETTINGS.stat_cities;
      return settings;
    },
    async saveSettings(s) { const d = demoLoad(); d.settings = { ...d.settings, ...s }; demoSave(d); },
    async list(table, { all = false } = {}) {
      const rows = demoLoad()[table] || [];
      return sortRows(all ? rows : rows.filter(r => r.status !== "draft"));
    },
    async get(table, id) { return (demoLoad()[table] || []).find(r => r.id === id) || null; },
    async save(table, row) {
      const d = demoLoad();
      if (row.id) d[table] = d[table].map(r => (r.id === row.id ? { ...r, ...row } : r));
      else { row = { ...row, id: uid(), created_at: new Date().toISOString() }; d[table].push(row); }
      demoSave(d);
      return row;
    },
    async remove(table, id) { const d = demoLoad(); d[table] = d[table].filter(r => r.id !== id); demoSave(d); },
    async uploadImage(file) { return fileToDataUrl(file); },
    async signIn(email, password) {
      if (email.trim().toLowerCase() !== DEMO_LOGIN.email || password !== DEMO_LOGIN.password) throw new Error("Wrong email or password.");
      localStorage.setItem(SESSION_KEY, email);
      return { email };
    },
    async signOut() { localStorage.removeItem(SESSION_KEY); },
    async getUser() { const e = localStorage.getItem(SESSION_KEY); return e ? { email: e } : null; },
    async resetDemo() { localStorage.removeItem(LS_KEY); },
  };

  // ---------- Supabase store ----------
  let sb = null;
  if (LIVE) sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const check = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

  const live = {
    async getSettings() {
      const { data } = await sb.from("settings").select("data").eq("id", 1).maybeSingle();
      return { ...DEFAULT_SETTINGS, ...(data?.data || {}) };
    },
    async saveSettings(s) {
      const current = await live.getSettings();
      check(await sb.from("settings").upsert({ id: 1, data: { ...current, ...s } }));
    },
    async list(table, { all = false } = {}) {
      let q = sb.from(table).select("*");
      if (!all) q = q.neq("status", "draft");
      if (table === "listings") q = q.order("featured", { ascending: false });
      return check(await q.order("created_at", { ascending: false }));
    },
    async get(table, id) { return check(await sb.from(table).select("*").eq("id", id).maybeSingle()); },
    async save(table, row) {
      const { id, created_at, ...fields } = row;
      if (id) return check(await sb.from(table).update(fields).eq("id", id).select().single());
      return check(await sb.from(table).insert(fields).select().single());
    },
    async remove(table, id) { check(await sb.from(table).delete().eq("id", id)); },
    async uploadImage(file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${new Date().getFullYear()}/${uid()}.${ext}`;
      check(await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type }));
      return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
    },
    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
      return data.user;
    },
    async signOut() { await sb.auth.signOut(); },
    async getUser() { const { data } = await sb.auth.getUser(); return data.user; },
    async resetPassword(email) {
      const redirectTo = location.href.split("#")[0];
      check(await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo }));
    },
    async updatePassword(password) { check(await sb.auth.updateUser({ password })); },
  };

  window.Store = { ...(LIVE ? live : demo), isDemo: !LIVE, TABLES, DEFAULT_SETTINGS, KARACHI_AREA_GROUPS, DEMO_LOGIN: LIVE ? null : DEMO_LOGIN, client: sb };

  // ---------- Shared formatting helpers ----------
  window.BZ = {
    esc(s) {
      return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
    // Only allow http(s), relative paths and image data URLs in links and image sources.
    url(u) {
      u = String(u ?? "").trim();
      return /^(https?:\/\/|data:image\/|images\/|\/|\.\/|[\w-]+\.html)/i.test(u) ? BZ.esc(u) : "";
    },
    pkr(n) {
      n = +n || 0;
      if (n >= 10000000) return "PKR " + +(n / 10000000).toFixed(2) + " Crore";
      if (n >= 100000) return "PKR " + +(n / 100000).toFixed(2) + " Lakh";
      return "PKR " + n.toLocaleString("en-PK");
    },
    date(d) { return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""; },
    // Plain text to paragraphs, with web addresses turned into links.
    paragraphs(text) {
      return String(text ?? "").split(/\n{2,}/).filter(p => p.trim()).map(p =>
        "<p>" + BZ.esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>') + "</p>"
      ).join("");
    },
    wa(number, text) { return `https://wa.me/${String(number || "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`; },
    param(name) { return new URLSearchParams(location.search).get(name); },
  };
})();
