(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeForm', mediaTypeForm);
    function mediaTypeForm() {
        return {
            restrict: 'E',
            scope: {
                mediaType: '='
            },
            templateUrl: 'app/private/mediaType/directives/mediaTypeform/mediaType-form.html'
        };
    }
})();