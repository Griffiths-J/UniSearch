export function pages(){
  const landingPage = document.querySelector('.landingPage');
  const gradingPage = document.querySelector('.gradePage');

document.querySelector('.switchTograde').addEventListener('click',()=>{

  landingPage.style.display='none';
  gradingPage.style.display='block';
})


document.querySelector('.switchBackTolanding').addEventListener('click',()=>{
  landingPage.style.display='block';
  gradingPage.style.display='none';
})



}