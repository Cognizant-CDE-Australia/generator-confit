import styles from './styles/card-header.styl'

/**
 * @ngdoc directive
 *
 * @name swanky.components.card:cardHeader
 *
 * @scope
 *
 * @param {String} hero url to 'hero' image - relative or absolute
 * @param {String} badge a label for the badge
 * @param {String} avatar url to avatar image - relative or absolute
 *
 * @description
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut molestie leo, ut suscipit est.
 *
 * @usage
 * ```html
 * <card-header hero="http://bit.ly/2aC3YgJ" avatar="http://bit.ly/2avTw7Y" badge="blog"></card-header>
 * ```
 *
 * @example
 * <card-header hero="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/heros/hero-03.jpg"
 * avatar="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/avatars/avatar-03.jpg"
 * badge="blog"></card-header>
 */


const mod = angular.module('swanky.components.card.cardHeader', []).component('cardHeader', {
  template: require('./templates/card-header.tpl.html'),
  bindings: {
    hero: '@',
    badge: '@',
    avatar: '@'
  }
})

export default mod.name
