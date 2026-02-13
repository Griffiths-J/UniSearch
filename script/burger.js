
export function burger(){

const burger = document.querySelector('.burger');
const uls = document.querySelector('.uls');



burger.addEventListener('click',(e)=>{
  e.stopPropagation();
  uls.classList.toggle('show');

  burger.classList.toggle('animate');
  

});

document.addEventListener('click',()=>{
  const isOpen = uls.classList.contains('show');

  if(isOpen){
    uls.classList.remove('show');
    burger.classList.remove('animate')
  }
})



}