angular.module('starter.resources', ['ngResource'])
    .factory('JsonData', function ($http) {
        //Ergebnis der Abfrage von ca.(mit lat und long eingeschraenkt) Oesterreich
        var myData = null;
        //Ergebnis Abfrage aller Erdbeben
        var worldData = null;

        //In der App.js wird gewartet bis die Abfrage vollendet wurde (http.get.success)
        //Danach wird die App geladen
        var AutPromise = $http.get('http://www.seismicportal.eu/fdsnws/event/1/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404').success(function (data) {
            myData = data;
        });

        //Abfrage der aller Erdbeben
        var getWorldData =
            $http.get('http://www.seismicportal.eu/fdsnws/event/1/query?orderby=time&limit=50&format=json&nodata=404').success(function (data) {
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
            distanceFromPhoneToQuake="";
            return new quakeData(
                feature.id,
                feature.properties.mag,
                feature.properties.time,
                feature.properties.lon,
                feature.properties.lat,
                feature.properties.flynn_region,
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag)
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
            //Ein Erdbeben nach ID Abfragen (Oesterreich)
            getQuakefromId: function (id) {
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].id === id) {
                        return convertFeatureToQuakeObject(myData.features[i]);
                    }
                }
            },
            //Ein Erdbeben nach ID Abfragen (Welt)
            getQuakefromIdWorld: function (id) {
                for (var i = 0; i < worldData.features.length; i++) {
                    if (worldData.features[i].id === id) {
                        return convertFeatureToQuakeObject(worldData.features[i]);
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
    //Factory zum Senden der erstellten Erdbeben
    .factory('QuakeReport', function ($http) {


        return {
            //Setzen der location mittels GPS
            setGeoLocation: function (geoData) {

            },
            //Setzten der location mittels Postleitzahl
            setZIPLocation: function (zipData) {
            },
            //Die Bebenintensitaet setzten
            setQuakeIntensity: function (intensity) {

            },
            //Die Antworten der Zusatzfragen setzten
            setExtraQuestionAnswers: function (extraQuestions) {

            }
        };
    });
