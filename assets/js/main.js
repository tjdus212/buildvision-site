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

  // Form submit (StaticForms - keep modal)
  /* 월 500통의 이메일까지 무료 */
  const form = $("#quoteForm");
  const submitBtn = $("#quoteSubmitBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      const action = form.getAttribute("action");
      if (!action) {
        alert("폼 action이 설정되지 않았어요.");
        return;
      }

      // 버튼 로딩 상태
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "전송 중...";
      }

      try {
        const fd = new FormData(form);

        // replyTo 설정 -> input 추가
        // fd.set("replyTo", "someone@example.com");

        const res = await fetch(action, {
          method: "POST",
          body: fd,
          headers: { "Accept": "application/json" },
        });

        if (res.ok) {
          alert("접수 완료! 영업일 기준 24시간 이내 연락드릴게요.");
          form.reset();
          closeModal(quoteModal);
        } else {
          alert("전송에 실패했어요. 잠시 후 다시 시도해주세요.");
        }
      } catch (err) {
        alert("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "문의 보내기";
        }
      }
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