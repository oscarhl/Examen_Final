(function () {
    'use strict';
    angular.module('app').run(run).config(config);

    run.$inject = ['$http', '$state','localStorageService', 'configService'];

    function run($http, $state,localStorageService, configService) {
        var user = localStorageService.get('userToken');
        if (user && user.token) {
           
            configService.setLogin(true);
        }
        else $state.go('login');
    }

    config.$inject = ['$httpProvider'];
    function config($httpProvider) {
        $httpProvider.interceptors.push('appInterceptor');
    }

    
})();