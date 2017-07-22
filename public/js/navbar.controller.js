app.controller('NavBarController', ['$scope', function ($scope) {

    var drawOn = 'Draw On';
    var drawOff = 'Draw Off';
    $scope.toogleDrawName = drawOn;
    $scope.toogleDrawColor = true;

    $scope.toogleDraw = function () {
        if (!$scope.toogleDrawColor) {
            $scope.toogleDrawName = drawOn;
            $scope.toogleDrawColor = true;
            $('#ex1').slider({
                formatter: function (value) {
                    return 'Current value: ' + value;
                }
            });

            $scope.$emit('interactionUP', {type: "draw", active: false})
        }
        else {
            $scope.toogleDrawName = drawOff;
            $scope.toogleDrawColor = false;

            $scope.$emit('interactionUP', {type: "draw", active: true})
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

    $scope.$on('interaction', function (event, data) {
        if (data.type === 'draw') {
            if (data.active) {
                $scope.toogleDrawName = drawOff;
                $scope.toogleDrawColor = false;
            }
            else {
                $scope.toogleDrawName = drawOn;
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