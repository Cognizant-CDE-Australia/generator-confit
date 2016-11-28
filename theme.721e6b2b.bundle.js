/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/generator-confit/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

__webpack_require__(8);

var _gumshoe = __webpack_require__(6);

var _gumshoe2 = _interopRequireDefault(_gumshoe);

var _smoothScroll = __webpack_require__(7);

var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

var _accordion = __webpack_require__(5);

var _accordion2 = _interopRequireDefault(_accordion);

__webpack_require__(13);

__webpack_require__(12);

__webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (false) {
  module.hot.accept();
}

// Nav


// Syntax highlighting


// Line numbers


// Base theme


(function () {
  _accordion2.default.init();

  _gumshoe2.default.init({
    offset: 40, // Distance in pixels to offset calculations
    activeClass: 'sw-active'
  });

  _smoothScroll2.default.init({
    selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
    selectorHeader: '[data-gumshoe-header]', // Selector for fixed headers (must be a valid CSS selector)
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    offset: 40, // Integer. How far to offset the scrolling anchor location in pixels
    updateURL: true });
})();

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory(root)), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory(root);
  } else {
    root.accordion = factory(root);
  }
})(typeof global !== 'undefined' ? global : undefined.window || undefined.global, function (root) {

  'use strict';

  var accordion = {}; // Object for public APIs

  accordion.init = function () {

    var acc = document.getElementsByClassName('sd-accordion');
    var i = void 0;

    for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function () {
        this.classList.toggle('sd-accordion-active');
        this.nextElementSibling.classList.toggle('sd-show');
      };
    }
  };

  return accordion;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory(root)), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory(root);
	} else {
		root.gumshoe = factory(root);
	}
})(typeof global !== 'undefined' ? global : undefined.window || undefined.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var gumshoe = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var navs = []; // Array for nav elements
	var settings, eventTimeout, docHeight, header, headerHeight, currentNav;

	// Default settings
	var defaults = {
		selector: '[data-gumshoe] a',
		selectorHeader: '[data-gumshoe-header]',
		offset: 0,
		activeClass: 'active',
		callback: function callback() {}
	};

	//
	// Methods
	//

	/**
  * A simple forEach() implementation for Arrays, Objects and NodeLists.
  * @private
  * @author Todd Motto
  * @link   https://github.com/toddmotto/foreach
  * @param {Array|Object|NodeList} collection Collection of items to iterate
  * @param {Function}              callback   Callback function for each iteration
  * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
  */
	var forEach = function forEach(collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
  * Merge two or more objects. Returns a new object.
  * @private
  * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
  * @param {Object}   objects  The objects to merge together
  * @return {Object}          Merged values of defaults and options
  */
	var extend = function extend() {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If deep merge and property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};

	/**
  * Get the height of an element.
  * @private
  * @param  {Node} elem The element to get the height of
  * @return {Number}    The element's height in pixels
  */
	var getHeight = function getHeight(elem) {
		return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
	};

	/**
  * Get the document element's height
  * @private
  * @return {Number}
  */
	var getDocumentHeight = function getDocumentHeight() {
		return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
	};

	/**
  * Get an element's distance from the top of the Document.
  * @private
  * @param  {Node} elem The element
  * @return {Number}    Distance from the top in pixels
  */
	var getOffsetTop = function getOffsetTop(elem) {
		var location = 0;
		if (elem.offsetParent) {
			do {
				location += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		} else {
			location = elem.offsetTop;
		}
		location = location - headerHeight - settings.offset;
		return location >= 0 ? location : 0;
	};

	/**
  * Determine if an element is in the viewport
  * @param  {Node}    elem The element
  * @return {Boolean}      Returns true if element is in the viewport
  */
	var isInViewport = function isInViewport(elem) {
		var distance = elem.getBoundingClientRect();
		return distance.top >= 0 && distance.left >= 0 && distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) && distance.right <= (window.innerWidth || document.documentElement.clientWidth);
	};

	/**
  * Arrange nagivation elements from furthest from the top to closest
  * @private
  */
	var sortNavs = function sortNavs() {
		navs.sort(function (a, b) {
			if (a.distance > b.distance) {
				return -1;
			}
			if (a.distance < b.distance) {
				return 1;
			}
			return 0;
		});
	};

	/**
  * Calculate the distance of elements from the top of the document
  * @public
  */
	gumshoe.setDistances = function () {

		// Calculate distances
		docHeight = getDocumentHeight(); // The document
		headerHeight = header ? getHeight(header) + getOffsetTop(header) : 0; // The fixed header
		forEach(navs, function (nav) {
			nav.distance = getOffsetTop(nav.target); // Each navigation target
		});

		// When done, organization navigation elements
		sortNavs();
	};

	/**
  * Get all navigation elements and store them in an array
  * @private
  */
	var getNavs = function getNavs() {

		// Get all navigation links
		var navLinks = document.querySelectorAll(settings.selector);

		// For each link, create an object of attributes and push to an array
		forEach(navLinks, function (nav) {
			if (!nav.hash) return;
			var target = document.querySelector(nav.hash);
			if (!target) return;
			navs.push({
				nav: nav,
				target: target,
				parent: nav.parentNode.tagName.toLowerCase() === 'li' ? nav.parentNode : null,
				distance: 0
			});
		});
	};

	/**
  * Remove the activation class from the currently active navigation element
  * @private
  */
	var deactivateCurrentNav = function deactivateCurrentNav() {
		if (currentNav) {
			currentNav.nav.classList.remove(settings.activeClass);
			if (currentNav.parent) {
				currentNav.parent.classList.remove(settings.activeClass);
			}
		}
	};

	/**
  * Add the activation class to the currently active navigation element
  * @private
  * @param  {Node} nav The currently active nav
  */
	var activateNav = function activateNav(nav) {

		// If a current Nav is set, deactivate it
		deactivateCurrentNav();

		// Activate the current target's navigation element
		nav.nav.classList.add(settings.activeClass);
		if (nav.parent) {
			nav.parent.classList.add(settings.activeClass);
		}

		settings.callback(nav); // Callback after methods are run

		// Set new currentNav
		currentNav = {
			nav: nav.nav,
			parent: nav.parent
		};
	};

	/**
  * Determine which navigation element is currently active and run activation method
  * @public
  * @return {Object} The current nav data.
  */
	gumshoe.getCurrentNav = function () {

		// Get current position from top of the document
		var position = root.pageYOffset;

		// If at the bottom of the page and last section is in the viewport, activate the last nav
		if (root.innerHeight + position >= docHeight && isInViewport(navs[0].target)) {
			activateNav(navs[0]);
			return navs[0];
		}

		// Otherwise, loop through each nav until you find the active one
		for (var i = 0, len = navs.length; i < len; i++) {
			var nav = navs[i];
			if (nav.distance <= position) {
				activateNav(nav);
				return nav;
			}
		}

		// If no active nav is found, deactivate the current nav
		deactivateCurrentNav();
		settings.callback();
	};

	/**
  * If nav element has active class on load, set it as currently active navigation
  * @private
  */
	var setInitCurrentNav = function setInitCurrentNav() {
		forEach(navs, function (nav) {
			if (nav.nav.classList.contains(settings.activeClass)) {
				currentNav = {
					nav: nav.nav,
					parent: nav.parent
				};
			}
		});
	};

	/**
  * Destroy the current initialization.
  * @public
  */
	gumshoe.destroy = function () {

		// If plugin isn't already initialized, stop
		if (!settings) return;

		// Remove event listeners
		root.removeEventListener('resize', eventThrottler, false);
		root.removeEventListener('scroll', eventThrottler, false);

		// Reset variables
		navs = [];
		settings = null;
		eventTimeout = null;
		docHeight = null;
		header = null;
		headerHeight = null;
		currentNav = null;
	};

	/**
  * On window scroll and resize, only run events at a rate of 15fps for better performance
  * @private
  * @param  {Function} eventTimeout Timeout function
  * @param  {Object} settings
  */
	var eventThrottler = function eventThrottler(event) {
		if (!eventTimeout) {
			eventTimeout = setTimeout(function () {

				eventTimeout = null; // Reset timeout

				// If scroll event, get currently active nav
				if (event.type === 'scroll') {
					gumshoe.getCurrentNav();
				}

				// If resize event, recalculate distances and then get currently active nav
				if (event.type === 'resize') {
					gumshoe.setDistances();
					gumshoe.getCurrentNav();
				}
			}, 66);
		}
	};

	/**
  * Initialize Plugin
  * @public
  * @param {Object} options User settings
  */
	gumshoe.init = function (options) {

		// feature test
		if (!supports) return;

		// Destroy any existing initializations
		gumshoe.destroy();

		// Set variables
		settings = extend(defaults, options || {}); // Merge user options with defaults
		header = document.querySelector(settings.selectorHeader); // Get fixed header
		getNavs(); // Get navigation elements

		// If no navigation elements exist, stop running gumshoe
		if (navs.length === 0) return;

		// Run init methods
		setInitCurrentNav();
		gumshoe.setDistances();
		gumshoe.getCurrentNav();

		// Listen for events
		root.addEventListener('resize', eventThrottler, false);
		root.addEventListener('scroll', eventThrottler, false);
	};

	//
	// Public APIs
	//

	return gumshoe;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory(root)), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : undefined.window || undefined.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight, animationInterval;

	// Default settings
	var defaults = {
		selector: '[data-scroll]',
		selectorHeader: '[data-scroll-header]',
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callback: function callback() {}
	};

	//
	// Methods
	//

	/**
  * Merge two or more objects. Returns a new object.
  * @private
  * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
  * @param {Object}   objects  The objects to merge together
  * @return {Object}          Merged values of defaults and options
  */
	var extend = function extend() {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If deep merge and property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};

	/**
  * Get the height of an element.
  * @private
  * @param  {Node} elem The element to get the height of
  * @return {Number}    The element's height in pixels
  */
	var getHeight = function getHeight(elem) {
		return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
	};

	/**
  * Get the closest matching element up the DOM tree.
  * @private
  * @param  {Element} elem     Starting element
  * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
  * @return {Boolean|Element}  Returns null if not match found
  */
	var getClosest = function getClosest(elem, selector) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if (firstChar === '[') {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split('=');

			if (attribute.length > 1) {
				value = true;
				attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
			}
		}

		// Get closest match
		for (; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode) {

			// If selector is a class
			if (firstChar === '.') {
				if (supports) {
					if (elem.classList.contains(selector.substr(1))) {
						return elem;
					}
				} else {
					if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className)) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if (firstChar === '#') {
				if (elem.id === selector.substr(1)) {
					return elem;
				}
			}

			// If selector is a data attribute
			if (firstChar === '[') {
				if (elem.hasAttribute(attribute[0])) {
					if (value) {
						if (elem.getAttribute(attribute[0]) === attribute[1]) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				return elem;
			}
		}

		return null;
	};

	/**
  * Escape special characters for use with querySelector
  * @public
  * @param {String} id The anchor ID to escape
  * @author Mathias Bynens
  * @link https://github.com/mathiasbynens/CSS.escape
  */
	smoothScroll.escapeCharacters = function (id) {

		// Remove leading hash
		if (id.charAt(0) === '#') {
			id = id.substr(1);
		}

		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError('Invalid character: the input contains U+0000.');
			}

			if (
			// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
			// U+007F, […]
			codeUnit >= 0x0001 && codeUnit <= 0x001F || codeUnit == 0x007F ||
			// If the character is the first character and is in the range [0-9]
			// (U+0030 to U+0039), […]
			index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
			// If the character is the second character and is in the range [0-9]
			// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
			index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002D) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (codeUnit >= 0x0080 || codeUnit === 0x002D || codeUnit === 0x005F || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005A || codeUnit >= 0x0061 && codeUnit <= 0x007A) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);
		}

		return '#' + result;
	};

	/**
  * Calculate the easing pattern
  * @private
  * @link https://gist.github.com/gre/1650294
  * @param {String} type Easing pattern
  * @param {Number} time Time animation should take to complete
  * @return {Number}
  */
	var easingPattern = function easingPattern(type, time) {
		var pattern;
		if (type === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
		if (type === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
		if (type === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if (type === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
		if (type === 'easeOutCubic') pattern = --time * time * time + 1; // decelerating to zero velocity
		if (type === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if (type === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
		if (type === 'easeOutQuart') pattern = 1 - --time * time * time * time; // decelerating to zero velocity
		if (type === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
		if (type === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
		if (type === 'easeOutQuint') pattern = 1 + --time * time * time * time * time; // decelerating to zero velocity
		if (type === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
  * Calculate how far to scroll
  * @private
  * @param {Element} anchor The anchor element to scroll to
  * @param {Number} headerHeight Height of a fixed header, if any
  * @param {Number} offset Number of pixels by which to offset scroll
  * @return {Number}
  */
	var getEndLocation = function getEndLocation(anchor, headerHeight, offset) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = Math.max(location - headerHeight - offset, 0);
		return Math.min(location, getDocumentHeight() - getViewportHeight());
	};

	/**
  * Determine the viewport's height
  * @private
  * @return {Number}
  */
	var getViewportHeight = function getViewportHeight() {
		return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	};

	/**
  * Determine the document's height
  * @private
  * @return {Number}
  */
	var getDocumentHeight = function getDocumentHeight() {
		return Math.max(root.document.body.scrollHeight, root.document.documentElement.scrollHeight, root.document.body.offsetHeight, root.document.documentElement.offsetHeight, root.document.body.clientHeight, root.document.documentElement.clientHeight);
	};

	/**
  * Convert data-options attribute into an object of key/value pairs
  * @private
  * @param {String} options Link-specific options as a data attribute string
  * @return {Object}
  */
	var getDataOptions = function getDataOptions(options) {
		return !options || !((typeof JSON === 'undefined' ? 'undefined' : _typeof(JSON)) === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse(options);
	};

	/**
  * Update the URL
  * @private
  * @param {Element} anchor The element to scroll to
  * @param {Boolean} url Whether or not to update the URL history
  */
	var updateUrl = function updateUrl(anchor, url) {
		if (root.history.pushState && (url || url === 'true') && root.location.protocol !== 'file:') {
			root.history.pushState(null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join(''));
		}
	};

	var getHeaderHeight = function getHeaderHeight(header) {
		return header === null ? 0 : getHeight(header) + header.offsetTop;
	};

	/**
  * Start/stop the scrolling animation
  * @public
  * @param {Element} anchor The element to scroll to
  * @param {Element} toggle The element that toggled the scroll event
  * @param {Object} options
  */
	smoothScroll.animateScroll = function (anchor, toggle, options) {

		// Options and overrides
		var overrides = getDataOptions(toggle ? toggle.getAttribute('data-options') : null);
		var animateSettings = extend(settings || defaults, options || {}, overrides); // Merge user options with defaults

		// Selectors and variables
		var isNum = Object.prototype.toString.call(anchor) === '[object Number]' ? true : false;
		var anchorElem = isNum ? null : anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor);
		if (!isNum && !anchorElem) return;
		var startLocation = root.pageYOffset; // Current location on the page
		if (!fixedHeader) {
			fixedHeader = root.document.querySelector(animateSettings.selectorHeader);
		} // Get the fixed header if not already set
		if (!headerHeight) {
			headerHeight = getHeaderHeight(fixedHeader);
		} // Get the height of a fixed header if one exists and not already set
		var endLocation = isNum ? anchor : getEndLocation(anchorElem, headerHeight, parseInt(animateSettings.offset, 10)); // Location to scroll to
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		if (!isNum) {
			updateUrl(anchor, animateSettings.updateURL);
		}

		/**
   * Stop the scroll animation when it reaches its target (or the bottom/top of page)
   * @private
   * @param {Number} position Current position on the page
   * @param {Number} endLocation Scroll to location
   * @param {Number} animationInterval How much to scroll on this loop
   */
		var stopAnimateScroll = function stopAnimateScroll(position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if (position == endLocation || currentLocation == endLocation || root.innerHeight + currentLocation >= documentHeight) {
				clearInterval(animationInterval);
				if (!isNum) {
					anchorElem.focus();
				}
				animateSettings.callback(anchor, toggle); // Run callbacks after animation complete
			}
		};

		/**
   * Loop scrolling animation
   * @private
   */
		var loopAnimateScroll = function loopAnimateScroll() {
			timeLapsed += 16;
			percentage = timeLapsed / parseInt(animateSettings.speed, 10);
			percentage = percentage > 1 ? 1 : percentage;
			position = startLocation + distance * easingPattern(animateSettings.easing, percentage);
			root.scrollTo(0, Math.floor(position));
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
   * Set interval timer
   * @private
   */
		var startAnimateScroll = function startAnimateScroll() {
			clearInterval(animationInterval);
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
   * Reset position to fix weird iOS bug
   * @link https://github.com/cferdinandi/smooth-scroll/issues/45
   */
		if (root.pageYOffset === 0) {
			root.scrollTo(0, 0);
		}

		// Start scrolling animation
		startAnimateScroll();
	};

	/**
  * If smooth scroll element clicked, animate scroll
  * @private
  */
	var eventHandler = function eventHandler(event) {

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// If a smooth scroll link, animate it
		var toggle = getClosest(event.target, settings.selector);
		if (toggle && toggle.tagName.toLowerCase() === 'a') {
			event.preventDefault(); // Prevent default click event
			var hash = smoothScroll.escapeCharacters(toggle.hash); // Escape hash characters
			smoothScroll.animateScroll(hash, toggle, settings); // Animate scroll
		}
	};

	/**
  * On window scroll and resize, only run events at a rate of 15fps for better performance
  * @private
  * @param  {Function} eventTimeout Timeout function
  * @param  {Object} settings
  */
	var eventThrottler = function eventThrottler(event) {
		if (!eventTimeout) {
			eventTimeout = setTimeout(function () {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight(fixedHeader); // Get the height of a fixed header if one exists
			}, 66);
		}
	};

	/**
  * Destroy the current initialization.
  * @public
  */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if (!settings) return;

		// Remove event listeners
		root.document.removeEventListener('click', eventHandler, false);
		root.removeEventListener('resize', eventThrottler, false);

		// Reset varaibles
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
		animationInterval = null;
	};

	/**
  * Initialize Smooth Scroll
  * @public
  * @param {Object} options User settings
  */
	smoothScroll.init = function (options) {

		// feature test
		if (!supports) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend(defaults, options || {}); // Merge user options with defaults
		fixedHeader = root.document.querySelector(settings.selectorHeader); // Get the fixed header
		headerHeight = getHeaderHeight(fixedHeader);

		// When a toggle is clicked, run the click handler
		root.document.addEventListener('click', eventHandler, false);
		if (fixedHeader) {
			root.addEventListener('resize', eventThrottler, false);
		}
	};

	//
	// Public APIs
	//

	return smoothScroll;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var showNavClass = 'show-nav';
var toggle = void 0;
var body = void 0;

exports.default = function () {
  body = document.getElementsByTagName('body')[0];
  toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', toggleNav);
}();

function toggleNav() {
  if (body.classList.contains(showNavClass)) {
    body.classList.remove(showNavClass);
  } else {
    body.classList.add(showNavClass);
  }
}

/***/ },
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"clearfix":"index_clearfix__11CX7","section":"index_section__2eRdj","row":"index_row__27PEP","example-wrapper":"index_example-wrapper__2RX0V","anchors":"index_anchors__17q-7","table":"index_table__1Wy3h","input-arguments":"index_input-arguments__3LxV1","variables-matrix":"index_variables-matrix__2DSnJ","td":"index_td__tHvQN","th":"index_th__3Gl90","badge":"index_badge__1WZyt","badge__browser":"index_badge__browser__Ye89Z","badge__node":"index_badge__node__3BHFd","badge__npm":"index_badge__npm__1LKOI","badge__protractor":"index_badge__protractor__2Dz1v","badge__webpack":"index_badge__webpack__2_oIL","brand":"index_brand__1p0TG","logo":"index_logo__1x0LU","nav-toggle":"index_nav-toggle__1Kb7x","icon-bar":"index_icon-bar__3cICM","callout":"index_callout__2LoxW","pre":"index_pre__brjEE","code":"index_code__3EW9K","code-snippet":"index_code-snippet__2WnUC","render-preview":"index_render-preview__XZHPb","code-preview":"index_code-preview__1Knik","code-wrapper":"index_code-wrapper__3jGNE","window-bar":"index_window-bar__2SOOS","circles":"index_circles__f6mRL","circle":"index_circle__1hF7I","circle-red":"index_circle-red__22SGN","circle-yellow":"index_circle-yellow__2EqGR","circle-green":"index_circle-green__HrpKD","version":"index_version__xY3_Z","top-line":"index_top-line__22n5n","hr":"index_hr__3M1hu","github":"index_github__8An62","ul":"index_ul__1RNVH","ol":"index_ol__2XH-h","navigation":"index_navigation__14lTH","a":"index_a__oUQfl","li":"index_li__3iyTZ","active":"index_active__1pg2E","sidebar":"index_sidebar__27o42","tr":"index_tr__Fj0bf","h1":"index_h1__1SLAe","h2":"index_h2__2oHd5","h3":"index_h3__3zIem","h4":"index_h4__1f8cv","h5":"index_h5__2-mH-","h6":"index_h6__1sAd_","strong":"index_strong__F3PJg","blockquote":"index_blockquote__1IXJN","p":"index_p__1NOy6","em":"index_em__DbtVE","column-layout":"index_column-layout__15yII","lead":"index_lead__23C4T","page-header":"index_page-header__2Qz_l","text-block":"index_text-block__2MdTA","text-center":"index_text-center__2PvqE","outer-wrap":"index_outer-wrap__1vW7y","main":"index_main__2py9k","has-anchors":"index_has-anchors__3EyLH"};

/***/ },
/* 12 */
/***/ function(module, exports) {

(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

Prism.hooks.add('complete', function (env) {
	if (!env.code) {
		return;
	}

	// works only for <code> wrapped inside <pre> (not inline)
	var pre = env.element.parentNode;
	var clsReg = /\s*\bline-numbers\b\s*/;
	if (
		!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
		(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
	) {
		return;
	}

	if (env.element.querySelector(".line-numbers-rows")) {
		// Abort if line numbers already exists
		return;
	}

	if (clsReg.test(env.element.className)) {
		// Remove the class "line-numbers" from the <code>
		env.element.className = env.element.className.replace(clsReg, '');
	}
	if (!clsReg.test(pre.className)) {
		// Add the class "line-numbers" to the <pre>
		pre.className += ' line-numbers';
	}

	var match = env.code.match(/\n(?!$)/g);
	var linesNum = match ? match.length + 1 : 1;
	var lineNumbersWrapper;

	var lines = new Array(linesNum + 1);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});

}());

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						// Reconstruct the original text using the next two tokens
						var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
						    combStr = str + nextToken;

						if (i < strarr.length - 2) {
							combStr += strarr[i + 2].matchedStr || strarr[i + 2];
						}

						// Try the pattern again on the reconstructed text
						pattern.lastIndex = 0;
						match = pattern.exec(combStr);
						if (!match) {
							continue;
						}

						var from = match.index + (lookbehind ? match[1].length : 0);
						// To be a valid candidate, the new match has to start inside of str
						if (from >= str.length) {
							continue;
						}
						var to = match.index + match[0].length,
						    len = str.length + nextToken.length;

						// Number of tokens to delete and replace with the new match
						delNum = 3;

						if (to <= len) {
							if (strarr[i + 1].greedy) {
								continue;
							}
							delNum = 2;
							combStr = combStr.slice(0, len);
						}
						str = combStr;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.matchedStr = matchedStr || null;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'class-name', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }
/******/ ]);
//# sourceMappingURL=theme.721e6b2b.bundle.js.map