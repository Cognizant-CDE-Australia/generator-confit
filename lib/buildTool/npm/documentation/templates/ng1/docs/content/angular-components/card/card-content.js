import styles from './styles/card-content.styl'

const mod = angular.module('swanky.components.card.cardContent', []).component('cardContent', {
  transclude: true,
  template: require('./templates/card-content.tpl.html')
})

export default mod.name
