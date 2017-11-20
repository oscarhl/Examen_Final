(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackCard', playlistTrackCard);
    function playlistTrackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistId: '@',
                trackId: '@'              
            },
            templateUrl: 'app/private/playlistTrack/directives/playlistTrackcard/playlistTrack-card.html'

        };
    }
})();
