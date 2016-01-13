angular.module('starter.controllers', ['starter.resources'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    })
    //Home Controller
    .controller('HomeCtrl', function ($scope, $ionicModal, $window, JsonData, $state, $ionicSlideBoxDelegate, $ionicPopup, $cordovaGeolocation,QuakeReport) {
        $scope.isOnline = JsonData.isOnline();
        if ($scope.isOnline) {
            var location = "";
            $scope.quakeAut = function () {
                $scope.quakeList = JsonData.getAut();
                location = "aut";
            };
            $scope.quakeAut();
            $scope.quakeWorld = function () {
                $scope.quakeList = JsonData.getWorld();
                location = "world";
            };
            $scope.quakeEu = function () {
                $scope.quakeList = JsonData.getEu();
                location = "eu";
            };
            $scope.loadMoreData = function () {
                JsonData.getMoreData(location).then(function (bebenAutArray) {
                    $scope.quakeList = $scope.quakeList.concat(bebenAutArray);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            $scope.$on('$stateChangeSuccess', function () {
                $scope.loadMoreData();
            });

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
                document.getElementById("modalHome").style.top = $window.innerHeight - 290 + "px";
            };
            //Wird beim betaetigen von Button vor mehr al 30 Minuten aktiviert
            $scope.vorMehrAls30Min = function () {
                $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
                var beben = JsonData.getAut();
                var bebenObject = beben[0];
                var bebenObject2 = beben[1];
                var bebenObject3 = beben[2];
                $scope.letzteBeben = [bebenObject, bebenObject2, bebenObject3];
                //$scope.letzteBeben = [bebenObject, bebenObject2];
            };

            //Routing fuer den Button anderes Beben
            $scope.anderesBeben = function () {
                $state.go('app.bebenEintrag');
                $scope.selectModal.hide();
            };
            //Fuer das Button "Ja gerade jetzt" Standort bestimmen und Datum setzten
            $scope.geradeJetzt = function () {
                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        console.log(lat);
                        console.log(long);
                        //TODO: GET TIME IN UTC AND ADD IT TO QUAKEDATA

                        var d1 = new Date();
                        //d1.toUTCString();

                        console.log(d1.toUTCString());
                        QuakeReport.setLon(long);
                        QuakeReport.setLat(lat);
                        $state.go('app.bebenWahrnehmung');
                        $scope.selectModal.hide();
                    }, function (err) {
                        $scope.selectModal.hide();
                        $state.go('app.bebenEintrag');
                    });
            };
            //Fuer die Buttons der 3 letzten spuerhbaren erdbeben (ID uebergeben)
            $scope.recentQuakes = function (id) {
                QuakeReport.setId(id);
                $scope.selectModal.hide();
                $state.go('app.bebenEintrag');
            };
            //END MODAL
        }
    })
    .controller('BebenWahrnehmungCtrl', function ($scope, $ionicModal, $state, JsonData) {
        $scope.continueToAdditional = function () {
            $state.go('app.bebenZusatzfragen');
        };
    })
    .controller('ZusatzVerhaltenCtrl', function ($scope, $location, $anchorScroll, $ionicScrollDelegate) {
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };
        $scope.scrollToAnchor = function (anchorID) {
            $location.hash(anchorID);
            var handle = $ionicScrollDelegate.$getByHandle('verhaltenContent');
            handle.anchorScroll(true);
        };
    })
    .controller('ZusatzUebersichtCtrl', function ($scope) {
		
    })
	.controller('ZusatzLexikonCtrl', function ($scope, $ionicScrollDelegate, $ionicPopup, $timeout) {
		$scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };
		
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
			title: '>_ mandalore394',
			});
		};
    })
    .controller('BebenZusatzfragenCtrl', function ($scope, $ionicModal, $state, JsonData) {
        $scope.goTo = function () {
            $state.go('app.bebenZusatzfragen');

        };
    })
    .controller('BebenDetailCtrl', function ($scope, $ionicModal, JsonData, $stateParams, $state, $cordovaGeolocation,QuakeReport,$window) {
        function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295;    // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;
            var fullResult = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            return Math.round(fullResult * 100) / 100;
        }
        $scope.quake = JsonData.getQuakefromIdWorld($stateParams.bebenId);
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                $scope.quake.distanceFromPhoneToQuake = distance(
                        position.coords.latitude,
                        position.coords.longitude,
                        $scope.quake.locLat,
                        $scope.quake.locLon
                    ) + " km";
            }, function (err) {
                $scope.quake.distanceFromPhoneToQuake = "Bitte Ortungsdienste aktivieren";
            });
        //MODAL BEBENDETAIL
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;

        });
        $scope.openBebenModal = function () {
            $scope.bebenmodal.show();
            document.getElementById("modalDetail").style.top = $window.innerHeight - 170 + "px";
            //console.log(document.getElementById("header").offsetHeight+document.getElementById("content2").offsetHeight);
        };
        $scope.closeBebenModal = function () {
            $scope.bebenmodal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.bebenmodal.remove();
        });
        $scope.geradeJetzt = function () {
            QuakeReport.setId($stateParams.bebenId);
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    console.log(lat);
                    console.log(long);
                    QuakeReport.setLon(long);
                    QuakeReport.setLat(lat);
                    $state.go('app.bebenWahrnehmung');
                    $scope.bebenmodal.hide();
                }, function (err) {
                    $state.go('app.bebenEintrag');
                });
        };
        $scope.vorMehrAls30Min = function () {
            QuakeReport.setId($stateParams.bebenId);
            $scope.bebenmodal.hide();
            $state.go('app.bebenEintrag');
        };
        //MODAL ENDE
    })
    .controller('BebenEintragCtrl', function ($scope, $ionicModal, JsonData, $stateParams, $state) {
        /*
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;
            modal.hide();
        });
        //$scope.bebenmodal.hide();
        $scope.$on('modal.shown', function () {
            $scope.bebenmodal.hide();
        });
        $scope.goToComics = function () {
            $state.go('app.bebenWahrnehmung');
        }
        */
    });
