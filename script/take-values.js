async function unis(){
  const responds = await fetch("./data/courses.json");
  const data = await responds.json();

 const KNUST = data[0].KNUST;
 const UG = data[1].UG;
 const UCC = data[2].UCC;
 const UMAT = data[3].UMAT;


function Getvalues(){

        const university = document.querySelector(".getsch-select-value").value;
        if(university==="Select University" || university ===""){
          document.querySelector(".prompt").innerHTML="Select university and all inputs"
          throw new Error("Select university");
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
            document.querySelector('.prompt').innerHTML='Please select all core subject grades';
            setTimeout(()=>{
              document.querySelector('.prompt').innerHTML='';
            },5500);
            throw new Error("Missing core grade"); 
          }

      coreSubresult.push({
        type,
        name,
        grade,
      });

      })

     /*  console.log(coreSubresult); */


      //ellectives
      const electiveSubresult=[];
      const allERows=document.querySelectorAll('.elective-instance');

      allERows.forEach((row)=>{
        let name = row.querySelector('.electivesub-js').value;
        let grade = row.querySelector('.electivegrade-js').value;
        let type = 'elective';

        if(name ==="Select Course" || grade=="Select Grade" || grade===""){
          document.querySelector('.prompt').innerHTML='Please select all elective subjects and grades';
          setTimeout(()=>{
            document.querySelector('.prompt').innerHTML='';
          },5500);
          throw new Error("Missing elective selection"); 
        }


      electiveSubresult.push({
        type,
        name,
        grade
      })
      })

      

       if (coreSubresult.length === 0 && electiveSubresult.length === 0) {
        document.querySelector('.prompt').innerHTML = "No selections made. Please choose your subjects.";
        setTimeout(()=>{
          document.querySelector('.prompt').innerHTML ='';
        },5500)
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
     document.querySelector('.prompt').innerHTML='you selected two same courses';
    setTimeout(()=>{
      document.querySelector('.prompt').innerHTML=''
    },5800)
   
    return;
  }

 

  const englishSelect = cores.find(en=>en.finalSub.includes("English"))
  const englishGrade = englishSelect.finalGrade;

  const mathSelect = cores.find(mth=>mth.finalSub.includes("Mathematics"))
  const mathGrade = mathSelect.finalGrade;

  const scienceSelect = cores.find(sci=>sci.finalSub.includes("Science"))
  const scienceGrade = scienceSelect.finalGrade;

  const socialSelect = cores.find(soc=>soc.finalSub.includes("Social"))
  const socialGrade = socialSelect.finalGrade;

  console.log(scienceGrade,englishGrade,mathGrade,socialGrade)

  const bestThreeElective = elective.map(el=>(el.finalGrade)).sort((a,b)=>a-b).slice(0,3).reduce((sum,grade)=>sum+grade,0)
  const finalAggregrate = mathGrade + scienceGrade + englishGrade + bestThreeElective

  console.log("this is the final " + finalAggregrate);
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
  console.log(lete);

  const finalBestThree = lete.slice(0,3);
  console.log(finalBestThree);

 
  const studentData = {
    coreMath:mathGrade,
    coreScience:scienceGrade,
    coreEnglish:englishGrade,
    [finalBestThree[0].finalSub]:finalBestThree[0].finalGrade,
    [finalBestThree[1].finalSub]:finalBestThree[1].finalGrade,
    [finalBestThree[2].finalSub]:finalBestThree[2].finalGrade,
    aggregrate:finalAggregrate
  };

  console.log(studentData);

  let check =KNUST.filter(course=>finalAggregrate <= course.cutoff_criteria.minimum_aggregate && course.college==="College of Science");
 

  return finalAggregrate
}



  document.querySelector('.gradeButton1').addEventListener('click',()=>{
  Getvalues();
  });


}

unis();