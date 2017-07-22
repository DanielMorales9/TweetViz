/**
 * Created by daniel on 21/07/17.
 */
app.controller('MainController', ['socket', '$scope', function(socket, $scope) {

    var status = {};

    socket.emit('start', { room: 'map' });
    socket.on('tweet', function(data) {
        $scope.$broadcast('tweet', data);
    });

    $scope.$on('restart', function(event, data) {
        socket.emit('restart', {});
    });

    $scope.$on('stop', function(event, data) {
        socket.emit('stop', {});
    });

    $scope.$on('interactionUP', function(event, data){
       $scope.$broadcast('interaction', data);
    });

    $scope.$on('bbox', function(event, data) {
        status.locations = data.locations;
        socket.emit('bbox', status);
        $scope.$broadcast('bboxDOWN', status);
        console.log(status)
    });

    $scope.$on('search', function(event, data) {
        status.track = data.track;
        socket.emit('search', status);
        console.log(status)
    })
}]);
