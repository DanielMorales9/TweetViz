/**
 * Created by daniel on 20/07/17.
 */
var app = angular.module('tweetviz', ['ngAnimate' , 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/map", {
            controller: "MapController",
            templateUrl : "htm/map.htm"
        })
        .when("/chart", {
            controller: "ChartController",
            templateUrl : "htm/chart.htm"
        })
        .otherwise({
            redirectTo : "map"
        });
});
