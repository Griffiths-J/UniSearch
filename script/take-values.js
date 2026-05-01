


async function unis() {

  function renderEligiblePrograms(elegible, aggregate, Uni) {
    const resultHero = document.querySelector(".resultPagehero");
    if (!resultHero) {
      console.error("resultPagehero element not found");
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

    const noProgramsHtml =
      elegible.length === 0
        ? `
       <div class="result-card no-match">
        <h2>Payment complete ✅</h2>
        <p class="no-p1"><span>⚠️</span> No eligible programs matched your aggregate and electives.</p>
        <div class="wa-link">
          <p class="no-p2">Get a personal assistant for your grade: </p>
          <a href="https://wa.me/+233256689934?text=Hi,I need help with selecting courses for my grade in ${Uni}">
            <img src="./icons/icons8-whatsapp-48.png" alt="whatsapp_logo">CHAT HERE
          </a>
        </div>
      </div>
    `
        : "";

    resultHero.innerHTML = `
      <div class="result-summary">
          <h2>Eligible Courses at <br><span class="result-summaryUni">${Uni}</span> </h2>
          <div class="result-summaryBox">
            <div class="resultAgg-t">Your Aggregrate</div> <span>|</span>
            <div class="resultAgg">${aggregate}</div>
          </div>
      </div>
      ${noProgramsHtml}
      <div class="numberCourses">${elegible.length} COURSE${elegible.length > 1 ? "S" : ""} FOUND</div>
      <div class="eligible-programs">${listItems}</div>
    `;

    const resultData = JSON.stringify({ elegible, aggregate, Uni });
    sessionStorage.setItem("uniSearchResult", resultData);
    sessionStorage.setItem("uniSearchPageState", "result");
  }

  window.restoreResultFromStorage = function () {
    const stored = sessionStorage.getItem("uniSearchResult");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.elegible)) {
        renderEligiblePrograms(
          parsed.elegible,
          parsed.aggregate,
          parsed.Uni || "N/A",
        );
      }
    } catch (e) {
      console.error("Failed to restore result", e);
    }
  };

  const returnHomeBtn = document.getElementById("return-home-btn");
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", () => {
      if (window.showLandingPage) window.showLandingPage();
      sessionStorage.setItem("uniSearchPageState", "landing");
      sessionStorage.removeItem("uniSearchResult");
    });
  }

  function restoreResultPageIfNeeded() {
    const pageState = sessionStorage.getItem("uniSearchPageState");
    if (pageState !== "result") return;

    const stored = sessionStorage.getItem("uniSearchResult");
    if (!stored) return;

    if (window.showResultPage) window.showResultPage();
    window.restoreResultFromStorage();
  }

  function Getvalues() {
    const university = document.querySelector(".getsch-select-value").value;
    if (university === "Select University" || university === "") {
      document.querySelector(".prompt").innerHTML =
        "Select university and all inputs";
      setTimeout(() => {
        document.querySelector(".prompt").innerHTML = "";
      }, 5000);
      throw new Error("Select university");
    }

    let resultUniTitle;
    switch (university) {
      case "KNUST":
        resultUniTitle = "Kwame Nkrumah University of Science Technology";
        break;
      case "UG":
        resultUniTitle = "University of Ghana";
        break;
      case "UCC":
        resultUniTitle = "University of Cape Coast";
        break;
      case "UMAT":
        resultUniTitle = "University of Mines and Technology";  
        break;
      case "UPSA":
        resultUniTitle = "University of Professional Studies Accra"; 
        break;
    }

    const userResult = [];

    //core Subjects
    const allCRows = document.querySelectorAll(".core-instance");
    const coreSubresult = [];

    allCRows.forEach((row) => {
      let name = row.querySelector(".coresub-js").innerHTML;
      let grade = row.querySelector(".coregrade-js").value;
      let type = "core";

      if (grade === "Select Grade" || grade === "") {
        document.querySelector(".prompt").innerHTML =
          "Select all core subject grades";
        setTimeout(() => {
          document.querySelector(".prompt").innerHTML = "";
        }, 5000);
        throw new Error("Missing core grade");
      }

      coreSubresult.push({
        type,
        name,
        grade,
      });
    });

    //electives
    const electiveSubresult = [];
    const allERows = document.querySelectorAll(".elective-instance");

    allERows.forEach((row) => {
      let name = row.querySelector(".electivesub-js").value;
      let grade = row.querySelector(".electivegrade-js").value;

      let type = "elective";

      if (name === "Select Course" || grade == "Select Grade" || grade === "") {
        document.querySelector(".prompt").innerHTML =
          "Select all elective subjects and grades";
        setTimeout(() => {
          document.querySelector(".prompt").innerHTML = "";
        }, 5000);
        throw new Error("Missing elective selection");
      }

      let grade_main = knustCheck(grade);
      electiveSubresult.push({
        type,
        name,
        grade: grade_main,
      });
    });

    if (coreSubresult.length === 0 && electiveSubresult.length === 0) {
      document.querySelector(".prompt").innerHTML =
        "No selections made. Please choose your subjects.";
      setTimeout(() => {
        document.querySelector(".prompt").innerHTML = "";
      }, 5000);
      return;
    }

    //add core to main array
    coreSubresult.forEach((course) => {
      let finalSub = course.name;
      let finalGrade = parseInt(course.grade);
      let finalType = course.type;

      userResult.push({
        finalType,
        finalSub,
        finalGrade,
      });
    });
    //add elective to main array
    electiveSubresult.forEach((course) => {
      let finalSub = course.name;
      let finalGrade = parseInt(course.grade);
      let finalType = course.type;

      userResult.push({
        finalType,
        finalSub,
        finalGrade,
      });
    });

    const allResult = userResult;

    const cores = allResult.filter((e) => e.finalType === "core");
    const elective = allResult.filter((e) => e.finalType === "elective");

    const electiveNames = elective.map((e) => e.finalSub);
    const uniqueElectiveName = new Set(electiveNames);

    if (uniqueElectiveName.size !== electiveNames.length) {
      document.querySelector(".prompt").innerHTML =
        "You selected two same courses";
      setTimeout(() => {
        document.querySelector(".prompt").innerHTML = "";
      }, 5000);

      return;
    }

    function knustCheck(grade) {
      if (university === "KNUST") {
        if (grade >= 4 && grade <= 6) {
          grade = 4;
        } else {
          grade = grade;
        }
      }
      return grade;
    }

    const englishSelect = cores.find((en) => en.finalSub.includes("English"));
    const englishGrade = englishSelect.finalGrade;
    const englishGrade_main = knustCheck(englishGrade);

    const mathSelect = cores.find((mth) =>
      mth.finalSub.includes("Mathematics"),
    );
    const mathGrade = mathSelect.finalGrade;
    const mathGrade_main = knustCheck(mathGrade);

    const scienceSelect = cores.find((sci) => sci.finalSub.includes("Science"));
    const scienceGrade = scienceSelect.finalGrade;
    const scienceGrade_main = knustCheck(scienceGrade);

    const socialSelect = cores.find((soc) => soc.finalSub.includes("Social"));
    const socialGrade = socialSelect.finalGrade;

    const bestThreeElective = elective
      .map((el) => el.finalGrade)
      .sort((a, b) => a - b)
      .slice(0, 3)
      .reduce((sum, grade) => sum + grade, 0);

    console.log(bestThreeElective);

    const finalAggregrate =
      mathGrade_main +
      scienceGrade_main +
      englishGrade_main +
      bestThreeElective;

    const electiveOne = elective[0];
    const electivetwo = elective[1];
    const electivethree = elective[2];
    const electivefour = elective[3];

    const lete = [electiveOne, electivetwo, electivethree, electivefour];
    let i;
    let j;
    for (i = 0; i < lete.length - 1; i++) {
      for (j = 0; j < lete.length - 1; j++) {
        if (lete[j].finalGrade > lete[j + 1].finalGrade) {
          let temp = lete[j];
          lete[j] = lete[j + 1];
          lete[j + 1] = temp;
        }
      }
    }

    const finalBestThree = lete.slice(0, 4);
    console.log(finalBestThree);

    const studentData = {
      core_math: mathGrade_main,
      int_science: scienceGrade_main,
      english: englishGrade_main,
      [finalBestThree[0].finalSub]: finalBestThree[0].finalGrade,
      [finalBestThree[1].finalSub]: finalBestThree[1].finalGrade,
      [finalBestThree[2].finalSub]: finalBestThree[2].finalGrade,
      [finalBestThree[3].finalSub]: finalBestThree[3].finalGrade,
      aggregrate: finalAggregrate,
      Uni: resultUniTitle,
    };

    console.log(studentData);

    document.querySelector('.modal-overlay').style.display = "flex";
    document.getElementById("payment-modal").style.display = "flex";
    document.querySelector('.cancelPayment').style.display = "none";
    document.getElementById("display-agg").innerText = `${finalAggregrate}`;

    document.getElementById("pay-button").onclick = function (e) {
      e.preventDefault();
      const name = document.getElementById("student-name").value;
      const email = document.getElementById("student-email").value;

      if (!name || !email.includes("@")) {
        document.querySelector(".checkinputerror").innerHTML =
          "Enter valid name and email";
        setTimeout(() => {
          document.querySelector(".checkinputerror").innerHTML = "";
        }, 5000);
        return;
      }

      document.querySelector(".resultPage").style.display = "none";
      const handler = PaystackPop.setup({
        key: "pk_live_db6a66b9372f3b2a5c775bfd81dc6f3171a7e66a",
        email: email,
        amount: 1150,
        currency: "GHS",
        ref: "" + Math.floor(Math.random() * 99999 + 1),
        callback:  function (responds) {
        document.getElementById("payment-modal").style.display = "none";
        
        //result page +  loader
        if (window.showResultPage) {
          window.showResultPage();
        } else {
          const resultPageEl = document.querySelector(".resultPage");
          if (resultPageEl) resultPageEl.style.display = "block";
        }

        const resultHero = document.querySelector(".resultPagehero");
        if (resultHero) {
          resultHero.innerHTML = `
            <div class="loader-container">
              <div class="loader-spinner"></div>
              <p class="loader-text">Fetching your eligible programs...</p>
            </div>
          `;
        }

        fetch("/.netlify/functions/get-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ university, studentData })
        })
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch results");
            return res.json();
          })
          .then(result => {
            renderEligiblePrograms(result.elegible, result.aggregate, result.Uni);
          })
          .catch(error => {
            console.error("Error fetching results:", error);
            if (resultHero) {
              const isDark = document.body.classList.contains("dark-mode");
              const exclamationMark = isDark ? "icons/exclamation-mark-D.png" : "icons/exclamation-mark-L.png";
              
              resultHero.innerHTML = `
                <div class="no-saved-results">
                  <div class="no-results-icon">
                    <img src="${exclamationMark}" alt="Error" />
                  </div>
                  <h2>Oops! Something went wrong</h2>
                  <p>We couldn't fetch your results. Please try again.</p>
                  <a href="#" class="heroButton getStarted-btn" onclick="location.reload()">Try Again</a>
                </div>
              `;
            }
          });
      },
          
        onClose: function () {
          document.querySelector(".modal-content").style.display = "none";
          document.querySelector('.cancelPayment').style.display = "flex";
          let why = document.querySelector('.cancelPayment');

          let exclamationMark;
          const isDark = document.body.classList.contains("dark-mode");
          isDark ? exclamationMark= "icons/exclamation-mark-D.png" :exclamationMark= "icons/exclamation-mark-L.png";

          why.innerHTML = `
            <div class="no-saved-results">
              <div class="no-results-icon">
                <img src="${exclamationMark}" alt="No results" />
              </div>
              <h2>Oops!! Payment canceled</h2>
              <p>Pay to unlock full University match report.</p>
              <a href="#" class="heroButton getStarted-btn" onclick="cancelW()">cancel</a>
            </div>
          `;
        },
      });
      handler.openIframe();
    };
  }

  document.querySelector(".gradeButton1").addEventListener("click", () => {
    Getvalues();
  });

  document.getElementById("closeM").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
  });

  window.cancelW = cancelW;

  function cancelW(){
    document.querySelector('.modal-overlay').style.display="none";
    document.querySelector(".modal-content").style.display = "block";
  }

  restoreResultPageIfNeeded();
}

unis();