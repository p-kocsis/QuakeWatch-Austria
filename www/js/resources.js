/**
 * @ngdoc overview
 * @name resources
 * @description
 * # resources
 *  Hier wird jegliche Kommunikation, welche über das "WWW" ausgeführt wird, implementiert.
 * # Wie implementiere ich meine eigene REST/... Schnittstelle?
 *  * Eine neue Factory zum quakewatch.resources Module hinzufügen <br>
 *      <pre>
 *      .factory('IhrFactoryName', function ($http) {
 *          //Eigener Code
 *          return {
 *              AutPromise: // Österreichische Erdbebendaten Abfragen ($http bevorzugt),
 *              getAut: function () {
 *                   return // Ein array mit den österreichischen Erdbebendaten als quakeData Objekte
 *               },
 *              getQuakefromIdWorld: function (id) {
 *                  return // Ein Erdbeben( quakeData Objekt) aus den allen Erdbebendaten (entsprechend der ID)
 *              },
 *              getWorld: function () {
 *                  return // Ein array mit allen Erdbebendaten als quakeData Objekte
 *              },
 *              getEu: function(){
 *                  return // Ein array mit den europäischen Erdbebendaten als quakeData Objekte
 *              },
 *              getMoreData: function(location){
 *                  return // location = aut,world, eu Neue Erdbebendaten laden und als array von quakeData Objekten übergeben
 *              }
 *         }
 *      }
 *      </pre>
 *  * Änderung der von der App verwendeten Factory <br>
 *      In *JsonData* die neu erstellte Factory in den Parametern inkludieren und restEndpoint zuweisen
 *      <pre>
 *          .factory('JsonData', function (IhrFactoryName) {
 *          var restEndpoint=IhrFactoryName;
 *          // ...
 *          }
 *      </pre>
 *
 */
angular.module('quakewatch.resources', ['ngResource'])
    .constant('ApiEndpointZAMG', {
        //http://localhost:8100/apiZAMG
        //http://localhost:8100/apiZAMG
        url: 'http://localhost:8100/apiZAMG'
    })
    .constant('ApiEndpointSeismic', {
        url: 'http://localhost:8100/api'
    })
    /**
     * @ngdoc service
     * @name resources.service:JsonData
     * @description
     * # REST Interface
     * Diese Factory wird in der App verwendet um Erdbebendaten zu laden.
     * Es ist ein "Interface" welches den einfachen austausch der Endpunkte ermöglicht
     * Für nähere Informationen zur implementierung einer eigenen Factory bei der Dokumentation für {@link resources resources} nachschlagen
     */
    .factory('JsonData', function (DataGeoWebZAMG,DataSeismicPortal) {
        var restEndpoint=DataGeoWebZAMG;
        var isOnline=null;
        return {
            /**
             * @ngdoc method
             * @name resources.service#setOnline
             * @methodOf resources.service:JsonData
             *
             * @description
             * Diese Funktion wird in der **app.js** aufgerufen um den Online-Status der App zu setzten.
             * @example
             * JsonData.setOnline(online),
             * @param {boolean} online status der App, hängt von der AutPromise ab
             */
            setOnline: function (online){
                isOnline= online;
            },
            /**
             * @ngdoc method
             * @name resources.service#isOnline
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Den Online-Status der App überprüfen
             * @example
             * JsonData.isOnline()
             * @returns {boolean} Liefert den Online-Status der App
             */
            isOnline: function () {
                return isOnline;
            },
            AutPromise: restEndpoint.AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
            getAut: function () {
                return restEndpoint.getAut();
            },
            //Ein Erdbeben nach ID Abfragen (Welt)
            getQuakefromIdWorld: function (id) {
                return restEndpoint.getQuakefromIdWorld(id);
            },
            //Alle Erdbebendaten abfragen
            //return: Erdbeben Objekte , daten formatiert
            getWorld: function () {
                return restEndpoint.getWorld();
            },
            //Abfrage der Erdbeben in der EU
            //return : Erdbeben Objekte , daten formatiert und nach EU gefieltert(Kontinent)
            getEu: function(){
                return restEndpoint.getEu();
            },
            getMoreData: function(location){
              return restEndpoint.getMoreData(location);
            }
        };
    })
    /**
     * @ngdoc service
     * @name resources.service:DataGeoWebZAMG
     * @description
     * # rest
     * Ein Service um Erdbebendaten von der REST Schnittstelle der [ZAMG] abzufragen
     * [ZAMG]: http://localhost:8100/apiZAMG/query
     */
    .factory('DataGeoWebZAMG', function ($http,$ionicLoading,ApiEndpointZAMG,$templateCache) {
        var atData = null;
        var atDataWithObjects = null;
        var atLastDate=null;
        var worldData = null;
        var worldDataWithObjects = null;
        var worldLastDate = null;
        var euData = null;
        var euDataWithObjects = null;
        var euLastDate = null;

        var AutPromise = $http({method: "GET", url: ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10', cache: $templateCache}).
        then(function(response) {
            atData = response.data;
            return true;
        }, function(response) {
            return false;
        });
        //Abfrage der aller Erdbeben
        var getWorldData = function() {
            $http.get(ApiEndpointZAMG.url+'/query?orderby=time;location=welt;limit=10').success(function (data) {
                worldData = data;
            });
        };
        var getEuData= function() {
            $http.get(ApiEndpointZAMG.url+'/query?orderby=time;location=europa;limit=10').success(function (data) {
                euData = data;
            });
        };
        /**
         * @ngdoc method
         * @name resources.service#quakeClasses
         * @methodOf resources.service:DataGeoWebZAMG
         *
         * @description
         * Funktion um die Farbe der Erdbeben in der home.html zu bestimmen
         * Sie wird in **convertFeatureToQuakeObject** verwendet.
         * @example
         * quakeClasses(feature.properties.mag),
         * @param {int} mag magnitude vom Erdbeben(Feature)
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var quakeClasses= function (mag) {
            if(mag < 5){
                return "item-balanced";
            }
            if(mag >= 5 && mag < 6){
                return "item-energized";
            }
            if(mag >= 6){
                return "item-assertive";
            }
        };
        /**
         * @ngdoc method
         * @name resources.service#convertFeatureToQuakeObject
         * @methodOf resources.service:DataGeoWebZAMG
         *
         * @description
         * Funktion um JsonDaten in das vorgegebene Objekt umzuwandeln.
         * @example
         * convertFeatureToQuakeObject(atData.features[i]);
         * @param {Object} feature feature = ein Erdbeben
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var convertFeatureToQuakeObject = function(feature){
            var timeFull = feature.properties.time;
            var dateAndTime = timeFull.split("T");
            var distanceFromPhoneToQuake="";
            return new quakeData(
                feature.id,
                feature.properties.mag,
                feature.properties.time,
                feature.properties.lon,
                feature.properties.lat,
                feature.properties.maptitle.substring(13),
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                feature.properties.ldate,
                feature.properties.ltime,
                feature.properties.tz
            );
        };


        return {
            /**
             * @ngdoc property
             * @name resources.service#AutPromise
             * @description
             * Dieses "Versprechen" wird in der **app.js** aufgerufen, nur wenn dieses Verpsrechen erfüllt ist wird die App gestartet
             * <pre>
             * var AutPromise = $http({method: "GET", url: ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10', cache: $templateCache}).
             * then(function(response) {
             *     atData = response.data;
             *     return true;
             * }, function(response) {
             *     return false;
             * });
             * </pre>
             * @propertyOf resources.service:DataGeoWebZAMG
             * @returns {boolean} true wenn die Daten erfolgreich abgefragt wurden
             */
            AutPromise: AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
            /**
             * @ngdoc method
             * @name resources.service#getAut
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Österrechische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getAut();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getAut: function () {
                //alle Erdbebendaten im hintergrund Abfragen
                getEuData();
                getWorldData();
                var bebenAutArray = [];
                for (var i = 0; i < atData.features.length; i++) {
                        bebenAutArray.push(convertFeatureToQuakeObject(atData.features[i]));
                    if(i === atData.features.length-1){
                        atLastDate = atData.features[i].properties.time;
                    }
                }
                atDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getEu
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Europäische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getEu();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getEu: function(){
                var bebenAutArray = [];
                for (var i = 0; i < euData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(euData.features[i]));
                    if(i == euData.features.length-1){
                        euLastDate = euData.features[i].properties.time;
                    }
                }
                euDataWithObjects=bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getWorld
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Alle Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getWorld();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                    if(i == worldData.features.length-1){
                        worldLastDate = worldData.features[i].properties.time;
                    }
                }
                worldDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getMoreData
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Erdbebendaten entsprechend der location laden, fortlaufend zu bereits vorhandenen Erdbebendaten
             * @param {String} location aut,eu oder world
             * @example
             * JsonData.getMoreData(location);
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getMoreData: function(location){
                switch (location){
                    case "aut":
                        return $http.get(ApiEndpointZAMG.url+'/query?endtime='+atLastDate+';orderby=time;limit=10;location=austria').then(function (response) {
                            var bebenAutArray = [];
                            data= response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if(i == data.features.length-1){
                                    atLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0,1);
                            atDataWithObjects = atDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "world":
                        return $http.get(ApiEndpointZAMG.url+'/query?endtime='+worldLastDate+';orderby=time;limit=10;location=welt').then(function (response) {
                            var bebenAutArray = [];
                            data= response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if(i == data.features.length-1){
                                    worldLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0,1);
                            worldDataWithObjects = worldDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "eu":
                        return $http.get(ApiEndpointZAMG.url+'/query?endtime='+euLastDate+';orderby=time;limit=10;location=europa').then(function (response) {
                            var bebenAutArray = [];
                            data= response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if(i == data.features.length-1){
                                    euLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0,1);
                            euDataWithObjects = euDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                }
            },
            /**
             * @ngdoc method
             * @name resources.service#getQuakefromIdWorld
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Ein Erdbeben aus den bereits geholten Erdbebendaten bekommen
             * Wird verwendet um die Detailansicht der Erdbeben darzustellen
             * @param {int} id Erdbebenid
             * @example
             * JsonData.getQuakefromIdWorld(id);
             * @returns {quakeData} Ein Erdbebenobjekt, mit dem angeforderten Erdbeben
             */
            getQuakefromIdWorld: function (id) {
                if(atDataWithObjects != null){
                    for (var i = 0; i < atDataWithObjects.length; i++) {
                        if (atDataWithObjects[i].id == id) {
                            return atDataWithObjects[i];
                        }
                    }
                }
                if(worldDataWithObjects != null) {
                    for (var i = 0; i < worldDataWithObjects.length; i++) {
                        if (worldDataWithObjects[i].id == id) {
                            return worldDataWithObjects[i];
                        }
                    }
                }
                if(euDataWithObjects != null) {
                    for (var i = 0; i < euDataWithObjects.length; i++) {
                        if (euDataWithObjects[i].id == id) {
                            return euDataWithObjects[i];
                        }
                    }
                }
            }

        };
    })

    /**
     * @ngdoc service
     * @name resources.service:QuakeReport
     * @description
     * Diese Factory wird zum sammeln der neuen, vom User eingegebenen, Erdbebendaten.
     * In dieser funktion werden die Daten gesendet
     */
    .factory('QuakeReport', function ($http) {
        var quakeDataObj = new quakeReport(
            "",
            null,
            null,
            null,
            null,
            "",
            "",
			"",
            "",
            "",
            "",
            null,
            null
        );

        return {
            /**
             * @ngdoc method
             * @name resources.service#setId
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} id Erdbebenid
             * @example
             * QuakeReport.setId(1123458);
             */
            setId: function (id) {
              quakeDataObj.referenzID=id;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLon
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {float} lon longtitude
             * @example
             * QuakeReport.setLon(-12.23);
             */
            setLon: function (lon) {
                quakeDataObj.locLon=lon;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLat
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {float} lat latitude
             * @example
             * QuakeReport.setId(1123458);
             */
            setLat: function (lat) {
                quakeDataObj.locLat=lat;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLocPrec
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} prec Genauigkeit der GPS-Lokationsdaten
             * @example
             * QuakeReport.setId(10);
             */
            setLocPrec: function (prec) {
                quakeDataObj.locPrecision=prec;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLocLastUpdate
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} time JSON-String UTC-Timestamp
             * @example
             * QuakeReport.setLocLastUpdate("2016-01-11T18:02:04.151Z");
             */
            setLocLastUpdate: function (time) {
                quakeDataObj.locLastUpdate=time;
            },
            /**
             * @ngdoc method
             * @name resources.service#setZIP
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} zipData Postleitzahl
             * @example
             * QuakeReport.setZIP(1200);
             */
            setZIP: function (zipData) {
                quakeDataObj.mlocPLZ=zipData;
            },
            /**
             * @ngdoc method
             * @name resources.service#setPlace
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} place Ortangabe "Wien"
             * @example
             * QuakeReport.setPlace("Wien");
             */
            setPlace: function (place) {
                quakeDataObj.mlocOrtsname=place;
            },
            /**
             * @ngdoc method
             * @name resources.service#setFloor
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} floor Stockwerk
             * @example
             * QuakeReport.setFloor(0);
             */
            setFloor: function (floor) {
                quakeDataObj.stockwerk=floor;
            },
            /**
             * @ngdoc method
             * @name resources.service#setMagClass
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} setMagClass Erdbebenstärke (Comics)
             * @example
             * QuakeReport.setMagClass(1);
             */
            setMagClass: function (mag) {
                quakeDataObj.klassifikation=mag;
            },
            /**
             * @ngdoc method
             * @name resources.service#setDateTime
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} time JSON-String UTC-Timestamp
             * @example
             * QuakeReport.setId("2016-01-11T18:02:04.151Z");
             */
            //Zeit und datum in utc
            setDateTime: function (time) {
                quakeDataObj.verspuert=time;
            },
            /**
             * @ngdoc method
             * @name resources.service#setComment
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} comment Kommentar
             * @example
             * QuakeReport.setComment("Mein Kommentar");
             */
            //Die Bebenintensitaet setzten
            setComment: function (comment) {
                quakeDataObj.kommentar=comment;
            },
            /**
             * @ngdoc method
             * @name resources.service#setContact
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} contact Kontaktdaten
             * @example
             * QuakeReport.setContact("mail@mail.com 066012348");
             */
            setContact: function (contact) {
                quakeDataObj.kontakt=contact;
            },
			/**
             * @ngdoc method
             * @name resources.service#setContact
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} contact Strasse
             * @example
             * QuakeReport.setStrasse("Asdgasse 1");
             */
            setStrasse: function (strasse) {
                quakeDataObj.mlocStrasse=strasse;
            },
            /**
             * @ngdoc method
             * @name resources.service#sendData
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * Senden aller gesammelten Erdbebendaten
             * @example
             * QuakeReport.sendData();
             */
            sendData: function (){
                console.log("id "+quakeDataObj.referenzID);
                console.log("loclon "+quakeDataObj.locLon);
                console.log("loclat "+quakeDataObj.locLat);
                console.log("locprec "+quakeDataObj.locPrecision);
                console.log("locallastupdate "+quakeDataObj.locLastUpdate);
                console.log("plz "+quakeDataObj.mlocPLZ);
                console.log("ort "+quakeDataObj.mlocOrtsname);
                console.log("stock"+quakeDataObj.stockwerk);
                console.log("klass "+quakeDataObj.klassifikation);
                console.log("versp "+quakeDataObj.verspuert);
                console.log("kommentar "+quakeDataObj.kommentar);
                console.log("kontakt "+quakeDataObj.kontakt);
            }
        };
    })


    .factory('DataSeismicPortal', function ($http,$templateCache,ApiEndpointSeismic) {
        //Ergebnis der Abfrage von ca.(mit lat und long eingeschraenkt) Oesterreich
        var myData = null;
        //Ergebnis Abfrage aller Erdbeben
        var worldData = null;


        var AutPromise = $http({method: "GET", url: ApiEndpointSeismic.url+'/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404', cache: $templateCache}).
        then(function(response) {
            myData = response.data;
            return true;
        }, function(response) {
            return false;
        });

        //Abfrage der aller Erdbeben
        var getWorldData =
            $http.get(ApiEndpointSeismic.url+'/query?orderby=time&limit=50&format=json&nodata=404').success(function (data) {
                worldData = data;
            });

        //Hier wird die Farbe nach dem schweregrad des Erdbebens vergeben
        var quakeClasses= function (mag) {
            if(mag < 5){
                return "item-balanced";
            }
            if(mag >= 5 && mag < 6){
                return "item-energized";
            }
            if(mag >= 6){
                return "item-assertive";
            }
        };

        var convertFeatureToQuakeObject = function(feature){
            var timeFull = feature.properties.time;
            var dateAndTime = timeFull.split("T");
            var date = dateAndTime[0];
            var timeLocal = dateAndTime[1].substring(0, 8)+" UTC";
            var distanceFromPhoneToQuake="";
            return new quakeData(
                feature.id,
                feature.properties.mag,
                feature.properties.time,
                feature.properties.lon,
                feature.properties.lat,
                feature.properties.flynn_region,
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                "19.1.2016",
                "10:10",
                "MEZ"
            );

        };

        return {
            AutPromise: AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
            getAut: function () {
                //alle Erdbebendaten im hintergrund Abfragen
                getWorldData;
                var bebenAutArray = [];
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].properties.flynn_region === "AUSTRIA") {
                        bebenAutArray.push(convertFeatureToQuakeObject(myData.features[i]));
                    }
                }
                return bebenAutArray;
            },
            //Ein Erdbeben nach ID Abfragen (Welt)
            getQuakefromIdWorld: function (id) {
                for (var i = 0; i < worldData.features.length; i++) {
                    if (worldData.features[i].id === id) {
                        return convertFeatureToQuakeObject(worldData.features[i]);
                    }
                }
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].id === id) {
                        return convertFeatureToQuakeObject(myData.features[i]);
                    }
                }
            },
            //Alle Erdbebendaten abfragen
            //return: Erdbeben Objekte , daten formatiert
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                }
                return bebenAutArray;
            },
            //Abfrage der Erdbeben in der EU
            //return : Erdbeben Objekte , daten formatiert und nach EU gefieltert(Kontinent)
            getEu: function(){
                var euStates = ['Albania','Andorra','Armenia','Austria','Azerbaijan','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark','Estonia','Finland','France','Georgia','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kazakhstan','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Macedonia','Malta','Moldova','Monaco','Montenegro','Netherlands','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Turkey','Ukraine','United Kingdom','Vatican City (Holy See)'];
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    for(var o=0;o<euStates.length;o++){
                        if(worldData.features[i].properties.flynn_region.indexOf(euStates[o].toUpperCase()) != -1){
                            bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                            break;
                        }
                    }
                }
                return bebenAutArray;
            }
        };
    });
