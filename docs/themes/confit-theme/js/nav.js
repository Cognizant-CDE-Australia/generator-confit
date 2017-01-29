const showNavClass = 'show-nav';
let toggle;
let body;

export default (() => {
  body = document.getElementsByTagName('body')[0];
  toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', toggleNav);
  }
})();

function toggleNav() {
  if (body.classList.contains(showNavClass)) {
    body.classList.remove(showNavClass);
  } else {
    body.classList.add(showNavClass);
  }
}
