/* ════════════════════════════════════════════
   FOCUS JIU-JITSU — interações da loja & site
   ════════════════════════════════════════════ */
(function () {
  "use strict";

  const WHATS = "5511999990000";
  const brl = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /* ── catálogo ─────────────────────────────── */
  const PRODUCTS = [
    { id: "faixa-branca",  cat: "faixas",    nome: "Faixa Branca Focus",   desc: "Algodão reforçado, costura dupla. O começo da jornada.", preco: 79,  img: "assets/img/produto-faixa-branca.jpg",  flag: null },
    { id: "faixa-azul",    cat: "faixas",    nome: "Faixa Azul Focus",     desc: "Para quem já venceu o primeiro ano de tatame.",          preco: 89,  img: "assets/img/produto-faixa-azul.jpg",    flag: null },
    { id: "faixa-roxa",    cat: "faixas",    nome: "Faixa Roxa Focus",     desc: "O jogo ficou seu. Algodão premium com ponteira oficial.", preco: 99,  img: "assets/img/produto-faixa-roxa.jpg",    flag: null },
    { id: "faixa-marrom",  cat: "faixas",    nome: "Faixa Marrom Focus",   desc: "Pressão e refinamento a um passo da preta.",               preco: 109, img: "assets/img/produto-faixa-marron.jpg",  flag: null },
    { id: "faixa-preta",   cat: "faixas",    nome: "Faixa Preta Premium",  desc: "Bordado personalizado disponível. A faixa de uma vida.",  preco: 149, img: "assets/img/produto-faixa-preta.jpg",   flag: "Mais vendida", gold: true },
    { id: "kimono-branco", cat: "kimonos",   nome: "Kimono Focus Branco",  desc: "Pearl weave 450g pré-encolhido, corte atlético.",          preco: 449, img: "assets/img/produto-kimono-branco.jpg", flag: null },
    { id: "kimono-preto",  cat: "kimonos",   nome: "Kimono Focus Preto",   desc: "Edição especial com detalhes dourados da equipe.",         preco: 489, img: "assets/img/produto-kimono-preto.jpg",  flag: "Novo", gold: true },
    { id: "rashguard",     cat: "vestuario", nome: "Rash Guard Focus",     desc: "Compressão manga longa, proteção UV, arte geométrica.",    preco: 139, img: "assets/img/produto-rashguard.jpg",     flag: null },
    { id: "shorts",        cat: "vestuario", nome: "Shorts de Luta Focus", desc: "Leve, resistente, com abertura lateral para o jogo de chão.", preco: 159, img: "assets/img/produto-shorts.jpg",   flag: null },
    { id: "mochila",       cat: "acessorios",nome: "Mochila Tatame Focus", desc: "30L com compartimento para kimono úmido e chinelos.",      preco: 219, img: "assets/img/produto-mochila.jpg",       flag: null },
  ];
  const CAT_LABEL = { faixas: "Faixas", kimonos: "Kimonos", vestuario: "Vestuário", acessorios: "Acessórios" };

  /* ── helpers DOM ──────────────────────────── */
  const $ = (s) => document.querySelector(s);
  const grid = $("#shopGrid");
  const toastEl = $("#toast");
  let toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ── render produtos ──────────────────────── */
  let activeFilter = "todos";

  function renderShop() {
    const list = PRODUCTS.filter((p) => activeFilter === "todos" || p.cat === activeFilter);
    grid.innerHTML = list.map((p) => `
      <article class="product" data-id="${p.id}">
        <div class="product-img">
          <img src="${p.img}" alt="${p.nome}" loading="lazy">
          ${p.flag ? `<span class="product-flag${p.gold ? " gold" : ""}">${p.flag}</span>` : ""}
        </div>
        <div class="product-body">
          <span class="product-cat">${CAT_LABEL[p.cat]}</span>
          <h3 class="product-name">${p.nome}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-foot">
            <div class="product-price">${brl(p.preco)}<small>no Pix: ${brl(p.preco * 0.9)}</small></div>
            <button class="add-btn" data-add="${p.id}" aria-label="Adicionar ${p.nome} ao carrinho">+ Add</button>
          </div>
        </div>
      </article>`).join("");
  }

  $("#shopFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    renderShop();
  });

  /* ── carrinho ─────────────────────────────── */
  const CART_KEY = "focus_cart";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { cart = {}; }

  const drawer = $("#drawer");
  const overlay = $("#drawerOverlay");

  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  function cartQty() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.preco * q : 0);
    }, 0);
  }

  function renderCart() {
    $("#cartCount").textContent = cartQty();
    const dc = $("#drawerCount");
    if (dc) dc.textContent = `(${cartQty()})`;
    $("#cartTotal").textContent = brl(cartTotal());
    const body = $("#cartItems");
    const ids = Object.keys(cart).filter((id) => cart[id] > 0);
    if (!ids.length) {
      body.innerHTML = `<div class="cart-empty">SEU CARRINHO ESTÁ VAZIO.<br>QUE TAL UMA FAIXA NOVA?</div>`;
      return;
    }
    body.innerHTML = ids.map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.nome}">
        <div>
          <p class="ci-name">${p.nome}</p>
          <p class="ci-price">${brl(p.preco * cart[id])}</p>
        </div>
        <div class="ci-controls">
          <div class="qty">
            <button data-dec="${id}" aria-label="Diminuir quantidade">−</button>
            <span>${cart[id]}</span>
            <button data-inc="${id}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="ci-remove" data-rem="${id}">remover</button>
        </div>
      </div>`;
    }).join("");
  }

  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  $("#cartOpen").addEventListener("click", openDrawer);
  $("#cartClose").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      saveCart(); renderCart();
      const p = PRODUCTS.find((x) => x.id === id);
      toast(`${p.nome.toUpperCase()} — ADICIONADO AO CARRINHO`);
      return;
    }
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-rem]");
    if (inc) { cart[inc.dataset.inc]++; }
    if (dec) { const id = dec.dataset.dec; cart[id] = Math.max(0, cart[id] - 1); }
    if (rem) { delete cart[rem.dataset.rem]; }
    if (inc || dec || rem) { saveCart(); renderCart(); }
  });

  $("#checkoutBtn").addEventListener("click", () => {
    const ids = Object.keys(cart).filter((id) => cart[id] > 0);
    if (!ids.length) { toast("Seu carrinho está vazio 🙂"); return; }
    const lines = ids.map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return `• ${cart[id]}x ${p.nome} — ${brl(p.preco * cart[id])}`;
    });
    const msg =
      `Olá, Focus Jiu-Jitsu! Quero finalizar meu pedido da loja:%0A` +
      lines.join("%0A") +
      `%0ATotal: ${brl(cartTotal())}`;
    window.open(`https://wa.me/${WHATS}?text=${msg}`, "_blank", "noopener");
    toast("Abrindo o WhatsApp para finalizar seu pedido…");
  });

  /* ── formulário de visita ─────────────────── */
  const form = $("#visitForm");
  const dataInput = $("#vData");
  const hoje = new Date();
  dataInput.min = hoje.toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#vNome").value.trim();
    const whats = $("#vWhats").value.trim();
    const data = dataInput.value;
    let ok = true;
    [ ["#vNome", nome.length >= 3],
      ["#vWhats", whats.replace(/\D/g, "").length >= 10],
      ["#vData", !!data]
    ].forEach(([sel, valid]) => {
      const el = $(sel);
      el.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      toast("CONFIRA OS CAMPOS DESTACADOS");
      return;
    }
    // salva localmente (histórico de agendamentos)
    const visitas = JSON.parse(localStorage.getItem("focus_visitas") || "[]");
    visitas.push({
      nome, whats, data,
      programa: $("#vPrograma").value,
      nivel: $("#vNivel").value,
      horario: $("#vHorario").value,
      obs: $("#vObs").value.trim(),
      criadoEm: new Date().toISOString(),
    });
    localStorage.setItem("focus_visitas", JSON.stringify(visitas));

    const dataFmt = new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    const msg =
      `Olá! Quero confirmar minha visita gratuita à Focus Jiu-Jitsu.%0A` +
      `• Nome: ${encodeURIComponent(nome)}%0A` +
      `• Programa: ${encodeURIComponent($("#vPrograma").value)}%0A` +
      `• Nível: ${encodeURIComponent($("#vNivel").value)}%0A` +
      `• Data: ${dataFmt}%0A` +
      `• Horário: ${$("#vHorario").value}`;
    window.open(`https://wa.me/${WHATS}?text=${msg}`, "_blank", "noopener");

    const note = $("#formNote");
    note.classList.add("ok");
    note.innerHTML = `VISITA DE ${nome.split(" ")[0].toUpperCase()} REGISTRADA — ${dataFmt.toUpperCase()}, ${$("#vHorario").value}. CONFIRMAÇÃO A CAMINHO NO SEU WHATSAPP.`;
    toast("VISITA AGENDADA — CONFIRA O WHATSAPP");
    form.querySelector('button[type="submit"]').textContent = "Visita agendada ✓";
    setTimeout(() => {
      form.reset();
      form.querySelector('button[type="submit"]').textContent = "Confirmar visita gratuita";
      note.classList.remove("ok");
      note.textContent = "Sem compromisso. Confirmamos tudo pelo WhatsApp.";
    }, 9000);
  });

  /* ── menu mobile ──────────────────────────── */
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ── reveal on scroll (com stagger por irmão) ── */
  document.querySelectorAll(".reveal").forEach((el) => {
    const sibs = Array.from(el.parentElement?.children || []).filter((c) => c.classList.contains("reveal"));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i * 120, 480)}ms`;
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ── hero: máscara de linhas entra após o load ── */
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) requestAnimationFrame(() => setTimeout(() => heroTitle.classList.add("in"), 120));

  /* ── parallax suave (lerp) ────────────────── */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plxEls = Array.from(document.querySelectorAll("[data-plx]")).map((el) => ({
    el, speed: parseFloat(el.dataset.plx) || 0, current: 0,
  }));
  if (!reduceMotion && plxEls.length) {
    const tick = () => {
      plxEls.forEach((item) => {
        const r = (item.el.parentElement || item.el).getBoundingClientRect();
        const target = (r.top + r.height / 2 - window.innerHeight / 2) * item.speed;
        item.current += (target - item.current) * 0.075;
        item.el.style.transform = `translate3d(0, ${item.current.toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── boot ─────────────────────────────────── */
  renderShop();
  renderCart();
})();
