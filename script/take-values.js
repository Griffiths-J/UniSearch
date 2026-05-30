async function unis() {
  function isDarkModeActive() {
    return document.documentElement.classList.contains("dark-mode");
  }

  function safeOneSignalTag(action, key, value) {
    try {
      const oneSignalUser = window.OneSignal?.User;
      if (!oneSignalUser) return;

      if (action === "add" && typeof oneSignalUser.addTag === "function") {
        oneSignalUser.addTag(key, value);
      }
      if (action === "remove" && typeof oneSignalUser.removeTag === "function") {
        oneSignalUser.removeTag(key, value);
      }
    } catch (error) {
      console.warn("OneSignal tag update skipped:", error);
    }
  }

  function getUniversityCode(title) {
    switch (title) {
      case "Kwame Nkrumah University of Science Technology":
        return "KNUST";
      case "University of Ghana":
        return "UG";
      case "University of Cape Coast":
        return "UCC";
      case "University of Mines and Technology":
        return "UMAT";
      case "University of Professional Studies Accra":
        return "UPSA";
      default:
        return "Select University";
    }
  }

  function getUniversityTitle(code) {
    switch (code) {
      case "KNUST":
        return "Kwame Nkrumah University of Science Technology";
      case "UG":
        return "University of Ghana";
      case "UCC":
        return "University of Cape Coast";
      case "UMAT":
        return "University of Mines and Technology";
      case "UPSA":
        return "University of Professional Studies Accra";
      default:
        return "Unknown University";
    }
  }

  function saveResultData(elegible, aggregate, Uni,weakGrades) {
    const resultData = JSON.stringify({ elegible, aggregate, Uni,weakGrades });
    localStorage.setItem("uniSearchResult", resultData);
    sessionStorage.setItem("uniSearchPageState", "result");
  }

  function showResultLoading() {
    const resultHero = document.querySelector(".resultPagehero");
    if (!resultHero) return;
    resultHero.innerHTML = `
      <div class="loader-container">
        <div class="loader-spinner"></div>
        <p class="loader-text">Fetching your eligible programs...</p>
      </div>
    `;
  }

  function toggleResultUniversitySwitcher(show, selectedCode) {
    const switcherContainer = document.querySelector(
      ".result-university-switcher",
    );
    const switcher = document.getElementById("result-uni-switcher");
    if (!switcherContainer || !switcher) return;

    if (show) {
      switcherContainer.style.display = "block";
      switcher.value = selectedCode || "Select University";
    } else {
      switcherContainer.style.display = "none";
    }
  }

  async function fetchResultsForUniversity(universityCode) {
    const studentDataRaw = sessionStorage.getItem("uniSearchStudentData");
    if (!studentDataRaw) {
      throw new Error(
        "Student data is not available.",
      );
    }

    const studentData = JSON.parse(studentDataRaw);
    studentData.Uni = getUniversityTitle(universityCode);
    sessionStorage.setItem("uniSearchStudentData", JSON.stringify(studentData));

    showResultLoading();

    const res = await fetch("/.netlify/functions/get-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ university: universityCode, studentData }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Fetch failed: ${res.status} ${errorBody}`);
    }

    return res.json();
  }

  async function renderEligiblePrograms(elegible, aggregate, Uni) {
    const resultHero = document.querySelector(".resultPagehero");
    if (!resultHero) {
      console.error("resultPagehero element not found");
      return;
    }

    const studentDataRaw = sessionStorage.getItem("uniSearchStudentData");

    const studentData = studentDataRaw ? 
                  JSON.parse(studentDataRaw):{};

      const weakGrades = studentData.weakGrades||[];
      

 let gradeHtml = ''
            weakGrades.map((e)=>{
                gradeHtml+=`
                   ${e.grade},
                `
            })

            let subjectHtml = '';
            weakGrades.map((e)=>{
                subjectHtml+=`
                    ${e.subject},
                `
            }) 


 const weakMarkRemark = weakGrades.length>1 ? 
                `
            <div class="weakmarktake" style="font-style:italic">
               Getting ${gradeHtml} in ${subjectHtml} respectively may reduce your chances of admission.
               Even though you may see eligible programs, universities often prioritize stronger grades.
               <a href="https://wa.me/+233509304981?text=Hi Unilift,, I need help with selecting courses for my grades.">Talk to an assistant</a>
            </div>    
            ` : '';




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
            <a href="https://wa.me/+233509304981?text=Hi Unilift, I need help with selecting courses for my grade in ${Uni}. Didn't meet requirement" class="assistant-link">
              <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp_logo">
              TALK TO AN ASSISTANT
            </a>
          </div>
     </div>
    `
        : "";




        const buy = `
              
      <div class="result-cta">
        <p>Ready to apply? Get your admission forms here.</p>
        <a href="checker&forms.html">Get yours now →</a>
      </div>
        `

    resultHero.innerHTML = `
      <div class="result-summary">
          <h2>Eligible Courses at <br><span class="result-summaryUni">${Uni}</span> </h2>
          <div class="result-summaryBox">
            <div class="resultAgg-t">Your Aggregrate</div> <span>|</span>
            <div class="resultAgg">${aggregate}</div>
          </div>
      </div>
      ${noProgramsHtml}
      <div class="numberCourses">${elegible.length} COURSE${elegible.length > 1 ? "S" : ""} FOUND <br>
         ${weakMarkRemark}      
      </div>
      <div class="eligible-programs">${listItems} </div>
      ${buy}
     
       
    `;

    saveResultData(elegible, aggregate, Uni,weakGrades);
    const switcherCode = getUniversityCode(Uni);
    const hasPaid = Boolean(sessionStorage.getItem("uniSearchStudentData"));
    toggleResultUniversitySwitcher(hasPaid, switcherCode);
  }

  window.restoreResultFromStorage = function () {
    const stored = localStorage.getItem("uniSearchResult");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.elegible)) {
        renderEligiblePrograms(
          parsed.elegible,
          parsed.aggregate,
          parsed.Uni || "N/A",
          parsed.weakGrades
        );
      }
    } catch (e) {
      console.error("Failed to restore result", e);
    }
  };

  function initResultUniversitySwitcher() {
    const switcher = document.getElementById("result-uni-switcher");
    if (!switcher) return;
    if (switcher.dataset.initialized === "true") return;
    switcher.dataset.initialized = "true";

    switcher.addEventListener("change", async (event) => {
      const selectedUniversity = event.target.value;
      if (!selectedUniversity || selectedUniversity === "Select University") {
        return;
      }

      try {
        const result = await fetchResultsForUniversity(selectedUniversity);
        if (result && result.elegible) {
          await renderEligiblePrograms(
            result.elegible,
            result.aggregate,
            result.Uni,
          );
        }
      } catch (error) {
        console.error("Error switching university:", error);
        const resultHero = document.querySelector(".resultPagehero");

        const isDark = document.body.classList.contains("dark-mode");
        const exclamationMark = isDark
          ? "icons/exclamation-mark-D.png"
          : "icons/exclamation-mark-L.png";

        if (resultHero) {
          resultHero.innerHTML = `
            <div class="no-saved-results">
              <div class="no-results-icon">
                <img src="${exclamationMark}" alt="Error" />
              </div>
              <h2>Unable to switch university</h2>
              <p>Please refresh the page or try again.</p>
            </div>
          `;
        }
      }
    });
  }

  const returnHomeBtn = document.getElementById("return-home-btn");
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", () => {
      if (window.showLandingPage) window.showLandingPage();
      sessionStorage.setItem("uniSearchPageState", "landing");
      localStorage.removeItem("uniSearchResult");
    });
  }

  function restoreResultPageIfNeeded() {
    const pageState = sessionStorage.getItem("uniSearchPageState");
    if (pageState !== "result") return;

    const stored = localStorage.getItem("uniSearchResult");
    if (!stored) return;


    if (window.showResultPage) window.showResultPage();
    window.restoreResultFromStorage();
    initResultUniversitySwitcher();
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

    //core Suvjects
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





     let weakMarkArray = [];

    const weakMark = userResult.forEach(e=>{
      let grade = e.finalGrade;
      let subject = e.finalSub;

      if(grade > 6){

       switch(grade){
        case 7:
          grade = 'D7'
          break;
        case 8:
          grade =  'E8'
          break;
        case 9:
          grade = 'F9'
          break;
        default :
          grade = 'weak mark'    
       }

        weakMarkArray.push({
        grade,subject
        });
      }
    })
/* 
    console.log(weakMarkArray */


   
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
      weakGrades:weakMarkArray
    };




    document.querySelector(".modal-overlay").style.display = "flex";
    document.getElementById("payment-modal").style.display = "flex";
    document.querySelector(".cancelPayment").style.display = "none";
    document.getElementById("display-agg").innerText = `${finalAggregrate}`;

    document.getElementById("pay-button").onclick = function (e) {
      
       notifyProceed();
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
        key: "pk_test_4bf95eea05cc22ee8197c0fc61514b7e6fc93a3b",
        email: email,
        amount: 1170,
        currency: "GHS",
        ref: "" + Math.floor(Math.random() * 99999 + 1),
        callback: function (responds) {
          document.getElementById("payment-modal").style.display = "none";

          notifyPaymentSuccess(email);
          safeOneSignalTag("remove", "abandoned_payment", "true");

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

          sessionStorage.setItem(
            "uniSearchStudentData",
            JSON.stringify(studentData),
          );

          fetch("/.netlify/functions/get-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ university, studentData }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch results");
              return res.json();
            })
            .then((result) => {
              renderEligiblePrograms(
                result.elegible,
                result.aggregate,
                result.Uni,
                studentData.weakGrades
              );
              initResultUniversitySwitcher();
            })
            .catch((error) => {
              /* console.error("Error fetching results:", error);*/
               if (resultHero) {
                const isDark = isDarkModeActive();
                const exclamationMark = isDark
                  ? "icons/exclamation-mark-D.png"
                  : "icons/exclamation-mark-L.png";

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
          document.querySelector(".cancelPayment").style.display = "flex";
          let why = document.querySelector(".cancelPayment");

          sendCancelAlert(email);

          safeOneSignalTag("add", "abandoned_payment", "true");

          let exclamationMark;
          const isDark = isDarkModeActive();
          isDark
            ? (exclamationMark = "icons/exclamation-mark-D.png")
            : (exclamationMark = "icons/exclamation-mark-L.png");

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

  function cancelW() {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector(".modal-content").style.display = "block";
  }

  restoreResultPageIfNeeded();






//  (Proceeding to Payment)
async function notifyProceed() {
  const name = "A student";
  await fetch('/.netlify/functions/alert-proceed', {
    method: 'POST',
    body: JSON.stringify({ name: name })
  });
}

// (After Payment is finished)
async function notifyPaymentSuccess(email) {
  const name = email || "A student";
  await fetch('/.netlify/functions/alert-paid', {
    method: 'POST',
    body: JSON.stringify({ name: name })
  });
}

// (Canceling Payment)
async function sendCancelAlert(email) {
  const studentName = email || "A student";

  try {
    await fetch('/.netlify/functions/alert-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: studentName })
    });
    /* console.log("Cancel alert sent to Admin"); */
  } catch (error) {
    console.error("Error sending cancel alert:", error);
  }
}




}

unis();
