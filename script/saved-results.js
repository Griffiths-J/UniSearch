function initSavedResults() {
  const resultHero = document.querySelector(".savedResultsPagehero");
  const savedResultActions = document.querySelector(".saved-result-actions");

  if (!resultHero || !savedResultActions) {
   /*  console.error("Container elements not found - DOM may not be ready"); */
    return;
  }

  function displayNoDataMessage() {
    resultHero.innerHTML = `
      <div class="no-saved-results">
        <div class="no-results-icon">
          <img src="" alt="No results" />
        </div>
        <h2>No Saved Results</h2>
        <p>You haven't checked for eligible courses yet.<br>(While you are in session your results are saved here)</p>
        <p>Click "Get Started" to find university courses that match your WASSCE grades.</p>
        <a href="#" class="heroButton getStarted-btn" onclick="goToGradePage()">Get Started Now</a>
      </div>
    `;
    savedResultActions.innerHTML = "";
  }


  function displaySavedResults(data) {
    const { elegible, aggregate, Uni,weakGrades =[] } = data;

    if (!Array.isArray(elegible)) {
     /*  console.error("elegible is not an array:", elegible); */
      displayNoDataMessage();
      return;
    }

    const listItems = elegible
      .map(
        (p) => `
       <div class="result-card">
          <div class="result-card-left">
              <div class="result-card-top">${p.program_name}</div>
          <div class="Co_Fa">
              <div class="result-card-college">
                <img src="icons/icons8-pentagon-24.png" alt="icon">${p.college}</div>
              <div class="result-card-faculty">
                <img src="icons/icons8-pencil-24.png" alt="icon">${p.faculty}</div>
            </div>
          </div>
          <div class="result-card-right">
            <div class="resultAgg">${p.cutoff_criteria.minimum_aggregate}</div>
            <div class="resultAgg-t1">AGG</div>
          </div>
      </div>
    `,
      )
      .join("");

    const noProgramsHtml = elegible.length === 0
        ? `
         <div class="no-match-card">
          <span class="status-badge">Payment Confirmed ✅</span>
          
          <div class="no-match-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          
          <h2>No Direct Matches</h2>
          
          <p class="message">
            Based on your aggregate and electives, you don't currently meet the standard requirements for programs at <strong>${Uni}</strong>.
          </p>

          <div class="wa-link-wrapper">
            <p style="font-size: 0.9rem; color: var(--muted-text); margin-bottom: 12px;">Don't give up! We can help you find alternatives:</p>
            <a href="https://wa.me/+233509304981?text=Hi Unilift, I need help with selecting courses for my grade in ${Uni}. Didn't meet the requirements." class="assistant-link">
              <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp_logo">
              TALK TO AN ASSISTANT
            </a>
          </div>
     </div>
       `
        : "";

        let subjectHtml = '';
            weakGrades.map((e)=>{
                subjectHtml+=`
                    ${e.subject},
                `
            }) 

        let gradeHtml = '';
         weakGrades.map((e)=>{
                gradeHtml+=`
                   ${e.grade},
                `
            })

        const weakGradesHtml = weakGrades.length>0 ? `
           <div class="weakmarksave" style="font-style:italic">
               Getting ${gradeHtml} in ${subjectHtml} respectively may reduce your chances of admission.
               Even though you may see eligible programs, universities often prioritize stronger grades.
               <a href="https://wa.me/+233509304981?text=Hi Unilift,, I need help with selecting courses for my grades."><span style="white-space:nowrap" >Talk to an assistant </span></a>
            </div>   
        `: '';

    resultHero.innerHTML = `
      <div class="result-summary">
          <h2>Saved Courses at <br><span class="result-summaryUni">${Uni}</span> </h2>
          <div class="result-summaryBox">
            <div class="resultAgg-t">Your Aggregrate</div> <span>|</span>
            <div class="resultAgg">${aggregate}</div>
          </div>
      </div>
      ${noProgramsHtml}
      <div class="numberCourses">${elegible.length} COURSE${elegible.length > 1 ? "S" : ""} FOUND</div>
      <div class="eligible-programs">${listItems}</div>
      ${weakGradesHtml}
    `;

    savedResultActions.innerHTML = `
      <div class="result-actions-buttons">
        <a href="#" class="heroButton" onclick="goToGradePage()">Check New Results</a>
      </div>
    `;
  }

  let savedResult = localStorage.getItem("uniSearchResult");

  if (savedResult) {
    try {
      const parsed = JSON.parse(savedResult);
     /*  console.log("Parsed result:", parsed); */

      if (parsed && Array.isArray(parsed.elegible)) {
       /*  console.log("Displaying saved results..."); */
        displaySavedResults(parsed);
      } else {
        /* console.log("Result structure is invalid - showing no data message"); */
        displayNoDataMessage();
      }
    } catch (e) {
      console.error("Error parsing saved results:", e);
      displayNoDataMessage();
    }
  } else {
    /* console.log("No saved results found in sessionStorage"); */
    displayNoDataMessage();
  }

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
    const exclamationMark = document.querySelector('.no-results-icon img');
    if (!reviewIcons) return;
    if(!exclamationMark) return;

    if (mode === "light") {
      reviewIcons.forEach((icon) => (icon.src = "icons/quote-L.png"));
      exclamationMark.src= "icons/exclamation-mark-L.png"
    } else if (mode === "dark") {
      reviewIcons.forEach((icon) => (icon.src = "icons/quote-D.png"));
      exclamationMark.src= "icons/exclamation-mark-D.png";
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
      document.documentElement.classList.add("dark-mode");
      advert("light");
      reviewIcon("dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      advert("dark");
      reviewIcon("light");
    }
    themeToggle.addEventListener("click", () => {

      const root = document.documentElement
      root.classList.toggle("dark-mode");

      const isDark = root.classList.contains("dark-mode");

      isDark ? advert("light") : advert("dark");
      isDark ? reviewIcon("dark") : reviewIcon("light");

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  const homeLinks = document.querySelectorAll('a[href="index.html"]');
  homeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.setItem("uniSearchPageState", "landing");
    });
  });

  
  const getStartedBtns = document.querySelectorAll(".getStarted-btn");
  getStartedBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      goToGradePage();
    });
  });
}

window.goToGradePage = function () {
  sessionStorage.setItem("uniSearchPageState", "grade");

  window.location.href = "index.html";
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSavedResults);
} else {
  setTimeout(initSavedResults, 0);
}
