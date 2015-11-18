angular.module('starter.resources', ['ngResource'])
    .factory('AustrianData', function ($http) {
        var myData = null;

        var promise = $http.get('/api/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404').success(function (data) {
            myData = data;
        });
        return {
            promise: promise,
            getAut: function () {
                var bebenAutArray = [];
                for (var i = 0; i < myData.features.length; i++) {
                    //console.log(restData.features[i].properties.flynn_region);
                    if (myData.features[i].properties.flynn_region === "AUSTRIA") {
                        var currentFeature= myData.features[i];
                        var timeFull = currentFeature.properties.time;
                        var dateAndTime = timeFull.split("T");
                        var date = dateAndTime[0];
                        var timeLocal = dateAndTime[1].substring(0,8);
                        currentFeature.date=date;
                        currentFeature.timeLocal=timeLocal;
                        bebenAutArray.push(currentFeature);
                        console.log(myData.features[i].properties.flynn_region);
                    }
                }
                return bebenAutArray;
            },
            getQuakefromId: function(id){
                for (var i = 0; i < myData.features.length; i++) {
                    //console.log(restData.features[i].properties.flynn_region);
                    if (myData.features[i].id === id) {
                        return myData.features[i];
                    }
                }
            }
        };
    });