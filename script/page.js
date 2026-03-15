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

  const returnHomeBtn = document.getElementById('return-home-btn');
  if(returnHomeBtn){
    returnHomeBtn.addEventListener('click', ()=> {
      showLandingPage();
      localStorage.setItem('uniSearchPageState', 'landing');
      localStorage.removeItem('uniSearchResult');
    });
  }

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener('load', ()=>{
    const savedResult = localStorage.getItem('uniSearchResult');
    const state = localStorage.getItem('uniSearchPageState') || 'landing';

    if(savedResult){
      showResultPage();
      if(typeof window.restoreResultFromStorage === 'function'){
        window.restoreResultFromStorage();
      }
      return;
    }

    if(state === 'grade') showGradePage();
    else if(state === 'result'){
      showResultPage();
      if(typeof window.restoreResultFromStorage === 'function'){
        window.restoreResultFromStorage();
      }
    } else showLandingPage();
  });
}
