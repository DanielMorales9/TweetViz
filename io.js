var nconf = require('nconf');
var env = nconf.file({ file: 'socket.json' }).env();
var namespaces = env.get('namespaces');
var twitter = require('./twitter');

var bbox;

var tweetMgr = {};

var locations = {
    sf: '-122.75,36.8,-121.75,37.8',
    nyc: '-74,40,-73,41',
    all: '-180,-90,180,90'
};

var socket_rooms = {};


module.exports = function(io) {

    var streamMap = function(stream, room) {

        stream.on('tweet', function (tweet) {
            if (tweet.geo) {
                io.sockets.in(room).emit('tweet', tweet);
                console.log(room, tweet.geo.coordinates)
            }
        });

    };

    function leaveRoom(socket) {
        var r = socket_rooms[socket.id];
        if (r) {
            socket.leave(r);
            //se non c'è nessuno nella room spegni lo stream della room
            if (!io.sockets.adapter.rooms[r]) {
                tweetMgr[r].stop();
                console.log("tweet stream deleted", r);
                delete tweetMgr[r];
            }
        }
        delete socket_rooms[socket.id];
    }

    function stopRoom(socket) {
        var r = socket_rooms[socket.id];
        if (r) {
            socket.leave(r);
            //se non c'è nessuno nella room spegni lo stream della room
            if (!io.sockets.adapter.rooms[r]) {
                tweetMgr[r].stop();

                console.log("tweet stream stopped", r);
            }
        }
    }

    io.on('connection', function (socket) {
        socket.on('start', function (event) {

            socket.join(event.room);

            socket_rooms[socket.id] = event.room;

            if (!tweetMgr[event.room]) {
                tweetMgr[event.room] = twitter.stream('statuses/filter',  { locations: locations.all });
                streamMap(tweetMgr[event.room], event.room)
            }

        });

        socket.on('disconnect', function(event) {
           leaveRoom(socket)
        });

        socket.on('restart', function (event) {
            var r = socket_rooms[socket.id];
            if (r) {
                socket.join(r);

                tweetMgr[r].start();
                console.log("tweet stream stopped", r);
            }
            else {
                console.log('Restart', 'something got wrong')
            }
        });

        socket.on('stop', function(event) {
            stopRoom(socket);
        });

        socket.on('bbox', function (event) {
            leaveRoom(socket);
            var room = "bbox";
            var location = event.coords.join(",");

            room = room.concat("_"+location);
            socket.join(room);
            socket_rooms[socket.id] = room;

            tweetMgr[room] = twitter.stream('statuses/filter',  { locations: location });
            streamMap(tweetMgr[room], room)
        });

    });
};