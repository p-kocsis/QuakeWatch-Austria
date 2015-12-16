angular.module('starter.controllers', ['starter.resources'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


    })
    .controller('HomeCtrl', function ($scope, $ionicModal, JsonData,$state,$ionicSlideBoxDelegate, $ionicPopup, $cordovaGeolocation) {

        $scope.bebenAut = function(){
            $scope.bebenliste=JsonData.getAut();
        };

        $scope.bebenAut();

        $scope.bebenWorld = function(){
            $scope.bebenliste = JsonData.getWorld();
        };

        $scope.bebenEu = function(){
            $scope.bebenliste = JsonData.getEu();
        };



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

        $scope.vorMehrAls30Min = function(){
            $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
            //ERDBEBEN LETZTE ERDBEBEN LADEN
            bebenObject.date="Dezember 1";
            bebenObject.id="1";
            bebenObject2.date="Dezember 2";
            bebenObject2.id="2";
            bebenObject3.date="Dezember 3";
            bebenObject3.id="3";
            $scope.letzteBeben = [bebenObject,bebenObject2,bebenObject3];
        }

        $scope.anderesBeben = function (){
            $state.go('app.bebenEintrag');
            $scope.selectModal.hide();
        }
        $scope.goToComics = function(){
            $state.go('app.bebenWahrnehmung');
            $scope.selectModal.hide();
        }

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
    })
    .controller('BebenWahrnehmungCtrl', function ($scope, $ionicModal, JsonData) {




    })
    .controller('BebenZusatzfragenCtrl', function ($scope, $ionicModal, JsonData) {

        //@TODO Object zurückgeben mit fragen und input typ (bild text)

    })
    .controller('BebenDetailCtrl', function ($scope, $ionicModal, JsonData, $stateParams,$state) {

        if($stateParams.bebenRegion === 'AUSTRIA'){
            var quake = JsonData.getQuakefromId($stateParams.bebenId);
        }else {
            var quake = JsonData.getQuakefromIdWorld($stateParams.bebenId);
        }

        $scope.flynn_region=quake.properties.flynn_region;
        $scope.mag=quake.properties.mag;
        $scope.lon=quake.properties.lon;
        $scope.lat=quake.properties.lat;
        $scope.time=quake.timeLocal;
        $scope.date=quake.date;


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
