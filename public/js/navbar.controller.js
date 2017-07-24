app.controller('NavBarController', ['$scope', '$location', function ($scope, $location) {

    $scope.templateURL = "htm/map-nav.html";

    $scope.toogleDrawColor = true;
    $scope.toogleDrawName = "Draw";

    var width;

    $scope.toogleDraw = function () {
        if (!$scope.toogleDrawColor) {

            $scope.toogleDrawColor = true;
            $scope.$emit('interactionUP', {type: "draw", active: false})
        }
        else {
            $scope.toogleDrawColor = false;

            $scope.$emit('interactionUP', {type: "draw", active: true})
        }
    };

    $scope.toogleHeatMapColor = true;
    $scope.toogleHeatMapName = "HeatMap";

    $scope.toogleHeatMap = function () {
        if(!$scope.toogleHeatMapColor) {

            $scope.toogleHeatMapColor = true;
            $scope.$emit('heatmapUP', {active: false})
        }
        else {
            $scope.toogleHeatMapColor = false;

            $scope.$emit('heatmapUP', {active: true})
        }
    };

    $scope.init = function() {

        var targetNavbar = document.getElementById("bigNav");
        var targetLNavbar = document.getElementById("littleNav");
        var offSetWidthMap = document.getElementById("side").clientWidth;
        width = width || (window.innerWidth-offSetWidthMap);

        targetLNavbar.style.width = width + 'px';
        targetNavbar.style.width = width + 'px';

        if ($location.path() === '/map') {
            document.getElementById('popup').style.display = '';


            $('#timeSlider').slider({
                tooltip: 'always',
                formatter: function (value) {
                    return value / 1000 + ' seconds';
                }
            });

            $scope.sliderValue = "3 seconds";

            $('#timeSlider').on('change', function (evt) {
                $scope.$emit('interactionUP', {type: "slider", time: evt.value.newValue});
                $scope.sliderValue = evt.value.newValue / 1000 + " seconds";
            });
        }
        else {
            document.getElementById('popup').style.display = 'none';
        }

        $("#bigNav").hide();

        $("#littleNav").hover(function () {
            $("#bigNav").show();
        }, function () {

        });
        $("#bigNav").hover(function(){

        }, function () {
            $("#bigNav").hide();
        });

    };

    /**
     * ---------------------------------------------
     * ------------ EVENT LISTENERS ----------------
     * ---------------------------------------------
     */

    $scope.$on('$locationChangeSuccess', function(event, data) {

        var path = $location.path();
        path = path.replace('/', '');
        path = 'htm/'+path+'-nav.html';
        $scope.templateURL = path;
    });

    $scope.$on('bboxDOWN', function (event, data) {
        if ($scope.toogleStreamName = 'Restart') {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;
        }

        $scope.toogleDrawColor = !$scope.toogleDrawColor;
    })

}]);