export function takevalue(){

function values(){

  //core Suvjects
  const allCRows= document.querySelectorAll('.core-instance'); 
const coreSubresult=[];

allCRows.forEach((row)=>{
  let name = row.querySelector('.coresub-js').value;
  let grade = row.querySelector('.coregrade-js').value;
  
 coreSubresult.push({
  name,
  grade
 });

})

console.log(coreSubresult);


//ellectives
const electiveSubresult=[];
const allERows=document.querySelectorAll('.elective-instance');

allERows.forEach((row)=>{
  let name = row.querySelector('.electivesub-js').value;
  let grade = row.querySelector('.electivegrade-js').value;

electiveSubresult.push({
  name,
  grade
})
})

console.log(electiveSubresult)


}
  






document.querySelector('.gradeButton1').addEventListener('click',()=>{
  values();
})




}