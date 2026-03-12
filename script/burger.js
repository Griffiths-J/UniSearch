
const burger = document.querySelector('.burger');
const uls = document.querySelector('.uls');
const links = document.querySelectorAll(".uls li");


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

