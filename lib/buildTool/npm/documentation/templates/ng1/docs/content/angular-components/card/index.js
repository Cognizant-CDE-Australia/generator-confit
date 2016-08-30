import angular from 'angular'
import card from './card'
import cardHeader from './card-header'
import cardContent from './card-content'
import cardFooter from './card-footer'
import cardAction from './card-action'

const mod = angular.module('swanky.components.cards', [card, cardHeader, cardContent, cardFooter, cardAction])

export default mod.name
