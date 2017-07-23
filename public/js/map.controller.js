app.controller('MapController', ['socket', '$scope', function (socket, $scope) {

    /**
     * Tweet Object Cache
     */
    var tweets = {};

    /**
     * Popup Nodes
     * @type {Element}
     */
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var TWEET_DELAY = 3000;

    /** --------------------------------------------
     *  ------------ MAP CONFIGURATION -------------
     *  --------------------------------------------
     */
    var attribution = new ol.control.Attribution({
        collapsible: false
    });

    var map = new ol.Map({

        target: 'map',
        controls: ol.control.defaults({attribution: false}).extend([attribution]),
        view: new ol.View({
            center: [0, 0],
            zoom: 2
        })
    });

    /**
     * Layer della Mappa
     * @type {ol.layer.Tile}
     */
    var tile_layer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    map.addLayer(tile_layer);

    /**
     * Layer dei Tweet
     * @type {ol.layer.Vector}
     */
    var vector_layer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

    map.addLayer(vector_layer);


    /**
     * HeatMap layer dei tweet
     * @type {ol.layer.HeatMap}
     */
    var heatmap_layer = new ol.layer.Heatmap({
        source: new ol.source.Vector()
    });

    var toggleLayer = true;

    /**
     * Color style
     * @type {ol.style.Fill}
     */
    var green = new ol.style.Fill({
        color: [0, 0, 255, 0.3]
    });

    /**
     * Points Style
     * @type {ol.style.Style}
     */
    var style = new ol.style.Style({
        image: new ol.style.Circle({
            fill: green,
            radius: 5
        }),
        fill: green
    });

    vector_layer.setStyle(style);

    var current_projection = new ol.proj.Projection({code: "EPSG:4326"});
    var new_projection = tile_layer.getSource().getProjection();

    var draw_source = new ol.source.Vector({wrapX: false});
    /**
     * Draw Vector Layer
     * @type {ol.layer.Vector}
     */
    var draw_vector = new ol.layer.Vector({
        source: draw_source
    });

    map.addLayer(draw_vector);

    /**
     * Draw Interaction
     * @type {ol.interaction.Draw}
     */
    var draw = new ol.interaction.Draw({
        source: draw_source,
        type: 'Circle',
        geometryFunction: ol.interaction.Draw.createBox()
    });

    /**
     * Pointer Move Interaction for Popup
     * @type {ol.interaction.Select}
     */
    var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
    });

    map.addInteraction(selectPointerMove);

    /**
     * Popup Overlay
     * @type {ol.Overlay}
     */
    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPanMargin: 50,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map.addOverlay(popup);

    /**
     * ---------------------------------------------
     * ------------- MAP LISTENERS -----------------
     * ---------------------------------------------
     */
    closer.onclick = function () {
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };

    selectPointerMove.on('select', function (e) {
        var coordinate = e.mapBrowserEvent.coordinate;

        var featureId = e.target.getFeatures().getArray()[0].getId();

        var data = tweets[featureId];
        var d = new Date(data.created_at);
        var dateTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        content.innerHTML = "<div class='tweetPopup'>" +
            "<div class='tweetHeader'>" +
            "<div class='tweetUser'>" +
            "<span><img class='tweetAvatar' src='" + data.user.profile_image_url + "'></span>" +
            "<span><b>" + data.user.name + "</b></span></div></div>" +
            "<div class='tweetBody'><p>" + data.text + "</p></div>" +
            "<div class='tweetFooter'>" +
            "<i class='fa fa-map-marker' aria-hidden='true'>&nbsp;" + data.place.full_name + "</i>&nbsp;&nbsp;" +
            "<i class='fa fa-clock-o' aria-hidden='true'></i>&nbsp;" + dateTime +
            "</div></div>";

        popup.setPosition(coordinate);
        map.addOverlay(popup);

    });

    draw.on('drawstart', function (evt) {
        removeDrawnFeatures()
    });

    draw.on('drawend', function (evt) {
        var feature = evt.feature;
        var geom = feature.getGeometry();
        var ext = geom.getExtent();
        fitExtent(feature, geom);

        var prj_ext = ol.proj.transformExtent(ext, new_projection, current_projection);
        console.log(prj_ext);
        $scope.$emit('bbox', {locations: prj_ext.join(",")});
        if(toggleLayer)
            map.addInteraction(selectPointerMove);
        map.removeInteraction(draw);
        removeLayerFeatures()
    });


    /** -----------------------------------------
     *  ----------- EVENT LISTENERS -------------
     *  -----------------------------------------
     */
    $scope.$on('tweet', function (event, data) {
            var point_feature = new ol.Feature();
            var point_geom = new ol.geom.Point(
                data.coordinates.coordinates
            );
            point_feature.setGeometry(point_geom);
            point_feature.getGeometry().transform(current_projection, new_projection);
        if (toggleLayer) {
            point_feature.setId(data.id);
            tweets[data.id] = data;
            vector_layer.getSource().addFeature(point_feature);

            setTimeout(function () {
                vector_layer.getSource().removeFeature(point_feature);
                delete tweets[point_feature.getId()];
            }, TWEET_DELAY);
        }
        else {
            heatmap_layer.getSource().addFeature(point_feature);
        }
    });

    $scope.$on('interaction', function (event, data) {
        switch (data.type) {
            case 'draw':
                drawHandler(data);
                break;
            case 'slider':
                sliderHandler(data);
                break;
            default:
                break;
        }
    });

    $scope.$on('searchDOWN', function (event, data) {
        removeLayerFeatures();
    });

    $scope.$on('resetDOWN', function (event, data) {
        removeLayerFeatures();
        map.getView().animate({center: [0, 0],
            zoom: 2,
            duration: 1000});
    });

    $scope.$on('heatmap', function (event, data) {
        toggleLayer = !data.active;
        if (data.active) {
            map.addLayer(heatmap_layer);
            map.removeLayer(vector_layer);
            map.removeInteraction(selectPointerMove);
            removeFeatures(vector_layer)
        }
        else {
            map.addLayer(vector_layer);
            map.removeLayer(heatmap_layer);
            map.addInteraction(selectPointerMove);
            removeFeatures(heatmap_layer);
        }
    });


    /** ---------------------------------------
     * --------- INTERACTION HANDLER ----------
     * ----------------------------------------*/

    function drawHandler(data) {
        if (data.active) {
            console.log("draw", "rimuove pointer move");
            map.addInteraction(draw);
            map.removeInteraction(selectPointerMove)
        }
        else {
            console.log("draw", "aggiungo pointer move");
            map.removeInteraction(draw);
            map.addInteraction(selectPointerMove)

        }
    }

    function sliderHandler(data) {
        TWEET_DELAY = data.time || 3000;
    }


    /**
     * ----------------------------------------
     * ----------- SCOPE FUNCTIONS ------------
     * ----------------------------------------
     */
    $scope.reset = function () {
        $scope.$emit('reset', {})
    };

    $scope.search = function () {

        var hashtag = $scope.hashtag;
        hashtag = hashtag.replace(",", " ");
        hashtag = hashtag.replace(" ", ",");

        $scope.$emit('search', {track: hashtag});


        $scope.hashtag = "";

    };

    /**
     * ----------------------------------------
     * --------- UTILITY FUNCTIONS ------------
     * ----------------------------------------
     */

    function removeDrawnFeatures() {
        draw_source.getFeatures().forEach(function (f) {
            draw_source.removeFeature(f);
        })
    }

    function fitExtent(feature, geom) {
        map.getView().fit(geom, {
            duration: 2000,
            nearest: true,
            callback: function () {
                draw_source.removeFeature(feature);
            }
        });
    }

    function removeFeatures(layer) {
        layer.getSource().getFeatures().forEach(function (e) {
            layer.getSource().removeFeature(e);
        });
    }

    function removeLayerFeatures() {
        if (toggleLayer) {
            removeFeatures(vector_layer);
        }
        else {
            removeFeatures(heatmap_layer);
        }
    }

}]);