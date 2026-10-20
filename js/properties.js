(async function () {
  const { $, $$, card } = Layout;
  const { esc } = BZ;
  await Layout.init("properties");
  const all = (await Store.list("listings").catch(() => [])).filter(listing => listing.city === "Karachi");
  const form = $("#filterForm");

  const areaOptions = Store.KARACHI_AREA_GROUPS.map(group => `<optgroup label="${esc(group.name)}">${group.areas.map(area => `<option value="${esc(area)}">${esc(area)}</option>`).join("")}</optgroup>`).join("");
  $("#fArea").insertAdjacentHTML("beforeend", areaOptions);

  // Start from the filters in the page address (from the home page search or city links)
  const params = new URLSearchParams(location.search);
  for (const [k, v] of params) if (form.elements[k]) form.elements[k].value = v;

  function render() {
    const f = Object.fromEntries(new FormData(form));
    const q = (f.q || "").trim().toLowerCase();
    let list = all.filter(l =>
      (!f.purpose || l.purpose === f.purpose) &&
      (!f.area || l.area === f.area) &&
      (!f.type || l.type === f.type) &&
      (!+f.budget || +l.price <= +f.budget) &&
      (!q || [l.title, l.area, l.city, l.description, l.type].join(" ").toLowerCase().includes(q))
    );
    if (f.sort === "low") list.sort((a, b) => a.price - b.price);
    if (f.sort === "high") list.sort((a, b) => b.price - a.price);
    $("#propertyGrid").innerHTML = list.length ? list.map(card).join("")
      : `<div class="empty">No properties match these filters. <a href="index.html#contact">Send us your requirement</a> and we will find one for you.</div>`;
    $("#resultsNote").innerHTML = `${list.length} ${list.length === 1 ? "property" : "properties"} found` +
      ([...new FormData(form).values()].some(Boolean) ? ` · <button type="button" id="clear">Clear filters</button>` : "");
    $("#clear")?.addEventListener("click", () => { form.reset(); history.replaceState(null, "", "properties.html"); render(); });

    const clean = new URLSearchParams([...new FormData(form)].filter(([, v]) => v));
    history.replaceState(null, "", "properties.html" + (clean.toString() ? "?" + clean : ""));
  }
  form.addEventListener("input", render);
  form.addEventListener("submit", e => { e.preventDefault(); render(); });
  render();
})();
