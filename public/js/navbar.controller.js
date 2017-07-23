app.controller('NavBarController', ['$scope', function ($scope) {

    var targetNavbar = document.getElementById("bigNav");
    var targetLNavbar = document.getElementById("littleNav");

    var offSetWidthMap = document.getElementById("map").clientWidth;
    console.log(offSetWidthMap)
    targetLNavbar.style.width = offSetWidthMap + 'px';
    targetNavbar.style.width = offSetWidthMap + 'px';


    $scope.toogleDrawColor = true;
    $scope.toogleDrawName = "Draw";

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


    $('#timeSlider').slider({
        tooltip: 'always',
        formatter: function (value) {
            return value / 1000 + ' seconds';
        }
    });

    $scope.sliderValue = "3 seconds";

    $('#timeSlider').on('change', function (evt) {
        $scope.$emit('interactionUP', {type: "slider", time: evt.value.newValue})
        $scope.sliderValue = evt.value.newValue / 1000 + " seconds";
    });

    
    /**
     * ---------------------------------------------
     * ------------ EVENT LISTENERS ----------------
     * ---------------------------------------------
     */

    $scope.$on('interaction', function (event, data) {
        if (data.type === 'draw') {
            if (data.active) {
                $scope.toogleDrawColor = false;
            }
            else {
                $scope.toogleDrawColor = true;
            }
        }
    });

    $scope.$on('bboxDOWN', function (event, data) {
        if ($scope.toogleStreamName = 'Restart') {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;
        }
    })

}]);