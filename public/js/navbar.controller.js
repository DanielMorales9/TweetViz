app.controller('NavBarController', ['$scope', function ($scope) {

    $scope.toogleStreamName = 'Stop';
    $scope.toogle = false;

    $scope.toogleStream = function () {
        if ($scope.toogleStreamName === 'Stop') {
            $scope.toogleStreamName = 'Start';
            $scope.toogle = true;

            $scope.$emit('stop', {})

        }
        else {
            $scope.toogleStreamName = 'Stop';
            $scope.toogle = false;

            $scope.$emit('start', {})

        }
    }
}]);