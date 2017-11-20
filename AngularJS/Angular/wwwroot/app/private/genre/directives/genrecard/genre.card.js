(function () {
    'use strict';
    angular.module('app')
        .directive('genreCard', genreCard);
    function genreCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                genreId: '@',
                name: '@'                
            },
            templateUrl: 'app/private/genre/directives/genrecard/genre-card.html'

        };
    }
})();
