document.documentElement.classList.add("js-enabled");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function setMenuOpen(isOpen) {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  navigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sampleForm = document.querySelector("#sample-form");
const formStatus = document.querySelector("#form-status");

sampleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!sampleForm.reportValidity()) return;

  const formData = new FormData(sampleForm);
  const fields = [
    ["Name", formData.get("name")],
    ["Company", formData.get("company")],
    ["Work email", formData.get("email")],
    ["Estimated quantity", sampleForm.elements.quantity.selectedOptions[0].textContent],
    ["Interested in", sampleForm.elements.interest.selectedOptions[0].textContent],
    ["Message", formData.get("message") || "Not provided"]
  ];
  const body = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
  const subject = `Embiox ${sampleForm.elements.interest.value} enquiry from ${formData.get("company")}`;
  const mailto = `mailto:info@embiox.lv?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formStatus.textContent = "Your email app will open with the request ready to review. Nothing is sent until you choose to send it.";
  window.location.href = mailto;
});
