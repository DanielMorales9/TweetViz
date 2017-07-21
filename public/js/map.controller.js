app.controller('MapController', ['socket', '$scope', function(socket, $scope) {
    var attribution = new ol.control.Attribution({
        collapsible: false
    });

    var map = new ol.Map({

        target: 'map',
        controls: ol.control.defaults({ attribution: false }).extend([attribution]),
        view: new ol.View({
            center: [0, 0],
            zoom: 2
        })
    });

    var tile_layer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    map.addLayer(tile_layer);

    var vector_layer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

    var red = new ol.style.Fill({
        color: [180, 0, 0, 0.3]
    });

    var style = new ol.style.Style({
        image: new ol.style.Circle({
            fill: red,
            radius: 5
        }),
        fill: red
    });
    vector_layer.setStyle(style);
    var current_projection = new ol.proj.Projection({code: "EPSG:4326"});
    var new_projection = tile_layer.getSource().getProjection();
    map.addLayer(vector_layer);

    /*
    fit map in bounding box
    var destLoc = [-90, -90];
    var currentLoc = [90, 90];

    var ext = ol.extent.boundingExtent([destLoc,currentLoc]);
    ext = ol.proj.transformExtent(ext, current_projection, new_projection);

    map.getView().fit(ext, map.getSize());
    */


    $scope.$on('tweet', function(event, data) {
        //console.log(data);

        var point_feature = new ol.Feature({ });
        var point_geom = new ol.geom.Point(
            data.coordinates.coordinates
        );

        point_feature.setGeometry(point_geom);
        point_feature.getGeometry().transform(current_projection, new_projection);
        vector_layer.getSource().addFeature(point_feature);
        setTimeout(function() {
            vector_layer.getSource().removeFeature(point_feature)
        }, 3000);
    });

    var trigger = function () {

        var destLoc = [-122.75, 36.8];
        var startLoc = [-121.75, 37.8];

        socket.emit('bbox', {coords: [destLoc, startLoc]});

        var ext = ol.extent.boundingExtent([destLoc, startLoc]);
        ext = ol.proj.transformExtent(ext, current_projection, new_projection);

        map.getView().fit(ext, {duration: 2000});

    };

    //setTimeout(trigger, 3000);


//    var source = new ol.source.Vector({wrapX: false});
//
//    var draw_vector = new ol.layer.Vector({
//        source: source
//    });
//    map.addLayer(draw_vector);
//    var geometryFunction = ol.interaction.Draw.createBox();
//    var draw = new ol.interaction.Draw({
//        source: vector_layer.getSource(),
//        type: /** @type {ol.geom.GeometryType} */  'Box',
//        geometryFunction: geometryFunction
//    });
//    map.addInteraction(draw);
//
//    draw.on('drawend', function(evt) {
//
//        console.log(evt.feature.getGeometry().getCoordinates())
//    })


    var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
    });

    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });
    map.addOverlay(popup);

    map.addInteraction(selectPointerMove);

    selectPointerMove.on('select', function (e) {
       console.log(e);

       console.log(e.mapBrowserEvent.pixel)
       var coordinate = e.mapBrowserEvent.coordinate;

       var element = popup.getElement();

       $(element).popover('destroy');
       popup.setPosition(coordinate);

        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));
        // the keys are quoted to prevent renaming in ADVANCED mode.
       $(element).popover({
            'placement': 'top',
            'animation': false,
            'html': true,
            'content': '<p>Yo Dre</p><code>' + hdms + '</code>'
       });
       $(element).popover('show');

    });





    /*
    map.on('click', function(evt) {
        console.log(evt);
        var element = popup.getElement();
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));

        console.log(coordinate)


        //$(element).popover('destroy');
        popup.setPosition(coordinate);
        // the keys are quoted to prevent renaming in ADVANCED mode.
        $(element).popover({
            'placement': 'top',
            'animation': false,
            'html': true,
            'content': '<p>Yo Dre</p><code>' + hdms + '</code>'
        });
        $(element).popover('show');

    });
    */

    $scope.$on('drawY', function(event,data){
        console.log(data);
    });

}]);