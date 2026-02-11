
export function burger(){
const burger = document.querySelector('.burger');
const uls = document.querySelector('.uls');



burger.addEventListener('click',()=>{
  uls.classList.toggle('show');

  burger.classList.toggle('animate');

  

  
})
}