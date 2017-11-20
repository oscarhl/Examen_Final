﻿(function () {
    'use strict';
    angular.module('app')
        .directive('customerForm', customerForm);
    function customerForm() {
        return {
            restrict: 'E',
            scope: {
                customer: '='
            },
            templateUrl: 'app/private/customer/directives/customerform/customer-form.html'
        };
    }
})();