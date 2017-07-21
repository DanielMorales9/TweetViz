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
                console.log(tweet.geo.coordinates)
            }
        });

    };

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
            var r = socket_rooms[socket.id];
            if (r) {
                //se non c'è nessuno nella room spegni lo stream della room
                if (!io.sockets.adapter.rooms[r]) {
                    tweetMgr[r].stop();
                    console.log("tweet stream deleted", r);
                    delete tweetMgr[r];
                }
            }
            delete socket_rooms[socket.id];
        });

        socket.on('bbox', function (event) {
            for (var r in socket.rooms)
                socket.leave(r);

                if (!io.sockets.adapter.rooms[r]) {
                    tweetMgr[r].stop();
                    console.log("tweet stream deleted", r);
                    delete tweetMgr[r];
                }

            var topic = "bbox";
            var location = event.coords.join(",");
            topic = topic.concat(location);
            socket.join(topic);
            tweetMgr[topic] = twitter.stream('statuses/filter',  { locations: location });
            streamMap(tweetMgr[topic], topic)
        });

    });
};