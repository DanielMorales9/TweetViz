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

            $scope.$emit('start', {})

        }
    };

    $scope.toogleDrawName = 'OFF';
    $scope.toogleDrawColor = false;
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
    }

}]);