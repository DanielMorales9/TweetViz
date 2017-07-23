app.controller('NavBarController', ['$scope', function ($scope) {

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

    $('#timeSlider').on('change', function (evt) {
        $scope.$emit('interactionUP', {type: "slider", time: evt.value.newValue})
    });

    /**
     * ---------------------------------------------
     * ------------ EVENT LISTENERS ----------------
     * ---------------------------------------------
     */

    $scope.$on('bboxDOWN', function (event, data) {
        if ($scope.toogleStreamName = 'Restart') {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;
        }

        $scope.toogleDrawColor = !$scope.toogleDrawColor;
    })

}]);