angular.module('starter.controllers', ['starter.resources'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };


    })
    .controller('HomeCtrl', function ($scope, $ionicModal, AustrianData) {

        $scope.bebenAut = function(){
            $scope.bebenliste=AustrianData.getAut();
        };

        $scope.bebenAut();

        $scope.bebenWorld = function(){
            $scope.bebenliste = AustrianData.getWorld();
        };

        $scope.bebenEu = function(){
            $scope.bebenliste = AustrianData.getEu();
        }

        //ionicModal
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;
            $scope.bebenmodal.show();
        });
        $scope.beben_verspuert = function () {
            $scope.bebenmodal.show();
        };
        $scope.closeBebenModal = function () {
            $scope.bebenmodal.hide();
        };
        //


    })
    .controller('BebenDetailCtrl', function ($scope, $ionicModal, AustrianData, $stateParams) {

        if($stateParams.bebenRegion === 'AUSTRIA'){
            var quake = AustrianData.getQuakefromId($stateParams.bebenId);
        }else {
            var quake = AustrianData.getQuakefromIdWorld($stateParams.bebenId);
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

    });
