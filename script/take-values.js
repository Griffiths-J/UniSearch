async function unis(){
  const responds = await fetch("./data/courses.json");
  const data = await responds.json();

 const KNUST = data[0].KNUST;
 const UG = data[1].UG;
 const UCC = data[2].UCC;
 const UMAT = data[3].UMAT;

 function renderEligiblePrograms(elegible, aggregate){
    const resultHero = document.querySelector('.resultPagehero');
    if(!resultHero){
      console.error('resultPagehero element not found');
      return;
    }

    const listItems = elegible.map(p => `
      <div class="result-card">
        <h3>${p.program_name}</h3>
        <p><strong>College:</strong> ${p.college || 'N/A'}</p>
        <p><strong>Faculty:</strong> ${p.faculty || 'N/A'}</p>
        <p><strong>Min aggregate:</strong> ${p.cutoff_criteria?.minimum_aggregate ?? 'N/A'}</p>
        <p><strong>Required electives:</strong> ${(p.cutoff_criteria?.elective_required?.any_of || []).join(', ') || 'N/A'}</p>
      </div>
    `).join('');

    const noProgramsHtml = elegible.length === 0 ? `
      <div class="result-card no-match">
        <h2>Payment complete ✅</h2>
        <p>No eligible programs matched your aggregate and electives.</p>
      </div>
    ` : '';

    resultHero.innerHTML = `
      <div class="result-summary">
        <div>
          <h2>Eligible programs</h2>
          <p>Your aggregate: <strong>${aggregate}</strong> · Eligible program(${elegible.lenght>1?'s':''}) ${elegible.length} </p>
        </div>
      </div>
      ${noProgramsHtml}
      <div class="eligible-programs">${listItems}</div>
    `;

    localStorage.setItem('uniSearchResult', JSON.stringify({elegible, aggregate}));
    localStorage.setItem('uniSearchPageState', 'result');
  }

  window.restoreResultFromStorage = function(){
    const stored = localStorage.getItem('uniSearchResult');
    if(!stored) return;
    try{
      const parsed = JSON.parse(stored);
      if(parsed && Array.isArray(parsed.elegible)){
        renderEligiblePrograms(parsed.elegible, parsed.aggregate || 'N/A');
      }
    } catch(e){
      console.error('Failed to restore result', e);
    }
  };

  const returnHomeBtn = document.getElementById('return-home-btn');
  if(returnHomeBtn){
    returnHomeBtn.addEventListener('click', ()=>{
      if(window.showLandingPage) window.showLandingPage();
      localStorage.setItem('uniSearchPageState', 'landing');
      localStorage.removeItem('uniSearchResult');
    });
  }

  function restoreResultPageIfNeeded(){
    const stored = localStorage.getItem('uniSearchResult');
    if(!stored) return;
    if(window.showResultPage) window.showResultPage();
    window.restoreResultFromStorage();
  }

  if(document.readyState === 'complete'){
    restoreResultPageIfNeeded();
  } else {
    window.addEventListener('load', restoreResultPageIfNeeded);
  }

function Getvalues(){

        const university = document.querySelector(".getsch-select-value").value;
        if(university==="Select University" || university ===""){
          document.querySelector(".prompt").innerHTML="Select university and all inputs";
          setTimeout(()=>{
            document.querySelector(".prompt").innerHTML='';
          },5000)
          throw new Error("Select university");
        };

        let requiredUni;

        switch(university){
          case "KNUST":
            requiredUni=KNUST;
            break;
          case "UG":
            requiredUni=UG;
            break;
          case "UCC":
            requiredUni=UCC;
            break;
          case "UMAT":
            requiredUni=UMAT;
            break;
          default:
          throw new Error("error");       
        }

         const userResult=[];
        
         //core Suvjects
        const allCRows= document.querySelectorAll('.core-instance'); 
        const coreSubresult=[];

       

      allCRows.forEach((row)=>{
        let name = row.querySelector('.coresub-js').innerHTML;
        let grade = row.querySelector('.coregrade-js').value;
        let type = 'core';
        
         if(grade ==="Select Grade"|| grade===""){
            document.querySelector('.prompt').innerHTML='Select all core subject grades';
            setTimeout(()=>{
              document.querySelector('.prompt').innerHTML='';
            },5000);
            throw new Error("Missing core grade"); 
          }

      coreSubresult.push({
        type,
        name,
        grade,
      });

      })

    


      //ellectives
      const electiveSubresult=[];
      const allERows=document.querySelectorAll('.elective-instance');

      allERows.forEach((row)=>{
        let name = row.querySelector('.electivesub-js').value;
        let grade = row.querySelector('.electivegrade-js').value;

        let type = 'elective';

        if(name ==="Select Course" || grade=="Select Grade" || grade===""){
          document.querySelector('.prompt').innerHTML='Select all elective subjects and grades';
          setTimeout(()=>{
            document.querySelector('.prompt').innerHTML='';
          },5000);
          throw new Error("Missing elective selection"); 
        }

        let grade_main = knustCheck(grade);
      electiveSubresult.push({
        type,
        name,
        grade:grade_main
      })
      })

      

       if (coreSubresult.length === 0 && electiveSubresult.length === 0) {
        document.querySelector('.prompt').innerHTML = "No selections made. Please choose your subjects.";
        setTimeout(()=>{
          document.querySelector('.prompt').innerHTML ='';
        },5000)
        return;
      }


      /* console.log(electiveSubresult) */
      //add core to main array
      coreSubresult.forEach((course)=>{
          let finalSub = course.name;
          let finalGrade = parseInt(course.grade);
          let finalType = course.type;

          userResult.push({
            finalType,
            finalSub,
            finalGrade
          })
      })
      //add elective to main array
      electiveSubresult.forEach((course)=>{
        let finalSub = course.name;
        let finalGrade = parseInt(course.grade);
        let finalType = course.type;

        userResult.push({
          finalType,
          finalSub,
          finalGrade
        })
      })


  const allResult = userResult;

  const cores = allResult.filter(e=>e.finalType==='core')
  const elective = allResult.filter(e=>e.finalType==='elective')
 
  const electiveNames = elective.map(e=>e.finalSub)
  const uniqueElectiveName =new Set(electiveNames);


  if(uniqueElectiveName.size !== electiveNames.length){
     document.querySelector('.prompt').innerHTML='You selected two same courses';
    setTimeout(()=>{
      document.querySelector('.prompt').innerHTML=''
    },5000)
   
    return;
  }

 function knustCheck(grade){
  if(requiredUni==KNUST){
      if(grade >= 4 && grade <= 6){
    grade = 4
      }else{
        grade = grade;
      }
    }
    return grade;
  }

  const englishSelect = cores.find(en=>en.finalSub.includes("English"))
  const englishGrade = englishSelect.finalGrade;
  const englishGrade_main = knustCheck(englishGrade);

  const mathSelect = cores.find(mth=>mth.finalSub.includes("Mathematics"))
  const mathGrade = mathSelect.finalGrade;
  const mathGrade_main = knustCheck(mathGrade);

  const scienceSelect = cores.find(sci=>sci.finalSub.includes("Science"))
  const scienceGrade = scienceSelect.finalGrade;
   const scienceGrade_main=  knustCheck(scienceGrade);
  
  

  const socialSelect = cores.find(soc=>soc.finalSub.includes("Social"))
  const socialGrade = socialSelect.finalGrade;


  

  const bestThreeElective = elective.map(el=>(el.finalGrade)).sort((a,b)=>a-b).slice(0,3).reduce((sum,grade)=>sum+grade,0)
  const finalAggregrate = mathGrade_main + scienceGrade_main + englishGrade_main + bestThreeElective


  document.querySelector('.prompt').innerHTML=finalAggregrate

  const electiveOne = elective[0];
  const electivetwo = elective[1];
  const electivethree = elective[2];
  const electivefour = elective[3];

  const lete = [
   electiveOne,
  electivetwo,
  electivethree,
   electivefour
  ]
let i;
let j;
  for(i=0;i<lete.length-1;i++){
    for(j=0;j<lete.length-1;j++){
        if(lete[j].finalGrade>lete[j + 1].finalGrade){
            let temp = lete[j];
            lete[j] = lete[j + 1];
            lete[j+1] = temp;
        }
    }
  } 

  const finalBestThree = lete.slice(0,3);

 
  const studentData = {
    core_math:mathGrade_main,
    int_science:scienceGrade_main,
    english:englishGrade_main,
    [finalBestThree[0].finalSub]:finalBestThree[0].finalGrade,
    [finalBestThree[1].finalSub]:finalBestThree[1].finalGrade,
    [finalBestThree[2].finalSub]:finalBestThree[2].finalGrade,
    aggregrate:finalAggregrate
  };



   document.getElementById('payment-modal').style.display='flex';
    document.getElementById('display-agg').innerText=`${finalAggregrate}`;   

  document.getElementById('pay-button').onclick=function(e){
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    
    if(!name|| !email.includes('@')){
      document.querySelector(".checkinputerror").innerHTML='Enter valid name and email';
      setTimeout(()=>{
        document.querySelector(".checkinputerror").innerHTML='';
      },5000)
      return;
    }

    document.querySelector('.resultPage').style.display = 'none';
    const handler = PaystackPop.setup({
      key:'pk_test_217133aa809e4d9c253ad67a39601a632ad77e4f',
      email:email,
      amount:1500,
      currency:'GHS',
      ref: '' + Math.floor((Math.random()*99999)+1),
      callback:function(responds){
       
        document.getElementById('payment-modal').style.display='none';
        if(window.showResultPage){
          window.showResultPage();
        } else {
          const resultPageEl = document.querySelector('.resultPage');
          if(resultPageEl) resultPageEl.style.display = 'block';
        }
        
        const elegible = (requiredUni || []).filter(program => {
          const cutoff = program.cutoff_criteria || {};
          const passAggregrate = studentData.aggregrate <= cutoff.minimum_aggregate;

          const studentElectives = (cutoff.elective_required?.any_of || []).filter(subject => {
            return studentData[subject] !== undefined;
          });

          const passElective = studentElectives.length >= (cutoff.elective_required?.count || 0);
          return passAggregrate && passElective;
        });

        renderEligiblePrograms(elegible, studentData.aggregrate);

       console.log(elegible)
       console.log("helllllllloooo")

      },
      onClose:function(){
        alert("why");
      }

    });
    handler.openIframe(); 
  }

}



  document.querySelector('.gradeButton1').addEventListener('click',()=>{
  Getvalues();
  });

  document.getElementById('closeM').addEventListener('click',()=>{
      document.getElementById('payment-modal').style.display='none';
  })

}

unis();

