(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceCard', invoiceCard);
    function invoiceCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                invoiceName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/invoice/directives/invoicecard/invoice-card.html'

        };
    }
})();
