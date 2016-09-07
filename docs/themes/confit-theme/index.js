if (__DEV__) {
  module.hot.accept();
}

// Nav
import './js/nav';
import gumshoe from './js/libs/gumshoe';
import smoothScroll from './js/libs/smooth-scroll';
import accordion from './js/libs/accordion';

// Syntax highlighting
import 'prismjs';

// Line numbers
import 'prismjs/plugins/line-numbers/prism-line-numbers';

// Base theme
import './css/index.styl';


(() => {
  accordion.init();

  gumshoe.init({
    offset: 40, // Distance in pixels to offset calculations
    activeClass: 'sw-active'
  });

  smoothScroll.init({
    selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
    selectorHeader: '[data-gumshoe-header]', // Selector for fixed headers (must be a valid CSS selector)
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    offset: 40, // Integer. How far to offset the scrolling anchor location in pixels
    updateURL: true, // Boolean. If true, update the URL hash on scroll
  });
})();
