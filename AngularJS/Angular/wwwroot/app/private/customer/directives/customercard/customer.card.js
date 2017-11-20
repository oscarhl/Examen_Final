(function () {
    'use strict';
    angular.module('app')
        .directive('customerCard', customerCard);
    function customerCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                customerId: '@',
                firstName: '@',
                lastName: '@',
                city: '@',
                country: '@',
                phone: '@',
                email: '@',
                supportRepId:'@'
               },
            templateUrl: 'app/private/customer/directives/customercard/customer-card.html'

        };
    }
})();
