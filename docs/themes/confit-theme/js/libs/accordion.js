(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.accordion = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	var accordion = {}; // Object for public APIs

  accordion.init = () => {

    const acc = document.getElementsByClassName('sd-accordion');
    let i;

    for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function(){
        this.classList.toggle('sd-accordion-active');
        this.nextElementSibling.classList.toggle('sd-show');
      }
    }

  };

  return accordion;

});
