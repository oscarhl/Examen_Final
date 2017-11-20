(function () {
    'use strict';
    angular.module('app')
        .directive('employeeCard', employeeCard);
    function employeeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                employeeId: '@',
                lastName: '@',
                firstName: '@',
                title: '@',
                city: '@',
                country: '@',
                email: '@'
            },
            templateUrl: 'app/private/employee/directives/employeecard/employee-card.html'

        };
    }
})();
