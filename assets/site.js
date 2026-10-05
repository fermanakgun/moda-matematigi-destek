/* Moda Matematiği destek sitesi: dil düğmesi, "Tüm projeler" menüsü, "Diğer uygulamalar" kartları.
   Proje listesi proje-tanitim/assets/projects.js (window.PROJECTS) içinden gelir; yoksa statik bağlantılar kalır. */
(function () {
  var BASE = "https://fermanakgun.github.io/proje-tanitim/", SELF = "moda-matematigi";
  var d = document, root = d.documentElement;
  function lang() { return root.getAttribute("data-lang") === "tr" ? "tr" : "en"; }
  function el(t, c, txt) { var e = d.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; }
  function page(p, l) { return BASE + p.path + (l === "en" ? "en.html" : ""); }

  function syncLang() {
    var l = lang();
    var links = d.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-set-lang") === l) links[i].setAttribute("aria-current", "true");
      else links[i].removeAttribute("aria-current");
    }
  }
  function setLang(l) {
    root.setAttribute("data-lang", l); root.lang = l;
    try { localStorage.setItem("mm-lang", l); } catch (e) {}
    try { history.replaceState(null, "", "#" + l); } catch (e) {}
    syncLang(); build();
  }
  var lk = d.querySelectorAll("[data-set-lang]");
  for (var i = 0; i < lk.length; i++) lk[i].addEventListener("click", function (e) { e.preventDefault(); setLang(this.getAttribute("data-set-lang")); });
  window.addEventListener("hashchange", function () { var h = location.hash.replace("#", ""); if ((h === "tr" || h === "en") && h !== lang()) setLang(h); });

  var menuHost = d.getElementById("mm-menu"), staticMenu = menuHost && menuHost.innerHTML;
  var othersList = d.getElementById("mm-others-list"), staticOthers = othersList && othersList.innerHTML;

  function build() {
    var P = window.PROJECTS, l = lang();
    if (!P || !P.length) return;
    if (othersList) {
      othersList.innerHTML = "";
      P.forEach(function (p) {
        if (p.id === SELF) return;
        var li = el("li"), a = el("a", "card"); a.href = page(p, l);
        var img = el("img"); img.src = BASE + p.icon; img.alt = ""; img.width = 40; img.height = 40;
        var t = el("span", "card-t"); t.appendChild(el("strong", "", p[l])); t.appendChild(el("small", "", p.short[l]));
        a.appendChild(img); a.appendChild(t); li.appendChild(a); othersList.appendChild(li);
      });
      P.forEach(function (p) {
        if (p.id !== SELF) return;
        var li = el("li"), a = el("a", "", (l === "tr" ? "Moda Matematiği tanıtım sayfası" : "Diamond Wardrobe product page")); a.href = page(p, l);
        li.appendChild(a); othersList.appendChild(li);
      });
    }
    if (menuHost) buildMenu(P, l);
  }

  function buildMenu(P, l) {
    menuHost.innerHTML = "";
    var btn = el("button", "menu-btn", l === "tr" ? "Tüm projeler" : "All projects");
    btn.type = "button"; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-haspopup", "true"); btn.id = "mm-menu-btn";
    var ul = el("ul", "menu-list"); ul.hidden = true; ul.setAttribute("aria-labelledby", "mm-menu-btn");
    P.forEach(function (p) {
      var li = el("li"), a = el("a"); a.href = page(p, l);
      var img = el("img"); img.src = BASE + p.icon; img.alt = ""; img.width = 28; img.height = 28;
      a.appendChild(img); a.appendChild(el("span", "", p[l] + (p.id === SELF ? (l === "tr" ? " (tanıtım)" : " (product page)") : "")));
      li.appendChild(a); ul.appendChild(li);
    });
    var sep = el("li", "rule"); sep.setAttribute("role", "presentation"); ul.appendChild(sep);
    var li = el("li"), a = el("a", "", l === "tr" ? "Tüm projeler sayfası" : "All projects page"); a.href = BASE; li.appendChild(a); ul.appendChild(li);
    menuHost.appendChild(btn); menuHost.appendChild(ul);

    function open(o, focusFirst) {
      ul.hidden = !o; btn.setAttribute("aria-expanded", o ? "true" : "false");
      if (o && focusFirst) { var f = ul.querySelector("a"); if (f) f.focus(); }
    }
    btn.addEventListener("click", function () { open(ul.hidden); });
    btn.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); open(true, true); } });
    ul.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(ul.querySelectorAll("a")), i = items.indexOf(d.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === "Tab") open(false);
    });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && !ul.hidden) { open(false); btn.focus(); } });
    d.addEventListener("click", function (e) { if (!ul.hidden && !menuHost.contains(e.target)) open(false); });
  }

  syncLang(); build();
})();
