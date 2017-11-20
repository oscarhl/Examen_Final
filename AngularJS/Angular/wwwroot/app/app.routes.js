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


