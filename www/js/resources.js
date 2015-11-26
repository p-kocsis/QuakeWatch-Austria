angular.module('starter.resources', ['ngResource'])
    .factory('AustrianData', function ($http) {
        var myData = null;
        var worldData = null;
        var promise = $http.get('/api/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404').success(function (data) {
            myData = data;
        });

        var getWorldData =
            $http.get('/api/query?orderby=time&limit=50&format=json&nodata=404').success(function (data) {
                worldData = data;
            });

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

        return {
            promise: promise,
            getAut: function () {
                getWorldData;
                var bebenAutArray = [];
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].properties.flynn_region === "AUSTRIA") {
                        var currentFeature = myData.features[i];
                        var timeFull = currentFeature.properties.time;
                        var dateAndTime = timeFull.split("T");
                        var date = dateAndTime[0];
                        var timeLocal = dateAndTime[1].substring(0, 8);
                        currentFeature.date = date;
                        currentFeature.timeLocal = timeLocal;
                        currentFeature.colorClass=quakeClasses(currentFeature.properties.mag);
                        bebenAutArray.push(currentFeature);
                    }
                }
                return bebenAutArray;
            },
            getQuakefromId: function (id) {
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].id === id) {
                        var currentFeature = myData.features[i];
                        var timeFull = currentFeature.properties.time;
                        var dateAndTime = timeFull.split("T");
                        var date = dateAndTime[0];
                        var timeLocal = dateAndTime[1].substring(0, 8);
                        currentFeature.date = date;
                        currentFeature.timeLocal = timeLocal;
                        currentFeature.colorClass=quakeClasses(currentFeature.properties.mag);
                        return currentFeature;
                    }
                }
            },
            getQuakefromIdWorld: function (id) {
                for (var i = 0; i < worldData.features.length; i++) {
                    if (worldData.features[i].id === id) {
                        var currentFeature = worldData.features[i];
                        var timeFull = currentFeature.properties.time;
                        var dateAndTime = timeFull.split("T");
                        var date = dateAndTime[0];
                        var timeLocal = dateAndTime[1].substring(0, 8);
                        currentFeature.date = date;
                        currentFeature.timeLocal = timeLocal;
                        currentFeature.colorClass=quakeClasses(currentFeature.properties.mag);
                        return currentFeature;
                    }
                }
            },
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    var currentFeature = worldData.features[i];
                    var timeFull = currentFeature.properties.time;
                    var dateAndTime = timeFull.split("T");
                    var date = dateAndTime[0];
                    var timeLocal = dateAndTime[1].substring(0, 8);
                    currentFeature.date = date;
                    currentFeature.timeLocal = timeLocal;
                    currentFeature.colorClass=quakeClasses(currentFeature.properties.mag);
                    bebenAutArray.push(currentFeature);
                }
                return bebenAutArray;
            },

            getEu: function(){
                var euStates = ['Albania','Andorra','Armenia','Austria','Azerbaijan','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark','Estonia','Finland','France','Georgia','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kazakhstan','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Macedonia','Malta','Moldova','Monaco','Montenegro','Netherlands','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Turkey','Ukraine','United Kingdom','Vatican City (Holy See)'];
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    for(var o=0;o<euStates.length;o++){
                        if(euStates[o].toUpperCase() === worldData.features[i].properties.flynn_region){
                            var currentFeature = worldData.features[i];
                            var timeFull = currentFeature.properties.time;
                            var dateAndTime = timeFull.split("T");
                            var date = dateAndTime[0];
                            var timeLocal = dateAndTime[1].substring(0, 8);
                            currentFeature.date = date;
                            currentFeature.timeLocal = timeLocal;
                            currentFeature.colorClass=quakeClasses(currentFeature.properties.mag);
                            bebenAutArray.push(currentFeature);
                            break;
                        }
                    }
                }
                return bebenAutArray;
            }
        };
    });