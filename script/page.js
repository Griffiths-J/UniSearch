export function pages() {
  const landingSection = document.querySelector(".landingPage");
  const gradeSection = document.querySelector(".gradePage");
  const resultSection = document.querySelector(".resultPage");
  const hideLoader = document.querySelector(".controlLoader");

  function hideAll() {
    if (landingSection) landingSection.style.display = "none";
    if (gradeSection) gradeSection.style.display = "none";
    if (resultSection) resultSection.style.display = "none";
  }

  function showLandingPage() {
    hideAll();
    if (landingSection) {
      landingSection.style.display = "block";
    }
    if (hideLoader) {
      hideLoader.style.display = "none";
    }
    sessionStorage.setItem("uniSearchPageState", "landing");
  }

  function showGradePage() {
    hideAll();
    if (gradeSection) {
      gradeSection.style.display = "block";
    }
    if (hideLoader) {
      hideLoader.style.display = "none";
    }
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
    if (resultSection) {
      resultSection.style.display = "block";
    }
    if (hideLoader) {
      hideLoader.style.display = "none";
    }
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
      localStorage.removeItem("uniSearchResult");
    });
  }

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener("pageshow", () => {
    const state = sessionStorage.getItem("uniSearchPageState");
    const hasSavedData = localStorage.getItem("uniSearchResult");

    if (!state || state === "landing") {
      showLandingPage();
      return;
    }

    if (state === "grade") {
      showGradePage();
      return;
    }

    /*   if (state === "result" && savedResult) {
    showResultPage();
    return;
  } */

    if (state === "result" && hasSavedData) {
      showResultPage();

      if (window.restoreResultFromStorage) {
        window.restoreResultFromStorage();
      }
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
  let currentTheme = localStorage.getItem("theme");

  if (!currentTheme) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    currentTheme = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
  }
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    advert("light");
    reviewIcon("dark");
  } else {
    document.documentElement.classList.remove("dark-mode");
    advert("dark");
    reviewIcon("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      root.classList.toggle("dark-mode");

      const isDark = root.classList.contains("dark-mode");

      isDark ? advert("light") : advert("dark");
      isDark ? reviewIcon("dark") : reviewIcon("light");

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}
