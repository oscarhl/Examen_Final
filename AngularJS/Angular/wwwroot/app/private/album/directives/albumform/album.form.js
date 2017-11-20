(function () {
    'use strict';
    angular.module('app')
        .directive('albumForm', albumForm);
    function albumForm() {
        return {
            restrict: 'E',
            scope: {
                album: '='
            },
            templateUrl: 'app/private/album/directives/albumform/album-form.html'
        };
    }
})();