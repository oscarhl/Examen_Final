(function () {
    'use strict';

    angular.module('app', ['ui.router','LocalStorageModule','ui.bootstrap']);




})();
(function () {
    'use strict';

    angular.module('app').config(routeconfig);

    routeconfig.$inject = ['$stateProvider','$urlRouterProvider']

    function routeconfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl:"app/home.html"
            })

            .state("login", {
                url: "/login",
                templateUrl: "app/public/login/index.html"
            })
            .state("album", {
                url: "/album",
                templateUrl: 'app/private/album/index.html'
            })
            .state("artist", {
                url: "/artist",
                templateUrl: 'app/private/artist/index.html'
            })
            .state("customer", {
                url: "/customer",
                templateUrl: 'app/private/customer/index.html'
            })
            .state("employee", {
                url: "/employee",
                templateUrl: 'app/private/employee/index.html'
            })
            .state("mediaType", {
                url: "/mediaType",
                templateUrl: 'app/private/mediaType/index.html'
            })
            .state("playlist", {
                url: "/playlist",
                templateUrl: 'app/private/playlist/index.html'
            })
            .state("playlistTrack", {
                url: "/playlistTrack",
                templateUrl: 'app/private/playlistTrack/index.html'
            })
            .state("otherwise", {
                url: "/",
                templateUrl:"app/home.html"
            })

        
    }

})();



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
(function () {
    'use strict';

    angular.module('app').service('appInterceptor', appInterceptor);

    appInterceptor.$inject = ['$q', '$state', 'configService', 'localStorageService'];

    function appInterceptor($q, $state, configService, localStorageService) {
        return {
            request: function (config) {
                var user = localStorageService.get('userToken');
                if (user && user.token) {
                    config.headers.Authorization = 'Bearer ' + user.token;
                    configService.setLogin(true);
                }
                return config;
            },
            responseError: function (response) {
                if (response.status == 401) {
                    return $state.go('login');
                }
                return $q.reject(response);
            }
        }
    }

})();
(function () {
    'use strict';

    angular.module('app').controller('applicationController', applicationController);

    applicationController.$inject = ['$scope', 'configService',
        'authenticationService','localStorageService']
    
    function applicationController($scope,configService,authenticationService,
        localStorageService) {
        var vm = this;
        vm.validate = validate;
        vm.logout = logout;

        $scope.init = function (url) {
            configService.setApiUrl(url);
        }

        function validate() {
            return configService.getLogin();
        }

        function logout() {
            authenticationService.logout();
        }
    }


})();