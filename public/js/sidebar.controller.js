app.controller('SideBarController', ['$scope', function($scope) {

    $scope.toogleStreamName = 'Stop';
    $scope.toogleStreamColor = false;

    $scope.toogleStream = function () {
        if (!$scope.toogleStreamColor) {
            $scope.toogleStreamName = 'Restart';
            $scope.toogleStreamColor = true;

            $scope.$emit('stop', {})

        }
        else {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;

            $scope.$emit('restart', {})

        }
    };

    var target = document.getElementById('sideContent');
    var offsetHeightSideHeader = document.getElementById('sideHeader').offsetHeight;
    var offsetHeightSide = document.getElementById('side').offsetHeight;
    target.style.maxHeight = (offsetHeightSide - offsetHeightSideHeader)+'px';

    var MAX_TWEETS = 50;

    var tweets_number = 0;

    /**
     * ---------------------------------------------
     * ------------ EVENT LISTENERS ----------------
     * ---------------------------------------------
     */


    $scope.$on('tweet', function(event, data) {

        var string = "This is going #right on the way";
        data.text = data.text.replace( /(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );
        data.text = data.text.replace( /(https:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );
        data.text = data.text.replace(/#(\S*)/g,'<a href="http://twitter.com/#!/search/$1">#$1</a>');


        var d = new Date(data.created_at);
        var dateTime = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        var newEle = angular.element("" +
            "<div class='tweet'>" +
            "<div class='tweetHeader'>" +
            "<div class='tweetUser'>" +
            "<span><img class='tweetAvatar' src='"+data.user.profile_image_url+"'></span>" +
            "<span><b>"+data.user.name+"</b></span></div></div>"+
            "<div class='tweetBody'><p>"+ data.text+ "</p></div>" +
            "<div class='tweetFooter'><i class='fa fa-map-marker' aria-hidden='true'>&nbsp;"+data.place.full_name+"</i>&nbsp;&nbsp;" +
            "<i class='fa fa-clock-o' aria-hidden='true'></i>&nbsp;"+ dateTime +
            "</div></div>");
        angular.element(target).prepend(newEle);
        if (tweets_number === MAX_TWEETS) {
            target.removeChild(target.lastChild);
        }
        else {
            tweets_number++;
        }

    });

    function stopButton() {
        if ($scope.toogleStreamColor) {
            $scope.toogleStreamName = 'Stop';
            $scope.toogleStreamColor = false;
        }
    }

    $scope.$on('searchDOWN', function(event, data) {
        stopButton();
    });

    $scope.$on('bboxDOWN', function(event, data) {
        stopButton();
    });

    $scope.$on('resetDOWN', function(event, data) {
        stopButton();
    });
}]);
