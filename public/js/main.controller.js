/**
 * Created by daniel on 21/07/17.
 */
app.controller('MainController', ['socket', '$scope', function (socket, $scope) {
    $scope.status = {};
    $scope.statusOk = false;
    $scope.coords = [];
    $scope.coordsOk = false;
    $scope.tags="";
    $scope.tagsOk = false;

    socket.emit('start', {room: 'map'});
    socket.on('tweet', function (data) {
        $scope.$broadcast('tweet', data);
    });

    $scope.$on('restart', function (event, data) {
        socket.emit('restart', {});
    });

    $scope.$on('stop', function (event, data) {
        socket.emit('stop', {});
    });

    $scope.$on('interactionUP', function (event, data) {
        $scope.$broadcast('interaction', data);
    });

    $scope.$on('bbox', function (event, data) {
        $scope.status.locations = data.locations;
        socket.emit('bbox', $scope.status);
        $scope.statusOk = true;
        var split = $scope.status.locations.split(',');
        var coords = [];
        for (i = 0; i < split.length; i++) {
            coords.push(Math.round(split[i] * 100) / 100);
        }
        $scope.coordsOk = true;
        $scope.coords = [[coords[0], coords[1]], [coords[2], coords[3]]];
        $scope.$broadcast('bboxDOWN', $scope.status);

    });

    $scope.$on('search', function (event, data) {
        $scope.status.track = data.track;
        socket.emit('search', $scope.status);
        $scope.statusOk = true;

        $scope.tagsOk = true;
        $scope.tags = $scope.status.track.replace(',', ', ');
        $scope.$broadcast('searchDOWN', {})
    });

    $scope.$on('reset', function (event, data) {
        $scope.status = {};
        $scope.statusOk = false;

        setTimeout(function () {
            $scope.coordsOk = false;
            $scope.coords = undefined;
            $scope.tagsOk = false;
            $scope.tags = undefined;
        }, 1500);
        socket.emit('reset', {});
        socket.emit('start', {room: 'map'});
        $scope.$broadcast('resetDOWN', {})
    });

    $scope.$on('heatmapUP', function (event, data) {
        $scope.$broadcast('heatmap', data)
    });

}]);
