/**
 * Created by daniel on 21/07/17.
 */
app.controller('MainController', ['socket', '$scope', function(socket, $scope) {

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
        socket.emit('bbox', data);
        $scope.$broadcast('bboxDOWN', data);
    });

}]);
