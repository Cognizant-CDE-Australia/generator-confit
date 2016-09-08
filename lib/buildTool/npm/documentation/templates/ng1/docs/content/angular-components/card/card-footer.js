import styles from './styles/card-footer.styl'

const mod = angular.module('swanky.components.card.cardFooter', []).component('cardFooter', {
  transclude: true,
  template: require('./templates/card-footer.tpl.html')
})

export default mod.name
