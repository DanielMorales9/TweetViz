/**
 * Created by daniel on 21/07/17.
 */
app.controller('MainController', ['socket', '$scope', function(socket, $scope) {

    socket.emit('start', { room: 'map' });
    socket.on('tweet', function(data) {
        $scope.$broadcast('tweet', data);
    });

    $scope.$on('start', function(event, data) {
        socket.emit('start', { room: 'map' });
    });

    $scope.$on('stop', function(event, data) {
        socket.emit('stop', {});
    });

    $scope.$on('ON', function(event, data){
       $scope.$broadcast('drawY', data);
    });

    $scope.$on('OFF', function(event, data){
        $scope.$broadcast('drawN', data);
    });

}]);
