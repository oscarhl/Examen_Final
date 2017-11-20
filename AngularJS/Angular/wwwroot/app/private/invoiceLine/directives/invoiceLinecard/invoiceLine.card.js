(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceLineCard', invoiceLineCard);
    function invoiceLineCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                invoiceLineName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/invoiceLine/directives/invoiceLinecard/invoiceLine-card.html'

        };
    }
})();
