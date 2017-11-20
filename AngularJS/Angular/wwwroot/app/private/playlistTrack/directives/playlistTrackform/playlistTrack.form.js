(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackForm', playlistTrackForm);
    function playlistTrackForm() {
        return {
            restrict: 'E',
            scope: {
                playlistTrack: '='
            },
            templateUrl: 'app/private/playlistTrack/directives/playlistTrackform/playlistTrack-form.html'
        };
    }
})();