(async function () {
  const { $, card } = Layout;
  const { esc, url, wa, pkr, paragraphs } = BZ;
  const s = await Layout.init("properties");
  const id = BZ.param("id");
  const p = id ? await Store.get("listings", id).catch(() => null) : null;

  if (!p || p.status === "draft" || p.city !== "Karachi") {
    $("#detail").innerHTML = `<div class="empty"><h2>Property not found</h2><p>It may have been sold or removed.</p><p><a class="btn btn-primary" href="properties.html">See all properties</a></p></div>`;
    return;
  }
  document.title = `${p.title} | ${s.company}`;
  const rent = p.purpose === "Rent";
  const images = (p.images || []).map(url).filter(Boolean);
  if (!images.length) images.push("images/p1.svg");
  const msg = `Hi ${s.company}, I'm interested in "${p.title}" in ${[p.area, p.city].filter(Boolean).join(", ")} (${pkr(p.price)}).\n${location.href}`;
  const facts = [
    ["Price", pkr(p.price) + (rent ? " / month" : "")], ["Purpose", rent ? "For Rent" : "For Sale"], ["Type", p.type],
    ["Size", p.size], ["Bedrooms", p.beds || ""], ["Bathrooms", p.baths || ""], ["City", p.city], ["Area", p.area],
  ].filter(([, v]) => v);
  const video = url(p.video_url);

  $("#detail").innerHTML = `
    <a href="properties.html" class="back-link">← All properties</a>
    <div class="detail">
      <div class="gallery">
        <div class="gallery-main"><img id="mainImg" src="${images[0]}" alt="${esc(p.title)}">
          ${p.status === "sold" ? '<span class="badge sold">Sold</span>' : `<span class="badge ${rent ? "rent" : ""}">For ${rent ? "Rent" : "Sale"}</span>`}
        </div>
        ${images.length > 1 ? `<div class="thumbs">${images.map((src, i) => `<button type="button" class="thumb${i ? "" : " active"}" data-src="${src}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <aside class="detail-side">
        <span class="tag-pill">${esc(p.type)}</span>
        <h1>${esc(p.title)}</h1>
        <div class="location">📍 ${esc([p.area, p.city].filter(Boolean).join(", "))}</div>
        <div class="price big">${pkr(p.price)}${rent ? " <small>/ month</small>" : ""}</div>
        <div class="detail-actions">
          <a class="btn btn-primary btn-block" href="${wa(s.whatsapp, msg)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
          <a class="btn btn-outline btn-block" href="tel:${esc(s.phone.replace(/\s/g, ""))}">Call ${esc(s.phone)}</a>
        </div>
        <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </aside>
    </div>
    <div class="detail-body">
      <h2>Description</h2>
      ${paragraphs(p.description) || "<p>Contact us for full details and a site visit.</p>"}
      ${video ? `<p><a class="btn btn-outline" href="${video}" target="_blank" rel="noopener">▶ Watch video tour</a></p>` : ""}
    </div>`;

  document.querySelectorAll(".thumb").forEach(t => t.addEventListener("click", () => {
    $("#mainImg").src = t.dataset.src;
    document.querySelectorAll(".thumb").forEach(x => x.classList.toggle("active", x === t));
  }));

  const similar = (await Store.list("listings").catch(() => []))
    .filter(l => l.id !== p.id && l.city === "Karachi" && l.status !== "sold" && l.type === p.type).slice(0, 3);
  if (similar.length) { $("#similar").innerHTML = similar.map(card).join(""); $("#similarWrap").hidden = false; }
})();
