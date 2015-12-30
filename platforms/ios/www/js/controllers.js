angular.module('starter.controllers', ['starter.resources'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


    })
    //Home Controller
    .controller('HomeCtrl', function ($scope, $ionicModal, JsonData,$state,$ionicSlideBoxDelegate, $ionicPopup, $cordovaGeolocation) {

        $scope.quakeAut = function(){
            $scope.quakeList=JsonData.getAut();
        };

        $scope.quakeAut();

        $scope.bebenWorld = function(){
            $scope.bebenliste = JsonData.getWorld();
        };

        $scope.bebenEu = function(){
            $scope.bebenliste = JsonData.getEu();
        };


        //START BEBEN REPORT MODAL UND SEINE FUNKTIONEN
        $ionicModal.fromTemplateUrl('templates/lade_daten_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectModal = modal;
            $scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
            $scope.selectModalSlider.enableSlide(false);
        });

        $scope.closeSelectModal = function () {
            if ($scope.selectModalSlider.currentIndex() == 0)
                $scope.selectModal.hide();
            else
                $scope.selectModalSlider.previous();
        };

        $scope.openSelectModal = function () {
            $scope.selectModalSlider.slide(0);
            $scope.selectModal.show();
        };

        //Wird beim betaetigen von Button vor mehr al 30 Minuten aktiviert
        $scope.vorMehrAls30Min = function(){
            $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
            //@TODO ERDBEBEN LETZTE ERDBEBEN LADEN
            //Jetzt noch sample data
            bebenObject ={
                date:"Dezember 1",
                id:"1"
            };
            bebenObject2 ={
                date:"Dezember 2",
                id:"2"
            };
            bebenObject3 ={
                date:"Dezember 3",
                id:"3"
            };
            $scope.letzteBeben = [bebenObject,bebenObject2,bebenObject3];
        }
        //Routing fuer den Button anderes Beben
        $scope.anderesBeben = function (){
            $state.go('app.bebenEintrag');
            $scope.selectModal.hide();
        }
        //Fuer das Button "Ja gerade jetzt" Standort bestimmen und Datum setzten
        $scope.getGeoLocation = function () {
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat  = position.coords.latitude
                    var long = position.coords.longitude
                    console.log(lat);
                    console.log(long);

                    $state.go('app.bebenWahrnehmung');
                    $scope.selectModal.hide();
                }, function(err) {
                    $state.go('app.bebenEintrag');
                });
        }
        //Fuer die Buttons der 3 letzten spuerhbaren erdbeben (ID uebergeben
        $scope.getGeoLocationWithBebenId = function (bebenid) {
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat  = position.coords.latitude
                    var long = position.coords.longitude
                    console.log(lat);
                    console.log(long);

                    $state.go('app.bebenWahrnehmung');
                    $scope.selectModal.hide();
                }, function(err) {
                    $state.go('app.bebenEintrag');
                });
        }
        //END MODAL
    })
    .controller('BebenWahrnehmungCtrl', function ($scope, $ionicModal, JsonData) {




    })
    .controller('BebenZusatzfragenCtrl', function ($scope, $ionicModal, JsonData) {
        //@TODO Object zurückgeben mit fragen und input typ (bild text)
    })
    .controller('BebenDetailCtrl', function ($scope, $ionicModal, JsonData, $stateParams,$state,$cordovaGlobalization) {

        $cordovaGlobalization.getLocaleName().then(
            function(result) {
                console.log(result);
            },
            function(error) {
                // error
            });

        if($stateParams.bebenRegion === 'AUSTRIA'){
            $scope.quake = JsonData.getQuakefromId($stateParams.bebenId);
        }else {
            $scope.quake = JsonData.getQuakefromIdWorld($stateParams.bebenId);
        }
        /*
        //@TODO Aendern wenn neues REST interface implementiert wird
        $scope.flynn_region=quake.properties.flynn_region;
        $scope.mag=quake.properties.mag;
        $scope.lon=quake.properties.lon;
        $scope.lat=quake.properties.lat;
        $scope.time=quake.timeLocal;
        $scope.date=quake.date;
        */
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;
        });

        $scope.beben_verspuert = function () {
            $scope.bebenmodal.show();
        };
        $scope.closeBebenModal = function () {
            $scope.bebenmodal.hide();
        };

    })
    .controller('BebenEintragCtrl', function ($scope, $ionicModal, JsonData, $stateParams,$state) {
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;
            modal.hide();
        });
        //$scope.bebenmodal.hide();
        $scope.$on('modal.shown',function(){
            $scope.bebenmodal.hide();
        });

        $scope.goToComics = function(){
            $state.go('app.bebenWahrnehmung');
        }

    });
