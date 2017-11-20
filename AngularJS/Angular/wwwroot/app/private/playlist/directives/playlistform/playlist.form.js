(function () {
    'use strict';
    angular.module('app')
        .directive('playlistForm', playlistForm);
    function playlistForm() {
        return {
            restrict: 'E',
            scope: {
                playlist: '='
            },
            templateUrl: 'app/private/playlist/directives/playlistform/playlist-form.html'
        };
    }
})();