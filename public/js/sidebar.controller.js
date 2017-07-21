app.controller('SideBarController', ['$scope', function($scope) {
    var target = document.getElementById('side');

    target.style.maxHeight = target.offsetHeight + 'px';

    var MAX_TWEETS = 50;

    var tweets_number = 0;

    $scope.$on('tweet', function(event, data) {
        var newEle = angular.element("<div>" + data.text+ "</div>");
        angular.element(target).prepend(newEle);
        if (tweets_number === MAX_TWEETS) {
            target.removeChild(target.lastChild);
        }
        else {
            tweets_number++;
        }

    });
}]);
