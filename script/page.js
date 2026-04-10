export function pages() {
  const landingSection = document.querySelector(".landingPage");
  const gradeSection = document.querySelector(".gradePage");
  const resultSection = document.querySelector(".resultPage");

  function hideAll() {
    if (landingSection) landingSection.style.display = "none";
    if (gradeSection) gradeSection.style.display = "none";
    if (resultSection) resultSection.style.display = "none";
  }

  function showLandingPage() {
    hideAll();
    if (landingSection) landingSection.style.display = "block";
    sessionStorage.setItem("uniSearchPageState", "landing");
  }

  function showGradePage() {
    hideAll();
    if (gradeSection) gradeSection.style.display = "block";
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

  const homeLinks = document.querySelectorAll('a[href="index.html"]');
  homeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.setItem("uniSearchPageState", "landing");
    });
  });

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener("load", () => {

     const savedResult = sessionStorage.getItem("uniSearchResult");
    const state = sessionStorage.getItem("uniSearchPageState") || "landing";

    if (state === "grade") {
      showGradePage();
      return;
    }

    if (state === "result") {
      showResultPage();
      return;
    }

    showLandingPage();
  });

  function advert(mode) {
    const advertImage = document.querySelector(".advert-image img");
    if (!advertImage) return;

    if (mode === "light") {
      advertImage.src = "icons/icons8-bed-96-L.png";
    } else if (mode === "dark") {
      advertImage.src = "icons/icons8-bed-96-D.png";
    }
  }

  function reviewIcon(mode) {
    const reviewIcons = document.querySelectorAll(".reviewIcon img");
    if (!reviewIcons) return;

    if (mode === "light") {
      reviewIcons.forEach((icon) => (icon.src = "icons/quote-L.png"));
    } else if (mode === "dark") {
      reviewIcons.forEach((icon) => (icon.src = "icons/quote-D.png"));
    }
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    let currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      currentTheme = prefersDark ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
    }
    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode");
      advert("light");
      reviewIcon("dark");
    } else {
      document.body.classList.remove("dark-mode");
      advert("dark");
      reviewIcon("light");
    }
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      isDark ? advert("light") : advert("dark");
      isDark ? reviewIcon("dark") : reviewIcon("light");

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}
