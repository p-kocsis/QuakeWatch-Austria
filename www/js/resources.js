angular.module('starter.resources', [])
    .service('AustrianData', function ($http) {
        var myData = null;

        var promise = $http.get('/api/query?orderby=time&limit=50&start=1900-10-01&end=2015-10-05&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404').success(function (data) {
            myData = data;
        });
        return {
            promise: promise,
            getAut: function () {
                var bebenAutArray = [];
                for (var i = 0; i < myData.features.length; i++) {
                    //console.log(restData.features[i].properties.flynn_region);
                    if (myData.features[i].properties.flynn_region === "AUSTRIA") {
                        bebenAutArray.push(myData.features[i]);
                        console.log(myData.features[i].properties.flynn_region);
                    }
                }
                return bebenAutArray;
            }
        };
    });