// --- Utilities ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function openModal(modal) {
  if (!modal) return;
  modal.showModal();
  document.body.style.overflow = "hidden";
}
function closeModal(modal) {
  if (!modal) return;
  modal.close();
  document.body.style.overflow = "";
}

// --- Init ---
(() => {
  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Quote modal
  const quoteModal = $("#quoteModal");

  [
    "#openQuoteBtnTop",
    "#openQuoteBtnMobile",
    "#openQuoteBtnHero",
    "#openQuoteBtnServices",
    "#openQuoteBtnTeam",
    "#openQuoteBtnTeamBanner",
    "#openQuoteBtnContact",
    "#eventBtn"
  ].forEach((id) => {
    const btn = $(id);
    if (btn) btn.addEventListener("click", () => openModal(quoteModal));
  });

  const closeBtn = $("#closeQuoteBtn");
  if (closeBtn) closeBtn.addEventListener("click", () => closeModal(quoteModal));

  if (quoteModal) {
    quoteModal.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  }

  // Form submit (static: mailto)
  const form = $("#quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const company = (fd.get("company") || "").toString().trim();
      const phone = (fd.get("phone") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      if (!company || !phone || !message) {
        alert("입력값을 확인해주세요.");
        return;
      }

      const subject = encodeURIComponent(`[견적요청] ${company}`);
      const body = encodeURIComponent(
        `회사명: ${company}\n연락처: ${phone}\n\n요청 내용:\n${message}\n`
      );

      window.location.href = `mailto:estelle0610@buildvision.co.kr?subject=${subject}&body=${body}`;
      form.reset();
      closeModal(quoteModal);
    });
  }

  // Mobile menu auto-close on link click
  const mobileMenu = $("#mobileMenu");
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  // ----------------------------
  // Top menu active (ScrollSpy)
  // ----------------------------
  const sectionIds = ["home", "services", "growth", "team", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linksById = new Map();
  sectionIds.forEach((id) => {
    const links = [
        ...$$(`#siteNav a[href="#${id}"]`),
        ...$$(`#mobileMenu a[href="#${id}"]`)
    ];
    if (links.length) linksById.set(id, links);
  });

  function clearActive() {
    linksById.forEach((links) => links.forEach((a) => a.classList.remove("nav-active")));
  }

  function setActive(id) {
    clearActive();
    const links = linksById.get(id);
    if (links) links.forEach((a) => a.classList.add("nav-active"));
  }

  // 클릭 시 즉시 활성화 + URL hash 반영(기본 동작 유지)
  linksById.forEach((links, id) => {
    links.forEach((a) => {
      a.addEventListener("click", () => setActive(id));
    });
  });

  // --- ScrollSpy (stable 방식: scrollY 기준) ---
const HEADER_OFFSET = 110; // 헤더 높이 + 여유 공간 고려

function getCurrentSectionId() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 8;
  if (nearBottom) return "contact";

  const y = window.scrollY + HEADER_OFFSET;

  let current = sections[0]?.id || "home";
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec.id;
  }
  return current;
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    setActive(getCurrentSectionId());
    ticking = false;
  });
}

// 이벤트 배너: 토글(접기/펼치기) + 오픈(견적 모달)
const eventCard = $("#eventCard");
const eventToggle = $("#eventToggle");
const eventOpen = $("#eventOpen");


if (eventToggle && eventCard) {
  eventToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    eventCard.classList.toggle("event-collapsed");
  });
}

if (eventOpen && quoteModal) {
  eventOpen.addEventListener("click", () => {
    openModal(quoteModal);
  });
}


window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

  // 초기 활성화
  const hash = (location.hash || "").replace("#", "");
if (sectionIds.includes(hash)) setActive(hash);
else setActive(getCurrentSectionId());

// --- Tabs (Collaboration) ---
// DOM이 만들어진 뒤에 실행되게, init 내부에서 실행
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

if (tabBtns.length && tabPanels.length) {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-tab");

      // 버튼 active
      tabBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // 패널 active
      tabPanels.forEach((p) => p.classList.remove("is-active"));
      const panel = document.querySelector(`.tab-panel[data-panel="${key}"]`);
      if (panel) panel.classList.add("is-active");
    });
  });
}
})();