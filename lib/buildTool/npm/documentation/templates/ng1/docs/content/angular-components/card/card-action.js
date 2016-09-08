import styles from './styles/card-action.styl'
/**
 * @ngdoc directive
 *
 * @name swanky.components.card:cardAction
 *
 * @scope
 *
 * @description
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut molestie leo, ut suscipit est.
 * Sed ut molestie ligula.
 *
 * @param {String} type Type of action
 *
 * @usage
 * ```html
 * <card-action type="comment">6</card-action>
 * <card-action type="like">81</card-action>
 * ```
 * @example
 * <card-action type="comment">6</card-action>
 * <card-action type="like">81</card-action>
 */

const mod = angular.module('swanky.components.card.cardAction', []).component('cardAction', {
  transclude: true,
  template: require('./templates/card-action.tpl.html'),
  bindings: {
    type: '@'
  }
})

export default mod.name
