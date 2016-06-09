/**
 * @ngdoc overview
 * @name quakewatch
 * @description
 * # quakewatch
 * Hier wird das routing der Applikation durchgeführt.
 * Falls eine neue View (Seite, Menüpunkt, ..) hizugefügt wird dann muss diese auch hier verlinkt werden.
 * Alle externen Module die für die App benötigt werden sind hier inkludiert.(außer ngResource,es ist eine Gewohnheit diese im Service Modul zu importieren)
 */
angular.module('quakewatch', ['ionic', 'quakewatch.controllers', 'quakewatch.resources','ngCordova','angularMoment','ionic-timepicker','ionic-datepicker','ngMap'])
    .run(function ($ionicPlatform,amMoment) {
        $ionicPlatform.ready(function () {
            // then override any default you want
            window.plugins.nativepagetransitions.globalOptions.duration = 500;
            window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
            window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
            window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
            window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
            // these are used for slide left/right only currently
            window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
            window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
            //Zum anzeigen der Vergangenen Zeit in deutsch(beben_detail)
            amMoment.changeLocale('de-at');
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        /**
         * @ngdoc object
         * @name quakewatch.object:state('app')
         * @description
         * Das ist der Controller für die home.html View
         */
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.home', {
                url: '/home',
                resolve: {
                    AustrianDataResolved: function (JsonData,$ionicLoading) {
                        $ionicLoading.show({
                            template: '<ion-spinner></ion-spinner><br/>Lade Erdbebendaten',
                            hideOnStateChange: true
                        });
                        var autData = JsonData.AutPromise;
                        autData.then(function(result) {
                            JsonData.setOnline(result);
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
            })
			.state('app.zusatzLexikon', {
                url: '/zusatzLexikon',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/zusatz_lexikon.html',
                        controller: 'ZusatzLexikonCtrl'
                    }
                }
            })
			.state('app.zusatzImpressum', {
                url: '/zusatzImpressum',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/zusatz_impressum.html',
                        controller: 'ZusatzImpressumCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
