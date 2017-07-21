app.controller('NavBarController', ['$scope', function ($scope) {

    $scope.toogleStreamName = 'Stop';
    $scope.toogleClass = 'danger';

    $scope.toogleStream = function () {
        if ($scope.toogleStreamName === 'Stop') {
            $scope.toogleStreamName = 'Start';
            $scope.toogleClass = 'success';
        }
        else {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleClass = 'danger';
        }
    }
}]);