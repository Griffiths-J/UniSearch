async function unis(){
  const responds = await fetch("./data/courses.json");
  const data = await responds.json();

 const KNUST = data[0].KNUST;
 const UG = data[1].UG;
 const UCC = data[2].UCC;
 const UMAT = data[3].UMAT;


function values(){  
         const userResult=[];
        
         //core Suvjects
        const allCRows= document.querySelectorAll('.core-instance'); 
        const coreSubresult=[];

      allCRows.forEach((row)=>{
        let name = row.querySelector('.coresub-js').innerHTML;
        let grade = row.querySelector('.coregrade-js').value;
        let type = 'core';
        
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

      electiveSubresult.push({
        type,
        name,
        grade
      })
      })

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

      

      return userResult
};
  


function processStudentGrades(){

  

  const allResult = values()

  const cores = allResult.filter(e=>e.finalType==='core')
  const elective = allResult.filter(e=>e.finalType==='elective')
 
  const electiveNames = elective.map(e=>e.finalSub)
  const uniqueElectiveName =new Set(electiveNames);


  if(uniqueElectiveName.size !== electiveNames.length){
     document.querySelector('.prompt').innerHTML='cross check your selections';
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

  let allResult_main = allResult.push({finalAggregrate});
  console.log(allResult_main);

  let check =KNUST.filter(course=>course.cutoff_criteria.minimum_aggregate===10);
console.log(KNUST);
  console.log(check)

  return finalAggregrate
}



document.querySelector('.gradeButton1').addEventListener('click',()=>{

 processStudentGrades();

});
}

unis();