app.controller('NavBarController', ['$scope', function ($scope) {

    $scope.toogleStreamName = 'Stop';
    $scope.toogleStreamColor = false;

    $scope.toogleStream = function () {
        if ($scope.toogleStreamName === 'Stop') {
            $scope.toogleStreamName = 'Start';
            $scope.toogleStreamColor = true;

            $scope.$emit('stop', {})

        }
        else {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;

            $scope.$emit('start', {})

        }
    }

    $scope.toogleSearchName = 'OFF';
    $scope.toogleSearchColor = false;
    $scope.toogleSearch = function(){
        if($scope.toogleSearchName === 'OFF') {
            $scope.toogleSearchName = 'ON';
            $scope.toogleSearchColor = true;

            $scope.$emit('OFF', {type: "draw", active: false})
        }
        else{
            $scope.toogleSearchName = 'OFF';
            $scope.toogleSearchColor = false;
            $scope.$emit('ON', {type: "draw", active: true})
        }
    }
}]);