export function pages(){
  const landingSection = document.querySelector('.landingPage');
  const gradeSection = document.querySelector('.gradePage');
  const resultSection = document.querySelector('.resultPage');

  const footerSection = document.querySelector('footer');

  function hideAll(){
    if(landingSection) landingSection.style.display = 'none';
    if(gradeSection) gradeSection.style.display = 'none';
    if(resultSection) resultSection.style.display = 'none';
    if(footerSection) footerSection.style.display = 'none';
  }

  function showLandingPage(){
    hideAll();
    if(landingSection) landingSection.style.display = 'block';
    if(footerSection) footerSection.style.display = 'block';
    sessionStorage.setItem('uniSearchPageState', 'landing');
  }

  function showGradePage(){
    hideAll();
    if(gradeSection) gradeSection.style.display = 'block';
    sessionStorage.setItem('uniSearchPageState', 'grade');
  }

  function showResultPage(){
    hideAll();
    if(resultSection) resultSection.style.display = 'block';
    sessionStorage.setItem('uniSearchPageState', 'result');
  }

  const getStartedBtns = document.querySelectorAll('.getStarted-btn');
  getStartedBtns.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    showGradePage();
  }));

  const backToLandingBtn = document.querySelector('.backTolanding');
  if(backToLandingBtn) backToLandingBtn.addEventListener('click', ()=> showLandingPage());

  const returnHomeBtn = document.getElementById('return-home-btn');
  if(returnHomeBtn){
    returnHomeBtn.addEventListener('click', ()=> {
      showLandingPage();
      sessionStorage.setItem('uniSearchPageState', 'landing');
      sessionStorage.removeItem('uniSearchResult');
    });
  }

  window.showGradePage = showGradePage;
  window.showLandingPage = showLandingPage;
  window.showResultPage = showResultPage;

  window.addEventListener('load', ()=>{
    const savedResult = sessionStorage.getItem('uniSearchResult');
    const state = sessionStorage.getItem('uniSearchPageState') || 'landing';

    if(state === 'grade'){
      showGradePage();
      return;
    }

    if(state === 'result' && savedResult){
      showResultPage();
      if(typeof window.restoreResultFromStorage === 'function'){
        window.restoreResultFromStorage();
      }
      return;
    }

    showLandingPage();
  });
}
