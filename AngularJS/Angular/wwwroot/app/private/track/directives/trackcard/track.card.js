(function () {
    'use strict';
    angular.module('app')
        .directive('trackCard', trackCard);
    function trackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                trackName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/track/directives/trackcard/track-card.html'

        };
    }
})();
