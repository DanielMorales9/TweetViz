app.controller('SideBarController', ['$scope', function($scope) {
    var target = document.getElementById('side');

    target.style.maxHeight = target.offsetHeight + 'px';

    var MAX_TWEETS = 50;

    var tweets_number = 0;

    var ok = true;

    $scope.$on('tweet', function(event, data) {
        if(ok) {
            console.log(data);
            ok = false;
        }
        var newEle = angular.element("" +
            "<div class='tweet'>" +
            "<div class='tweetHeader'>" +
            "<div class='tweetUser'>" +
            "<span><img class='tweetAvatar' src='"+data.user.profile_image_url+"'></span>" +
            "<span><b>"+data.user.name+"</b></span></div>"
            +"<div class='tweetBody'><p>"+ data.text+ "</p></div></div></div>");
        angular.element(target).prepend(newEle);
        if (tweets_number === MAX_TWEETS) {
            target.removeChild(target.lastChild);
        }
        else {
            tweets_number++;
        }

    });
}]);
