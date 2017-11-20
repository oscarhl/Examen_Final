(function () {
    'use strict';
    angular.module('app')
        .directive('trackForm', trackForm);
    function trackForm() {
        return {
            restrict: 'E',
            scope: {
                track: '='
            },
            templateUrl: 'app/private/track/directives/trackform/track-form.html'
        };
    }
})();