angular.module('starter.resources', ['ngResource'])
    .constant('ApiEndpointZAMG', {
        url: 'http://localhost:8100/apiZAMG'
    })

    /*
        To change the API you must include your API(AngularJS Factory) in the function parameters
        Initialize restEndpoint with your API(AngularJS Factory)
     */
    .factory('JsonData', function ($http,$ionicLoading,DataSeismicPortal,DataGeoWebZAMG) {
        var restEndpoint=DataGeoWebZAMG;
        var isOnline=null;
        return {
            setOnline: function (online){
                isOnline= online;
            },
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


    /*
        API Endpoints
        All Endpoints need to include
        1 Attribute and
        AutPromise: your way(API link..) of getting JSON Data($http.get.success),
        5 functions
        getAut: function () {
            return Austrian Earthquake Data as quakes Object
        },
        getQuakefromId: function (id) {
            return One Quake from the austrian earthquakes (with the help of the id)
        },
        getQuakefromIdWorld: function (id) {
            return one Quake from the collection of all Earthquakes
        },
        getWorld: function () {
            return all Earthquakes with one Quake Object Array
        },
        getEu: function(){
            return all European Earthquakes with one Quake Object Array
        }
     */



    .factory('DataSeismicPortal', function ($http,$ionicLoading) {
        //Ergebnis der Abfrage von ca.(mit lat und long eingeschraenkt) Oesterreich
        var myData = null;
        //Ergebnis Abfrage aller Erdbeben
        var worldData = null;

        //In der App.js wird gewartet bis die Abfrage vollendet wurde (http.get.success)
        //Danach wird die App geladen
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br/>Lade Erdbebendaten'
        });
        var AutPromise = $http.get('/api/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404').success(function (data) {
            $ionicLoading.hide();
            myData = data;
        });

        //Abfrage der aller Erdbeben
        var getWorldData =
            $http.get('/api/query?orderby=time&limit=50&format=json&nodata=404').success(function (data) {
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
                "ldate",
                "ltime",
                "ltz"
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
    })

    .factory('DataGeoWebZAMG', function ($http,$ionicLoading,ApiEndpointZAMG,$templateCache) {
        //http://localhost:8100/apiZAMG/query?orderby=time;location=austria;limit=10
        var atData = null;
        var atDataWithObjects = null;
        var atLastDate=null;
        var worldData = null;
        var worldDataWithObjects = null;
        var worldLastDate = null;
        var euData = null;
        var euDataWithObjects = null;
        var euLastDate = null;
        var somedata=null;
        var isOnline=null;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br/>Lade Erdbebendaten'
        });

        var AutPromise = $http({method: "GET", url: ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10', cache: $templateCache}).
        then(function(response) {
            $ionicLoading.hide();
            atData = response.data;
            return true;
        }, function(response) {
            $ionicLoading.hide();
            return false;
        });

        /*
        var AutPromise = $http.get(ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10').success(function (data) {
            $ionicLoading.hide();
            atData = data;
        });
        */
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
                feature.properties.maptitle.substring(13),
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                feature.properties.ldate,
                feature.properties.ltime,
                feature.properties.tz
            );
        };


        return {
            AutPromise: AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
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
            //Abfrage der Erdbeben in der EU
            //return : Erdbeben Objekte , daten formatiert und nach EU gefieltert(Kontinent)
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
            //Alle Erdbebendaten abfragen
            //return: Erdbeben Objekte , daten formatiert
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

            //Ein Erdbeben nach ID Abfragen (Welt)
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

    //Factory zum Senden der erstellten Erdbeben
    .factory('QuakeReport', function ($http) {
        var quakeDataObj = new quakeReport(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        );

        return {
            setId: function (id) {
              quakeDataObj.referenzID=id;
                console.log(quakeDataObj.referenzID);
            },
            setLon: function (lon) {
                quakeDataObj.locLon=lon;
            },
            setLat: function (lat) {
                quakeDataObj.locLat=lat;
            },
            setLocPrec: function (prec) {
                quakeDataObj.locPrecision=prec;
            },
            setLocLastUpdate: function (time) {
                quakeDataObj.locLastUpdate=time;
            },
            //Setzten der location mittels Postleitzahl
            setZIP: function (zipData) {
                quakeDataObj.locLastUpdate=zipData;
            },
            setPlace: function (place) {
                quakeDataObj.mlocOrtsname=place;
            },
            setFloor: function (floor) {
                quakeDataObj.stockwerk=floor;
            },
            setMagClass: function (mag) {
                quakeDataObj.klassifikation=mag;
            },
            setTime: function (time) {
                quakeDataObj.verspuert=time;
            },
            //Die Bebenintensitaet setzten
            setComment: function (comment) {
                quakeDataObj.kommentar=comment;
            },
            setContact: function (contact) {
                quakeDataObj.kontakt=contact;
            }
        };
    });
