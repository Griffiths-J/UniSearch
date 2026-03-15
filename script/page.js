export function pages(){
  const landingSection = document.querySelector('.landingPage');
  const gradeSection = document.querySelector('.gradePage');
  const resultSection = document.querySelector('.resultPage');

  function hideAll(){
    if(landingSection) landingSection.style.display = 'none';
    if(gradeSection) gradeSection.style.display = 'none';
    if(resultSection) resultSection.style.display = 'none';
  }

  function showLandingPage(){
    hideAll();
    if(landingSection) landingSection.style.display = 'block';
    localStorage.setItem('uniSearchPageState', 'landing');
  }

  function showGradePage(){
    hideAll();
    if(gradeSection) gradeSection.style.display = 'block';
    localStorage.setItem('uniSearchPageState', 'grade');
  }

  function showResultPage(){
    hideAll();
    if(resultSection) resultSection.style.display = 'block';
    localStorage.setItem('uniSearchPageState', 'result');
  }

  const getStartedBtn = document.querySelector('.getStarted-btn');
  if(getStartedBtn) getStartedBtn.addEventListener('click', ()=> showGradePage());

  const backToLandingBtn = document.querySelector('.backTolanding');
  if(backToLandingBtn) backToLandingBtn.addEventListener('click', ()=> showLandingPage());

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener('load', ()=>{
    const state = localStorage.getItem('uniSearchPageState') || 'landing';
    if(state === 'grade') showGradePage();
    else if(state === 'result'){
      showResultPage();
    } else showLandingPage();
  });
}
