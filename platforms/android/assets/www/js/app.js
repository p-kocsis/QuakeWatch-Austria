// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.resources','ngCordova','angularMoment'])
    .run(function ($ionicPlatform,amMoment) {
        $ionicPlatform.ready(function () {
            //Zum anzeigen der Vergangenen Zeit in deutsch(beben_detail)
            amMoment.changeLocale('de-at');
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.home', {
                url: '/home',
                resolve: {
                    AustrianDataResolved: function (JsonData) {
                        var autData = JsonData.AutPromise;
                        autData.then(function(result) {
                            JsonData.setOnline(result);
                            console.log(result);
                            console.log(JsonData.isOnline());
                        });
                        return autData;
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }

            })
            .state('app.bebenDetail', {
                url: '/bebenDetail/:bebenId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/beben_detail.html',
                        controller: 'BebenDetailCtrl'
                    }
                }
            })
            .state('app.bebenWahrnehmung', {
                url: '/bebenWahrnehmung',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/beben_wahrnehmung.html',
                        controller: 'BebenWahrnehmungCtrl'
                    }
                }
            })
            .state('app.bebenZusatzfragen', {
                url: '/bebenZusatzfragen',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/beben_zusatzfragen.html',
                        controller: 'BebenZusatzfragenCtrl'
                    }
                }
            })
			.state('app.zusatzVerhalten', {
                url: '/zusatzVerhalten',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/zusatz_verhalten_erdbeben.html',
                        controller: 'ZusatzVerhaltenCtrl'
                    }
                }
            })
			.state('app.zusatzUebersicht', {
                url: '/zusatzUebersicht',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/zusatz_uebersicht.html',
                        controller: 'ZusatzUebersichtCtrl'
                    }
                }
            })
            .state('app.bebenEintrag', {
                url: '/bebenEintrag',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/beben_eintrag.html',
                        controller: 'BebenEintragCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
