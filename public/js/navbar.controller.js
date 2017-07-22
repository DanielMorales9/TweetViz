app.controller('NavBarController', ['$scope', function ($scope) {

    $scope.toogleStreamName = 'Stop';
    $scope.toogleStreamColor = false;

    $scope.toogleStream = function () {
        if ($scope.toogleStreamName === 'Stop') {
            $scope.toogleStreamName = 'Restart';
            $scope.toogleStreamColor = true;

            $scope.$emit('stop', {})

        }
        else {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;

            $scope.$emit('restart', {})

        }
    };

    $scope.toogleDrawName = 'ON';
    $scope.toogleDrawColor = true;
    $scope.toogleDraw = function(){
        if($scope.toogleDrawName === 'OFF') {
            $scope.toogleDrawName = 'ON';
            $scope.toogleDrawColor = true;

            $scope.$emit('interactionUP', {type: "draw", active: false})
        }
        else{
            $scope.toogleDrawName = 'OFF';
            $scope.toogleDrawColor = false;
            $scope.$emit('interactionUP', {type: "draw", active: true})
        }
    };

    $scope.$on('interaction', function (event, data) {
        if (data.active) {
            $scope.toogleDrawName = 'OFF';
            $scope.toogleDrawColor = false;
        }
        else {
            $scope.toogleDrawName = 'ON';
            $scope.toogleDrawColor = true;
        }
    });

    $scope.$on('bboxDOWN', function (event, data) {
        if ($scope.toogleStreamName = 'Restart') {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;
        }
    })

}]);