(function () {
    'use strict';
    angular.module('app')
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();
