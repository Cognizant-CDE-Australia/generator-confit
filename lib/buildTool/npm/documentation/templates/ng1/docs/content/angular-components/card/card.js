import styles from './styles/card.styl'

/**
 * @ngdoc directive
 *
 * @name swanky.components.card:cardComponent
 *
 * @scope
 *
 * @description
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut molestie leo, ut suscipit est.
 * Sed ut molestie ligula. Aenean in elit at erat luctus laoreet congue sit amet massa. Donec dapibus dolor sit amet neque
 * commodo maximus.
 *
 * @usage
 * ```html
 * <card>
 *  <card-header hero="http://bit.ly/2aC3YgJ" avatar="http://bit.ly/2avTw7Y" badge="blog"></card-header>
 *
 *  <card-content>
 *   <h5>Travel / Adventure</h5>
 *   <h2>Living Helsinki</h2>
 *   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
 *   <button class="btn-default">View</button>
 *  </card-content>
 *
 *  <card-footer>
 *   <card-action type="comment">6</card-action>
 *   <card-action type="like">81</card-action>
 *  </card-footer>
 * </card>
 * ```
 *
 * @example
 * <div class="card-grid">
 *  <card>
 *   <card-header hero="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/heros/hero-01.jpg"
 *   avatar="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/avatars/avatar-01.jpg"
 *   badge="blog"></card-header>
 *
 *   <card-content>
 *    <h5>Travel / Adventure</h5>
 *    <h2>Living Helsinki</h2>
 *    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
 *    <button class="btn-default">View</button>
 *   </card-content>
 *
 *   <card-footer>
 *    <card-action type="comment">6</card-action>
 *    <card-action type="like">81</card-action>
 *   </card-footer>
 *  </card>
 *
 *  <card>
 *   <card-header hero="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/heros/hero-02.jpg"
 *   avatar="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/avatars/avatar-02.jpg"
 *   badge="blog"></card-header>
 *
 *   <card-content>
 *    <h5>Travel / Adventure</h5>
 *    <h2>Hipster Bearding</h2>
 *    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
 *    <button class="btn-default">View</button>
 *   </card-content>
 *
 *   <card-footer>
 *    <card-action type="comment">6</card-action>
 *    <card-action type="like">81</card-action>
 *   </card-footer>
 *  </card>
 *
 *  <card>
 *   <card-header hero="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/heros/hero-03.jpg"
 *   avatar="https://s3-ap-southeast-2.amazonaws.com/swanky-docs/images/avatars/avatar-03.jpg"
 *   badge="blog"></card-header>
 *
 *   <card-content>
 *    <h5>Travel / Adventure</h5>
 *    <h2>A Walk in the Woods</h2>
 *    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
 *    <button class="btn-default">View</button>
 *   </card-content>
 *
 *   <card-footer>
 *    <card-action type="comment">6</card-action>
 *    <card-action type="like">81</card-action>
 *   </card-footer>
 *  </card>
 * </div>
 */

const mod = angular.module('swanky.components.card.default', []).component('card', {
  transclude: true,
  template: require('./templates/card.tpl.html'),
  controller: function () {}
})

export default mod.name
