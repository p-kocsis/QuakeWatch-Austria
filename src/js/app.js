angular.module('QuakeWatch', [
  'ngRoute',
  'mobile-angular-ui',
  'QuakeWatch.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
});