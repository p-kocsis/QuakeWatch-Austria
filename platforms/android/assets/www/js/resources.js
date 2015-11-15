angular.module('starter.resources', ['ngResource'])
    .factory('Post', function ($resource) {
        var Post = $resource('http://www.seismicportal.eu/fdsnws/event/1/query?orderby=time&limit=100&start=1900-10-01&end=2015-10-05&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404', {}, {
            query: {
                method: 'GET',
                isArray: true,
                headers: {'Access-Control-Allow-Origin': '*'}
            }
        });
        return Post;

    }).factory('Test', function ($resource) {
    var Test = $resource('http://rest-service.guides.spring.io/greeting', {}, {
        query: {
            method: 'GET',
            isArray: true
            //headers: {'Access-Control-Allow-Origin': '*'}
        }
    });
    return Test;
});