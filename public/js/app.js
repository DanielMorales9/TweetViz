/**
 * Created by daniel on 20/07/17.
 */
var app = angular.module('tweetviz', ['ngAnimate' , 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/map", {
            templateUrl : "htm/map.htm"
        })
        .when("/chart", {
            templateUrl : "htm/chart.htm"
        })
        .otherwise({
            redirectTo : "map"
        });
});
