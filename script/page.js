export function pages(){


  const landingSection = document.querySelector('.landingPage');
  const gradeSection = document.querySelector('.gradePage');

    
  function showGradePage(){
       window.location.hash='grade';
      landingSection.style.display='none';
      gradeSection.style.display='block';
    }                                                                                             

  function showLandingPage(){
     landingSection.style.display='block';
     gradeSection.style.display='none'
  }



  document.querySelector('.getStarted-btn').addEventListener('click',()=>{
    window.location.hash='grade';
    showGradePage();
  });



  document.querySelector('.backTolanding').addEventListener('click',()=>{
    history.pushState(document.title,window.location.pathname+window.location.search);
    
    showLandingPage();
  })



  window.addEventListener('load',()=>{
      if(window.location.hash==='#grade'|| window.location.hash==='#grade1'){
        showGradePage();
      }else{
        showLandingPage();
      }
  });
 
}