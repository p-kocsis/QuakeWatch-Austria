/**
 * @ngdoc overview
 * @name controllers
 * @description
 * # controllers (controllers.js)
 * Die Logik dr Applikation ist in den Kontrollern für die einzelnen Views verteilt
 * In diesem Modul sind alle Kontroller Implementiert
 */
angular.module('quakewatch.controllers', ['quakewatch.resources'])
    /**
    * @ngdoc controller
    * @name controllers.controller:AppCtrl
    * @description
    * In diesem Kontroller werden alle Funktionen, welche beim start der App erledigt werden müssen, ausgeführt.
    */
    .controller('AppCtrl', function (JsonData, $scope, AppInfo, $ionicPopup) {
        $scope.isOnline = JsonData.isOnline();
        //Generierung des API Keys(Nur einmal bei der Installation)
        //console.log('BH in Controller AppCtrl');
        //console.log(AppInfo);
        //console.log(AppInfo.isInitialRun());
        if (AppInfo.isInitialRun() === true) {
            AppInfo.setInitialRun(false);
            AppInfo.generateAPIKey();
        }
        //Gecachetes Erdbeben melden
        //@TODO KOMMENTAR ENTFERNEN
        //if ($cordovaNetwork.isOnline()) {
            if (AppInfo.isCachedQuake() === true) {
                AppInfo.reportCachedQuake();
                AppInfo.removeCachedQuake();
                //console.log("isCached2: ",AppInfo.isCachedQuake());
                //Popup um benutzer ueber das melden der gecacheten app zu benachrichtigen
                var alertPopup = $ionicPopup.alert({
                    title: 'Ihre gecachte Meldung wurde versendet!',
                    template: 'Ihre gecachte Meldung wurde versendet!',
                    okText: '', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.

                });
                alertPopup.then(function (res) {
                });
            }
        //}
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:HomeCtrl
     * @description
     * Das ist der Controller für die home.html View (inklusive des Erdbeben melden modals)
     */
    .controller('HomeCtrl', function ($scope, $cordovaDialogs, $timeout, $ionicScrollDelegate, $ionicModal, $window, JsonData, $state, $ionicSlideBoxDelegate, $ionicPopup, $cordovaGeolocation, QuakeReport, $ionicLoading, AppInfo) {
        $scope.isOnline = JsonData.isOnline();
        //Funktion fuer den Button "In den Online Modus wechseln"
        if (!$scope.isOnline) {
            $scope.getOnline = function () {
                document.location.href = 'index.html';
            };
        }
        if ($scope.isOnline) {
            var location = "";
            //Funktion um oesterreichische Erdbebendaten abzurufen und anzuzeigen
            $scope.quakeAut = function () {
                $ionicScrollDelegate.scrollTop();
                $scope.quakeList = JsonData.getAut();
                location = "aut";
            };
            //Beim aufruf der App werden 10 oesterreichische Erdbeben geladen
            $scope.quakeAut();
            //Funktion um alle erdbebendaten abzurufen und anzuzeigen
            $scope.quakeWorld = function () {
                $ionicScrollDelegate.scrollTop();
                $scope.quakeList = JsonData.getWorld();
                location = "world";
            };
            //Funktion um alle europaeische Erdbebendaten abzurufen und anzuzeigen
            $scope.quakeEu = function () {
                $ionicScrollDelegate.scrollTop();
                $scope.quakeList = JsonData.getEu();
                location = "eu";
            };
            // Funktion um Daten mithilfe des Reload Buttons(rechts oben) nachzuladen
            // (location beschreibt auf welcher Seite sich der Benutzer befindet Aut, Eu, Welt)
            $scope.loaded = false;
            $scope.reloadFiles = function () {
                // $scope.isOnline
                if (!$scope.isOnline) {
                //if (!$cordovaNetwork.isOnline()) {
                    document.location.href = 'index.html';
                } else {
                    $scope.quakeList=JsonData.reloadData(location);
                    $ionicScrollDelegate.scrollTop();
                    $scope.loaded = true;
                    /*
                    JsonData.reloadData(location).then(function (list) {
                            $ionicScrollDelegate.scrollTop();
                            $scope.loaded = true;
                            $scope.quakeList = list;
                        }
                    );
                    */
                    //Nachricht wieder verdecken
                    $timeout(function () {
                        $scope.loaded = false;
                    }, 3000);
                }
            };
            //Funktion um Daten beim herabscrollen nachzuladen
            $scope.loadMoreData = function () {
                if (!JsonData.isOnline()) {
                //if (!$cordovaNetwork.isOnline()) {
                    JsonData.setOnline(false);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    document.location.href = 'index.html';
                } else {
                    JsonData.getMoreData(location).then(function (bebenAutArray) {
                        $scope.quakeList = $scope.quakeList.concat(bebenAutArray);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            };
            $scope.$on('$stateChangeSuccess', function () {
                $scope.loadMoreData();
            });
        }

        //----- START BEBEN REPORT MODAL UND SEINE FUNKTIONEN -----

        $ionicModal.fromTemplateUrl('templates/lade_daten_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectModal = modal;
            $scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
            $scope.selectModalSlider.enableSlide(false);
        });
        //Funktion um das "Erdbeben Melden" Modal zu schließen
        $scope.closeSelectModal = function () {
            if ($scope.selectModalSlider.currentIndex() == 0)
                $scope.selectModal.hide();
            else
                $scope.selectModalSlider.previous();
        };
        //Funktion um das "Erdbeben Melden" Modal zu oeffnen
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

        //Das GPS Popup oeffnen
        function openGPSPopup() {
            $cordovaDialogs.confirm('Ihr GPS ist nicht aktiviert - einige Funktionen werden nicht verfügbar sein!', 'GPS deaktiviert!', ['Ignorieren', 'GPS - Aktivieren'])
                .then(function (buttonIndex) {
                    if (buttonIndex == 2) {
                        cordova.plugins.settings.open(function () {
                            },
                            function () {

                            });
                    }
                    if (buttonIndex == 1) {
                        $state.go('app.bebenEintrag');
                    }
                });
        }
        //Routing fuer den Button anderes Beben
        $scope.anderesBeben = function () {
            $state.go('app.bebenEintrag');
            $scope.selectModal.hide();
        };
        //Fuer das Button "Ja gerade jetzt" Standort bestimmen und Datum setzten
        $scope.geradeJetzt = function () {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br/>Lade Standortdaten',
                hideOnStateChange: true
            });
            var posOptions = {timeout: 3000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    console.log(lat);
                    console.log(long);
                    var d1 = new Date();
                    //d1.toUTCString();
                    console.log(d1.toJSON());
                    QuakeReport.setLocLastUpdate(d1.toJSON());
                    QuakeReport.setDateTime(d1.toJSON());
                    QuakeReport.setLon(long);
                    QuakeReport.setLat(lat);
                    QuakeReport.setLocPrec(position.coords.accuracy);
                    $scope.selectModal.hide();
                    $ionicLoading.hide();
                    $state.go('app.bebenWahrnehmung');
                }, function (err) {
                    $ionicLoading.hide();
                    openGPSPopup();
                    $scope.selectModal.hide();
                });
        };
        //Fuer die Buttons der 3 letzten spuerhbaren erdbeben (ID uebergeben)
        $scope.recentQuakes = function (id) {
            QuakeReport.setId(id);
            $scope.selectModal.hide();
            $state.go('app.bebenEintrag');
        };
        //----- END MODAL -----

    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenWahrnehmungCtrl
     * @description
     * Das ist der Controller für die beben_wahrnehmung.html View (Comics Seite)
     */
    .controller('BebenWahrnehmungCtrl', function ($scope, $state, QuakeReport) {
        //Funktion fuer Button "Trifft am ehesten zu"
        $scope.continueToAdditional = function (magClass) {
            QuakeReport.setMagClass(magClass);
            $state.go('app.bebenZusatzfragen');
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzVerhaltenCtrl
     * @description
     * Das ist der Controller für die zusatz_verhalten_erdbeben.html View (Verhaltensratgeber)
     */
    .controller('ZusatzVerhaltenCtrl', function ($scope, $location, $anchorScroll, $ionicScrollDelegate) {
        //Nach oben scrollen
        $scope.scrollTop = function () {
            $location.hash(" ");
            $ionicScrollDelegate.scrollTop(true);
        };
        // Zu einem gewissen Verhaltenstipp auf der Seite scrollen
        $scope.scrollToAnchor = function (anchorID) {
            $location.hash(anchorID);
            var handle = $ionicScrollDelegate.$getByHandle('verhaltenContent');
            handle.scrollBy(0, -8, true);
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzUebersichtCtrl
     * @description
     * Das ist der Controller für die zusatz_uebersicht.html View (Übersicht)
     * Macht nichts muss aber wegen AngularJS/Ionic vorhanden sein
     */
    .controller('ZusatzUebersichtCtrl', function ($scope) {

    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzLexikonCtrl
     * @description
     * Das ist der Controller für die zusatz_lexikon.html View (Lexikon)
     */
    .controller('ZusatzLexikonCtrl', function ($scope, $ionicScrollDelegate) {
        //ganz nach oben scrollen
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };
    })
	/**
     * @ngdoc controller
     * @name controllers.controller:ZusatzImpressumCtrl
     * @description
     * Das ist der Controller für die zusatz_impressum.html View (Impressum)
     */
    .controller('ZusatzImpressumCtrl', function ($scope, $ionicScrollDelegate) {
        //ganz nach oben scrollen
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenZusatzfragenCtrl
     * @description
     * Das ist der Controller für die beben_zusatzfragen.html View (Zusatzfragen)
     */
    .controller('BebenZusatzfragenCtrl', function ($scope, QuakeReport, $state, $ionicPopup, $ionicHistory, AppInfo) {
        //Input Object, von hier aus werden die Daten an die QuakeReport factory weitergegeben
        $scope.input = {
            floor: "",
            comment: null,
            contact: null
        };

        //Abfragen der Klassifikation
        $scope.klassifikation = QuakeReport.getQuakeDataObject().klassifikation;
        /*
         $ionicHistory.nextViewOptions({
         disableBack: true
         });
         */
        //Zusatzfragen in der QuakeReport Factory abspeichern
        $scope.sendData = function () {
            //Je nach Klassifikation richtige Zusatzfragen in der Factory setzten
            switch ($scope.klassifikation) {
                //Schwach
                case 1:
                    QuakeReport.setFloor($scope.input.floor);
                    QuakeReport.setComment($scope.input.comment);
                    break;
                //Deutlich
                case 2:
                    QuakeReport.setFloor($scope.input.floor);
                    QuakeReport.setComment($scope.input.comment);
                    break;
                case 3:
                    //stark
                    QuakeReport.setFloor($scope.input.floor);
                    zusatzFragen.f01 = ($scope.input.f1);
                    zusatzFragen.f02 = ($scope.input.f2);
                    zusatzFragen.f03 = ($scope.input.f3);
                    zusatzFragen.f15 = ($scope.input.f15);
                    QuakeReport.setZusatzfragen(zusatzFragen);
                    break;
                //stark, gebaeudeschaeden
                case 4:
                    QuakeReport.setFloor($scope.input.floor);
                    zusatzFragen.f02 = ($scope.input.f2);
                    zusatzFragen.f03 = ($scope.input.f3);
                    zusatzFragen.f07 = ($scope.input.f7);
                    zusatzFragen.f08 = ($scope.input.f8);
                    zusatzFragen.f15 = ($scope.input.f15);
                    QuakeReport.setZusatzfragen(zusatzFragen);
                    break;
                //sehr stark, betraechtliche gebaeudeschaeden
                case 5:
                    QuakeReport.setFloor($scope.input.floor);
                    zusatzFragen.f03 = ($scope.input.f3);
                    zusatzFragen.f04 = ($scope.input.f4);
                    zusatzFragen.f05 = ($scope.input.f5);
                    zusatzFragen.f07 = ($scope.input.f7);
                    zusatzFragen.f08 = ($scope.input.f8);
                    zusatzFragen.f09 = ($scope.input.f9);
                    zusatzFragen.f10 = ($scope.input.f10);
                    zusatzFragen.f11 = ($scope.input.f11);
                    zusatzFragen.f12 = ($scope.input.f12);
                    zusatzFragen.f13 = ($scope.input.f13);
                    zusatzFragen.f14 = ($scope.input.f14);
                    zusatzFragen.f15 = ($scope.input.f15);
                    QuakeReport.setZusatzfragen(zusatzFragen);
                    break;
                case 6:
                    QuakeReport.setFloor($scope.input.floor);
                    zusatzFragen.f03 = ($scope.input.f3);
                    zusatzFragen.f05 = ($scope.input.f5);
                    zusatzFragen.f07 = ($scope.input.f7);
                    zusatzFragen.f08 = ($scope.input.f8);
                    zusatzFragen.f09 = ($scope.input.f9);
                    zusatzFragen.f10 = ($scope.input.f10);
                    zusatzFragen.f11 = ($scope.input.f11);
                    zusatzFragen.f12 = ($scope.input.f12);
                    zusatzFragen.f13 = ($scope.input.f13);
                    zusatzFragen.f14 = ($scope.input.f14);
                    zusatzFragen.f15 = ($scope.input.f15);
                    QuakeReport.setZusatzfragen(zusatzFragen);
                    break;
            }

            /*
             QuakeReport.setFloor($scope.input.floor);
             QuakeReport.setComment($scope.input.comment);
             */

            //QuakeReport.sendData();
            //Ueberfruefen ob das Handy internet Zugang hat
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
//          console.log($cordovaNetwork.isOnline());
//          if ( true ) {
            if ($scope.isOnline) {
            //if ($cordovaNetwork.isOnline()) {
                //Daten versenden
                QuakeReport.sendData();
                //Benutzer ueber erfolgreiches versenden informieren
                var alertPopup = $ionicPopup.alert({
                    title: 'Danke für ihre Meldung!',
                    template: 'Danke für ihre Meldung!',
                    okText: '', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.
                });
                alertPopup.then(function (res) {
                    //$location.path("/app/home");
                    $state.go('app.home');
                });
            } else {
                //Kein Interenet Zugang daher werden die Daten gecacht und der Benutzer wird benachrichtigt
                var alertPopup = $ionicPopup.alert({
                    title: 'Danke für ihre Meldung!',
                    template: 'Leider haben sie keine Internet verbindung! Wenn Sie wieder online sind, dann wird das Erdbeben automatisch gemeldet.',
                    okText: '', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.

                });
                alertPopup.then(function (res) {
                    //$location.path("/app/home");
                    AppInfo.cacheQuake(QuakeReport.getQuakeDataObject());
                    $state.go('app.home');
                });
            }
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenDetailCtrl
     * @description
     * Das ist der Controller für die beben_detail.html View (Beben Details, nach dem Anclicken eines Erbebens in der Home View gelangt man hierher)
     */
    .controller('BebenDetailCtrl', function ($scope, $cordovaPreferences, $cordovaDialogs, $ionicPopup, $ionicHistory, $ionicModal, JsonData, $stateParams, $state, $cordovaGeolocation, QuakeReport, $window, $ionicLoading, AppInfo) {

        //Berechnen des Handy Standortes vom Erdbeben (return in KM)
        function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295;    // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;
            var fullResult = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            return Math.round(fullResult * 100) / 100;
        }

        //Header Setzten (In der Detail Ansicht die Kopfzeile mit der Erdbebenmagnitude)
        function setHeaderColor() {
            switch ($scope.quake.classColor) {
                case "item-balanced":
                    $scope.detailHeaderClass = "balanced-bg";
                    break;
                case "item-energized":
                    $scope.detailHeaderClass = "energized-bg";
                    break;
                case "item-assertive":
                    $scope.detailHeaderClass = "assertive-bg";
                    break;
            }
        }

        //Das GPS Popup (fuer die distanz zwischen Handy und Erdbeben) oeffnen
        function openGPSPopup() {
            $cordovaDialogs.confirm('Ihr GPS ist nicht aktiviert - einige Funktionen werden nicht verfügbar sein!', 'GPS deaktiviert!', ['Ignorieren', 'GPS - Aktivieren'])
                .then(function (buttonIndex) {
                    if (buttonIndex == 2) {
                        cordova.plugins.settings.open(function () {
                            },
                            function () {
                                $scope.quake.distanceFromPhoneToQuake = "GPS Dienste ausgeschalten";
                            });
                    }
                    if (buttonIndex == 1) {
                        $scope.quake.distanceFromPhoneToQuake = "GPS Dienste ausgeschalten";
                    }
                });
        }

        //Das GPS Popup (fuer ja gerade jetzt) oeffnen
        function openGPSPopupJaGeradeJetzt() {
            $cordovaDialogs.confirm('Ihr GPS ist nicht aktiviert - einige Funktionen werden nicht verfügbar sein!', 'GPS deaktiviert!', ['Ignorieren', 'GPS - Aktivieren'])
                .then(function (buttonIndex) {
                    if (buttonIndex == 2) {
                        $ionicLoading.hide();
                        cordova.plugins.settings.open(function () {
                            },
                            function () {

                            });
                    }
                    if (buttonIndex == 1) {
                        $state.go('app.bebenEintrag');
                    }
                });
        }
        
        /*
         * Standort bestimmen
         * @param callback Wenn die Position ermittelt werden konnte dann rueckgabe von true(GPS ON) und latitude und longtitude, bei fehler (GPS OFF) nur false
         */
        function getLocation(callback) {
            if (typeof callback === "function") {
                var posOptions = {timeout: 3500, enableHighAccuracy: false};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        callback(true, position.coords.latitude, position.coords.longitude);
                    }, function (err) {
                        callback(false);
                    });
            }
        }

        //Die Distanz zwischen Erdbeben und Handy in der HTML View anzeigen
        // -> $scope.quake.distanceFromPhoneToQuake
        function printDistancePhoneToQuake(isGpsEnabled, lat, long) {
            if (isGpsEnabled) {
                $scope.quake.distanceFromPhoneToQuake = distance(
                        lat,
                        long,
                        $scope.quake.locLat,
                        $scope.quake.locLon
                    ) + " km";
                $scope.$broadcast('scroll.resize');
            } else {
                if (AppInfo.firstTimeGPSPopup()) {
                    openGPSPopup();
                } else {
                    $scope.quake.distanceFromPhoneToQuake = "GPS Dienste ausgeschalten";
                }
            }
        }

        //Erdbeben Datenobjekt an die View weitergeben
        $scope.quake = JsonData.getQuakefromIdWorld($stateParams.bebenId);
        setHeaderColor();
        //Entfernung von Handy zu Erdbeben bestimmen und anzeigen
        getLocation(printDistancePhoneToQuake);

        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };
        //Google Maps Toggeln
        $scope.mapVisible = false;
        $scope.showMap = function () {
            $scope.mapVisible = !$scope.mapVisible;
            $scope.$broadcast('scroll.resize');
            // document.getElementById("scrollArea").offsetHeight;
        };

        //----- MODAL BEBENDETAIL -----
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;

        });
        $scope.openBebenModal = function () {
            $scope.bebenmodal.show();
            document.getElementById("modalDetail").style.top = $window.innerHeight - 170 + "px";
        };
        $scope.closeBebenModal = function () {
            $scope.bebenmodal.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.bebenmodal.remove();
        });

        $scope.geradeJetzt = function () {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br/>Lade Standortdaten'
            });
            QuakeReport.setId($stateParams.bebenId);
            var posOptions = {timeout: 3000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    var d1 = new Date(position.timestamp);
                    QuakeReport.setLocLastUpdate(d1.toJSON());
                    QuakeReport.setDateTime(d1.toJSON());
                    QuakeReport.setLon(long);
                    QuakeReport.setLat(lat);
                    QuakeReport.setLocPrec(position.coords.accuracy);
                    $scope.bebenmodal.hide();
                    $ionicLoading.hide();
                    $state.go('app.bebenWahrnehmung');
                }, function (err) {
                    $scope.bebenmodal.hide();
                    $ionicLoading.hide();
                    openGPSPopupJaGeradeJetzt();
                });
        };
        $scope.vorMehrAls30Min = function () {
            QuakeReport.setId($stateParams.bebenId);
            $scope.bebenmodal.hide();
            $state.go('app.bebenEintrag');
        };
        //----- MODAL ENDE -----
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenEintragCtrl
     * @description
     * Das ist der Controller für die beben_eintrag.html View (Angabe der Standortinformationen -> PLZ, Strasse..)
     */
    .controller('BebenEintragCtrl', function ($scope, $ionicModal, JsonData, $stateParams, $state, QuakeReport,$ionicLoading) {
        $ionicLoading.hide();
        //Input objekt -> Daten von der View werden hier gespeichert
        $scope.input = {
            zipCode: null,
            place: null,
            date: new Date(),
            chosenTime: "",
            rawTime: new Date()
        };
        //Bestimmen ob Nullen benoetigt werden
        if ($scope.input.rawTime.getUTCMinutes() < 10) {
            $scope.input.chosenTime = $scope.input.rawTime.getHours() + ':0' + $scope.input.rawTime.getMinutes();
        } else {
            $scope.input.chosenTime = $scope.input.rawTime.getHours() + ':' + $scope.input.rawTime.getMinutes();
        }
        //----- Zeit waehlen -> Popup -----
        $scope.timePickerObject = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
            step: 5,  //Optional
            format: 24,  //Optional
            titleLabel: 'Zeit wählen',  //Optional
            setLabel: ' ',  //Optional
            closeLabel: ' ',  //Optional
            setButtonType: 'button-assertive icon ion-checkmark',  //Optional
            closeButtonType: 'button-assertive icon ion-close',  //Optional
            callback: function (val) {    //Mandatory
                timePickerCallback(val);
            }
        };
        function timePickerCallback(val) {
            if (typeof (val) === 'undefined') {
            } else {
                var selectedTime = new Date(val * 1000);
                console.log("timepickercallback: " + selectedTime.toJSON());
                $scope.input.rawTime = selectedTime;
                if (selectedTime.getUTCMinutes() < 10) {
                    $scope.input.chosenTime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
                } else {
                    $scope.input.chosenTime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
                }

            }
        }

        //Zeit waehlen ENDE

        //----- Monat Popup anzeigen -----
        var dateForFrom = new Date();
        var weekDaysList = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
        var monthList = ["Jän", "Feb", "März", "April", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"];
        $scope.datepickerObject = {
            titleLabel: 'Datum setzen',  //Optional
            todayLabel: 'Heute',  //Optional
            closeLabel: ' ',  //Optional
            setLabel: ' ',  //Optional
            setButtonType: 'button-assertive icon ion-checkmark',  //Optional
            todayButtonType: 'button-assertive',  //Optional
            closeButtonType: 'button-assertive icon ion-close',  //Optional
            inputDate: new Date(),  //Optional
            mondayFirst: true,  //Optional
            weekDaysList: weekDaysList, //Optional
            monthList: monthList, //Optional
            templateType: 'popup', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-assertive', //Optional
            modalFooterColor: 'bar-assertive', //Optional
            from: new Date(dateForFrom.getFullYear(), dateForFrom.getMonth() - 1, dateForFrom.getDay()), //Optional
            to: new Date(),  //Optional
            callback: function (val) {  //Mandatory
                datePickerCallback(val);
            },
            dateFormat: 'dd.MM.yyyy', //Optional
            closeOnSelect: false //Optional
        };
        var datePickerCallback = function (val) {
            if (typeof(val) === 'undefined') {
            } else {
                $scope.input.date = val;
            }
        };
        //Zeit wählen ENDE
        //-----  Daten mithilfe von QuakeReport speichern und weiter zur Comics Seite -----
        $scope.goToComics = function () {
            QuakeReport.setPlace($scope.input.place);
            QuakeReport.setZIP($scope.input.zipCode);
            //QuakeReport.setStrasse($scope.input.strasse);
            var datetime = new Date(
                $scope.input.date.getFullYear(),
                $scope.input.date.getMonth(),
                $scope.input.date.getDate(),
                $scope.input.rawTime.getHours() - 1,
                $scope.input.rawTime.getMinutes(),
                $scope.input.rawTime.getSeconds()
            );
            datetime = datetime.toISOString().slice(0, 19) + "Z";
            QuakeReport.setLocLastUpdate(datetime);
            QuakeReport.setDateTime(datetime);
            console.log(datetime);
            $state.go('app.bebenWahrnehmung');
        };
        // Daten uebergabe ENDE
    });
