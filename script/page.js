export function pages() {
  const landingSection = document.querySelector(".landingPage");
  const gradeSection = document.querySelector(".gradePage");
  const resultSection = document.querySelector(".resultPage");

  const footerSection = document.querySelector("footer");

  function hideAll() {
    if (landingSection) landingSection.style.display = "none";
    if (gradeSection) gradeSection.style.display = "none";
    if (resultSection) resultSection.style.display = "none";
    if (footerSection) footerSection.style.display = "none";
  }

  function showLandingPage() {
    hideAll();
    if (landingSection) landingSection.style.display = "block";
    if (footerSection) footerSection.style.display = "block";
    sessionStorage.setItem("uniSearchPageState", "landing");
  }

  function showGradePage() {
    hideAll();
    if (gradeSection) gradeSection.style.display = "block";
    if (footerSection) footerSection.style.display = "none";
    sessionStorage.setItem("uniSearchPageState", "grade");
  }

  function clearFormSelections() {
    const universitySelect = document.querySelector(".getsch-select-value");
    if (universitySelect) universitySelect.value = "Select University";

    const coreGrades = document.querySelectorAll(".coregrade-js");
    coreGrades.forEach((select) => (select.value = "Select Grade"));

    const electiveCourses = document.querySelectorAll(".electivesub-js");
    electiveCourses.forEach((select) => (select.value = "Select Course"));

    const electiveGrades = document.querySelectorAll(".electivegrade-js");
    electiveGrades.forEach((select) => (select.value = "Select Grade"));

    const prompt = document.querySelector(".prompt");
    if (prompt) prompt.innerHTML = "";
  }

  function showResultPage() {
    hideAll();
    if (resultSection) resultSection.style.display = "block";
    if (footerSection) footerSection.style.display = "none";
    sessionStorage.setItem("uniSearchPageState", "result");

    clearFormSelections();
  }

  const getStartedBtns = document.querySelectorAll(".getStarted-btn");
  getStartedBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showGradePage();
    }),
  );

  const backToLandingBtn = document.querySelector(".backTolanding");
  if (backToLandingBtn)
    backToLandingBtn.addEventListener("click", () => showLandingPage());

  const returnHomeBtn = document.getElementById("return-home-btn");
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", () => {
      showLandingPage();
      sessionStorage.setItem("uniSearchPageState", "landing");
      sessionStorage.removeItem("uniSearchResult");
    });
  }

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener("load", () => {
    const savedResult = sessionStorage.getItem("uniSearchResult");
    const state = sessionStorage.getItem("uniSearchPageState") || "landing";

    if (state === "grade") {
      showGradePage();
      footerSection.style.display = "none";
      return;
    }

    if (state === "result" && savedResult) {
      showResultPage();
      if (typeof window.restoreResultFromStorage === "function") {
        window.restoreResultFromStorage();
        if (footerSection) footerSection.style.display = "none";
      }
      return;
    }

    showLandingPage();
  });

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    let currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      currentTheme = prefersDark ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
    }
    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}
