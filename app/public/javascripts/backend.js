var navEl = document.querySelector('nav.navbar'),
    navBtnEl = navEl.querySelector('button'),
    navbarEl = navEl.querySelector('.navbar-collapse');

navBtnEl.addEventListener('click', function(){
  navbarEl.classList.toggle('collapsed');
});