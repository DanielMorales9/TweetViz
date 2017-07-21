/**
 * Created by daniel on 21/07/17.
 */
app.controller('MainController', ['socket', '$scope', function(socket, $scope) {

    socket.emit('start', { room: 'map' });
    socket.on('tweet', function(data) {
        $scope.$broadcast('tweet', data);
    });
}]);
