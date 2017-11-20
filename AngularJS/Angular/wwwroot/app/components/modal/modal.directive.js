(function () {
    angular.module('app')
        .directive('modalPanel', modalPanel);
    function modalPanel() {
        return {
            templateUrl: 'app/components/modal/modal-directive.html',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@',
                buttonTitle: '@',
                saveFunction: '=',
                closeFunction: '=',
                readOnly: '=',
                isDelete: '='
            }
        };
    }
})();
