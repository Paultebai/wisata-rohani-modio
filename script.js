
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const backTop = document.querySelector(".back-top");

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  if (toggle && nav) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav?.classList.remove("open")));

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    if (a.dataset.page === path) a.classList.add("active");
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }});
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  backTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  document.querySelectorAll("[data-lightbox]").forEach(el => el.addEventListener("click", () => {
    const modal = document.querySelector("#photoModal");
    if (!modal) return;
    modal.querySelector("img").src = el.dataset.lightbox;
    modal.querySelector(".modal-caption").textContent = el.dataset.caption || "";
    modal.classList.add("open");
    modal.querySelector(".modal-close").focus();
  }));
  document.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click", () => btn.closest(".modal").classList.remove("open")));
  document.querySelectorAll(".modal").forEach(m => m.addEventListener("click", e => { if(e.target === m) m.classList.remove("open"); }));
  document.addEventListener("keydown", e => { if(e.key === "Escape") document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open")); });

  document.querySelectorAll("[data-copy-link]").forEach(btn => btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); btn.textContent = "Tautan tersalin"; setTimeout(()=>btn.textContent="Salin tautan",1800); }
    catch { alert("Tautan: " + location.href); }
  }));
  // Social share links in footer. Instagram has no official web URL-sharing endpoint,
  // so it copies the page URL and opens Instagram for the user.
  const pageUrl = encodeURIComponent(location.href);
  const shareText = encodeURIComponent("Wisata Rohani Modio — Jejak Injil di Tanah Mee");
  document.querySelectorAll("[data-share-social]").forEach(link => {
    const network = link.dataset.shareSocial;
    if (network === "whatsapp") link.href = `https://wa.me/?text=${shareText}%20${pageUrl}`;
    if (network === "facebook") link.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    if (network === "x") link.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
    if (network === "instagram") link.href = "https://www.instagram.com/";
    if (network === "instagram") link.addEventListener("click", async (e) => {
      e.preventDefault();
      try { await navigator.clipboard.writeText(location.href); } catch {}
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      const old = link.title; link.setAttribute("aria-label", "Tautan disalin — buka Instagram untuk membagikan"); link.title = "Tautan disalin — bagikan di Instagram";
      setTimeout(() => { link.title = old; link.setAttribute("aria-label", "Bagikan melalui Instagram"); }, 2200);
    });
  });

  document.querySelectorAll("[data-share]").forEach(btn => btn.addEventListener("click", async () => {
    const data = {title:document.title,text:"Wisata Rohani Modio — Jejak Injil di Tanah Mee",url:location.href};
    if (navigator.share) await navigator.share(data); else { try { await navigator.clipboard.writeText(location.href); btn.textContent="Tautan tersalin"; } catch {} }
  }));

  const search = document.querySelector("#personSearch");
  if (search) search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    document.querySelectorAll("[data-person]").forEach(card => card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none");
  });

  document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll("[data-category]").forEach(card => {
      card.style.display = f === "all" || card.dataset.category === f ? "" : "none";
    });
  }));

  const form = document.querySelector("#visitForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const msg = `Halo Wisata Rohani Modio,%0A%0ANama: ${encodeURIComponent(fd.get("nama"))}%0AKontak: ${encodeURIComponent(fd.get("kontak"))}%0ARencana kunjungan: ${encodeURIComponent(fd.get("rencana"))}%0APesan: ${encodeURIComponent(fd.get("pesan"))}`;
    window.open("https://wa.me/6281234567890?text="+msg, "_blank", "noopener,noreferrer");
  });

  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = year);
});
