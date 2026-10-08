const progressBar = document.querySelector(".scroll-progress");

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".main-nav a");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 75}ms`;
  revealObserver.observe(element);
});

const filterTabs = document.querySelectorAll(".equipment-tab");
const equipmentCards = document.querySelectorAll(".equipment-card[data-category]");

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.filter;
    filterTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    equipmentCards.forEach((card) => {
      card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
    });
  });
  tab.addEventListener("keydown", (event) => {
    const currentIndex = [...filterTabs].indexOf(tab);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % filterTabs.length
        : event.key === "ArrowLeft"
          ? (currentIndex - 1 + filterTabs.length) % filterTabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? filterTabs.length - 1
              : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    filterTabs[nextIndex].focus();
    filterTabs[nextIndex].click();
  });
});

const interactiveStage = document.querySelector(".equipment-stage");
const hero = document.querySelector(".hero");
const heroDumbbell = document.querySelector(".dumbbell--hero");
let pointerFrame = null;

hero.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || window.innerWidth < 681) return;
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    interactiveStage.style.transform = `translate3d(${x * 15}px, ${y * 13}px, 0) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  });
});

hero.addEventListener("pointerleave", () => {
  interactiveStage.style.transform = "";
});

heroDumbbell.addEventListener("pointerenter", () => interactiveStage.classList.add("is-hovered"));
heroDumbbell.addEventListener("pointerleave", () => interactiveStage.classList.remove("is-hovered"));

const joinForm = document.querySelector("#join-form");
const formMessage = document.querySelector("#form-message");

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!joinForm.reportValidity()) return;
  const name = new FormData(joinForm).get("name").trim();
  formMessage.textContent = `Thanks, ${name}. This demo isn’t connected to a booking inbox yet.`;
  joinForm.reset();
});
