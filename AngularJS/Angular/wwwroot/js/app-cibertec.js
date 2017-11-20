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

(function () {
    angular
        .module('app')
        .factory('authenticationService', authenticationService);
    authenticationService.$inject = ['$http', '$state',
        'localStorageService', 'configService', '$q'];
    function authenticationService($http, $state, localStorageService,
        configService, $q) {
        var service = {};
        service.login = login;
        service.logout = logout;
        return service;
        function login(user) {
            var defer = $q.defer();
            var url = configService.getApiUrl() + '/Token';
            $http.post(url, user)
                .then(function (result) {                   
                    localStorageService.set('userToken',
                        {
                            token: result.data.access_Token,
                            userName: user.userName
                        });
                    configService.setLogin(true);
                    defer.resolve(true);
                },
                function (error) {
                    defer.reject(false);
                });
            return defer.promise;
        }
        function logout() {           
            localStorageService.remove('userToken');
            configService.setLogin(false);
        }
    }
})();
(function () {

    angular.module('app').factory('dataService', dataService);
    dataService.$inject = ['$http'];

    function dataService($http) {
        var service = {};
        service.getData = getData;
        service.postData = postData;
        service.putData = putData;
        service.deleteData = deleteData;

        return service;

        function getData(url) {
            return $http.get(url);
        }

        function postData(url,data) {
            return $http.post(url,data);
        }

        function putData(url,data) {
            return $http.put(url,data);
        }

        function deleteData(url) {
            return $http.delete(url);
        }
    }


})();
(function () {
    'use strict';

    angular.module('app').factory('configService', configService)

    function configService() {
        var service = {};

        var apiUrl = undefined;
        var isLogged = false;
        service.setLogin = setLogin;
        service.getLogin = getLogin;
        service.setApiUrl = setApiUrl;
        service.getApiUrl = getApiUrl;

        return service;

        function setLogin(state) {
            isLogged = state;
        }

        function getLogin() {
            return isLogged;
        }

        function getApiUrl() {
            return apiUrl;
        }

        function setApiUrl(url) {
            apiUrl = url;
        }

        

    }

})();
(function () {
    'use strict';
    angular.module('app')
        .controller('albumController', albumController);
    albumController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function albumController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.album = {};
        vm.albumList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getalbum = getalbum;
        vm.create = create;
        vm.edit = edit;
        vm.delete = albumDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/album/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/album/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.albumList = result.data;
                },
                function (error) {
                    vm.albumList = [];
                    console.log(error);
                });
        }

        function getalbum(id) {
            vm.album = null;
            dataService.getData(apiUrl + '/album/' + id)
                .then(function (result) {
                    vm.album = result.data;
                },
                function (error) {
                    vm.album = null;
                    console.log(error);
                });
        }
        function updatealbum() {
            if (!vm.album) return;
            dataService.putData(apiUrl + '/album', vm.album)
                .then(function (result) {
                    vm.album = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.album = {};
                    console.log(error);
                });
        }
        function createalbum() {
            if (!vm.album) return;
            dataService.postData(apiUrl + '/album', vm.album)
                .then(function (result) {
                    getalbum(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deletealbum() {
            dataService.deleteData(apiUrl + '/album/' + vm.album.albumId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.album = {};
            vm.modalTitle = 'Create album';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createalbum;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit album';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatealbum;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New album Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function albumDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete album';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletealbum;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('albumCard', albumCard);
    function albumCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                albumId: '@',
                title: '@',
                artistId: '@'               
            },
            templateUrl: 'app/private/album/directives/albumcard/album-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('albumForm', albumForm);
    function albumForm() {
        return {
            restrict: 'E',
            scope: {
                album: '='
            },
            templateUrl: 'app/private/album/directives/albumform/album-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('artistController', artistController);
    artistController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function artistController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.artist = {};
        vm.artistList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getartist = getartist;
        vm.create = create;
        vm.edit = edit;
        vm.delete = artistDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/artist/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/artist/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.artistList = result.data;
                },
                function (error) {
                    vm.artistList = [];
                    console.log(error);
                });
        }

        function getartist(id) {
            vm.artist = null;
            dataService.getData(apiUrl + '/artist/' + id)
                .then(function (result) {
                    vm.artist = result.data;
                },
                function (error) {
                    vm.artist = null;
                    console.log(error);
                });
        }
        function updateartist() {
            if (!vm.artist) return;
            dataService.putData(apiUrl + '/artist', vm.artist)
                .then(function (result) {
                    vm.artist = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.artist = {};
                    console.log(error);
                });
        }
        function createartist() {
            if (!vm.artist) return;
            dataService.postData(apiUrl + '/artist', vm.artist)
                .then(function (result) {
                    getartist(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteartist() {
            dataService.deleteData(apiUrl + '/artist/' + vm.artist.artistId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.artist = {};
            vm.modalTitle = 'Create artist';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createartist;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit artist';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateartist;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New artist Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function artistDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete artist';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteartist;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('artistCard', artistCard);
    function artistCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                artistId: '@',
                name: '@'               
            },
            templateUrl: 'app/private/artist/directives/artistcard/artist-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('artistForm', artistForm);
    function artistForm() {
        return {
            restrict: 'E',
            scope: {
                artist: '='
            },
            templateUrl: 'app/private/artist/directives/artistform/artist-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', customerController);
    customerController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function customerController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.customer = {};
        vm.customerList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getcustomer = getcustomer;
        vm.create = create;
        vm.edit = edit;
        vm.delete = customerDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/customer/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/customer/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.customerList = result.data;
                },
                function (error) {
                    vm.customerList = [];
                    console.log(error);
                });
        }

        function getcustomer(id) {
            vm.customer = null;
            dataService.getData(apiUrl + '/customer/' + id)
                .then(function (result) {
                    vm.customer = result.data;
                },
                function (error) {
                    vm.customer = null;
                    console.log(error);
                });
        }
        function updatecustomer() {
            if (!vm.customer) return;
            dataService.putData(apiUrl + '/customer', vm.customer)
                .then(function (result) {
                    vm.customer = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.customer = {};
                    console.log(error);
                });
        }
        function createcustomer() {
            if (!vm.customer) return;
            dataService.postData(apiUrl + '/customer', vm.customer)
                .then(function (result) {
                    getcustomer(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deletecustomer() {
            dataService.deleteData(apiUrl + '/customer/' +
                vm.customer.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.customer = {};
            vm.modalTitle = 'Create customer';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createcustomer;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit customer';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatecustomer;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New customer Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function customerDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete customer';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletecustomer;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

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

(function () {
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
(function () {
    'use strict';
    angular.module('app')
        .controller('employeeController', employeeController);
    employeeController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function employeeController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.employee = {};
        vm.employeeList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getemployee = getemployee;
        vm.create = create;
        vm.edit = edit;
        vm.delete = employeeDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/employee/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/employee/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.employeeList = result.data;
                },
                function (error) {
                    vm.employeeList = [];
                    console.log(error);
                });
        }

        function getemployee(id) {
            vm.employee = null;
            dataService.getData(apiUrl + '/employee/' + id)
                .then(function (result) {
                    vm.employee = result.data;
                },
                function (error) {
                    vm.employee = null;
                    console.log(error);
                });
        }
        function updateemployee() {
            if (!vm.employee) return;
            dataService.putData(apiUrl + '/employee', vm.employee)
                .then(function (result) {
                    vm.employee = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.employee = {};
                    console.log(error);
                });
        }
        function createemployee() {
            if (!vm.employee) return;
            dataService.postData(apiUrl + '/employee', vm.employee)
                .then(function (result) {
                    getemployee(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteemployee() {
            dataService.deleteData(apiUrl + '/employee/' +
                vm.employee.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.employee = {};
            vm.modalTitle = 'Create employee';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createemployee;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit employee';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateemployee;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New employee Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function employeeDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete employee';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteemployee;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

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

(function () {
    'use strict';
    angular.module('app')
        .directive('employeeForm', employeeForm);
    function employeeForm() {
        return {
            restrict: 'E',
            scope: {
                employee: '='
            },
            templateUrl: 'app/private/employee/directives/employeeform/employee-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('genreController', genreController);
    genreController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function genreController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.genre = {};
        vm.genreList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getgenre = getgenre;
        vm.create = create;
        vm.edit = edit;
        vm.delete = genreDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/genre/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/genre/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.genreList = result.data;
                },
                function (error) {
                    vm.genreList = [];
                    console.log(error);
                });
        }

        function getgenre(id) {
            vm.genre = null;
            dataService.getData(apiUrl + '/genre/' + id)
                .then(function (result) {
                    vm.genre = result.data;
                },
                function (error) {
                    vm.genre = null;
                    console.log(error);
                });
        }
        function updategenre() {
            if (!vm.genre) return;
            dataService.putData(apiUrl + '/genre', vm.genre)
                .then(function (result) {
                    vm.genre = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.genre = {};
                    console.log(error);
                });
        }
        function creategenre() {
            if (!vm.genre) return;
            dataService.postData(apiUrl + '/genre', vm.genre)
                .then(function (result) {
                    getgenre(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deletegenre() {
            dataService.deleteData(apiUrl + '/genre/' +
                vm.genre.genreId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.genre = {};
            vm.modalTitle = 'Create genre';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = creategenre;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit genre';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updategenre;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New genre Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function genreDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete genre';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletegenre;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('genreCard', genreCard);
    function genreCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                genreId: '@',
                name: '@'                
            },
            templateUrl: 'app/private/genre/directives/genrecard/genre-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('genreForm', genreForm);
    function genreForm() {
        return {
            restrict: 'E',
            scope: {
                genre: '='
            },
            templateUrl: 'app/private/genre/directives/genreform/genre-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('invoiceController', invoiceController);
    invoiceController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function invoiceController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.invoice = {};
        vm.invoiceList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getinvoice = getinvoice;
        vm.create = create;
        vm.edit = edit;
        vm.delete = invoiceDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/invoice/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/invoice/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.invoiceList = result.data;
                },
                function (error) {
                    vm.invoiceList = [];
                    console.log(error);
                });
        }

        function getinvoice(id) {
            vm.invoice = null;
            dataService.getData(apiUrl + '/invoice/' + id)
                .then(function (result) {
                    vm.invoice = result.data;
                },
                function (error) {
                    vm.invoice = null;
                    console.log(error);
                });
        }
        function updateinvoice() {
            if (!vm.invoice) return;
            dataService.putData(apiUrl + '/invoice', vm.invoice)
                .then(function (result) {
                    vm.invoice = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.invoice = {};
                    console.log(error);
                });
        }
        function createinvoice() {
            if (!vm.invoice) return;
            dataService.postData(apiUrl + '/invoice', vm.invoice)
                .then(function (result) {
                    getinvoice(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteinvoice() {
            dataService.deleteData(apiUrl + '/invoice/' +
                vm.invoice.invoiceId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.invoice = {};
            vm.modalTitle = 'Create invoice';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createinvoice;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit invoice';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateinvoice;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New invoice Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function invoiceDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete invoice';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteinvoice;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

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

(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceForm', invoiceForm);
    function invoiceForm() {
        return {
            restrict: 'E',
            scope: {
                invoice: '='
            },
            templateUrl: 'app/private/invoice/directives/invoiceform/invoice-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('invoiceLineController', invoiceLineController);
    invoiceLineController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function invoiceLineController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.invoiceLine = {};
        vm.invoiceLineList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getinvoiceLine = getinvoiceLine;
        vm.create = create;
        vm.edit = edit;
        vm.delete = invoiceLineDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/invoiceLine/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/invoiceLine/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.invoiceLineList = result.data;
                },
                function (error) {
                    vm.invoiceLineList = [];
                    console.log(error);
                });
        }

        function getinvoiceLine(id) {
            vm.invoiceLine = null;
            dataService.getData(apiUrl + '/invoiceLine/' + id)
                .then(function (result) {
                    vm.invoiceLine = result.data;
                },
                function (error) {
                    vm.invoiceLine = null;
                    console.log(error);
                });
        }
        function updateinvoiceLine() {
            if (!vm.invoiceLine) return;
            dataService.putData(apiUrl + '/invoiceLine', vm.invoiceLine)
                .then(function (result) {
                    vm.invoiceLine = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.invoiceLine = {};
                    console.log(error);
                });
        }
        function createinvoiceLine() {
            if (!vm.invoiceLine) return;
            dataService.postData(apiUrl + '/invoiceLine', vm.invoiceLine)
                .then(function (result) {
                    getinvoiceLine(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteinvoiceLine() {
            dataService.deleteData(apiUrl + '/invoiceLine/' +
                vm.invoiceLine.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.invoiceLine = {};
            vm.modalTitle = 'Create invoiceLine';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createinvoiceLine;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit invoiceLine';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateinvoiceLine;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New invoiceLine Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function invoiceLineDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete invoiceLine';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteinvoiceLine;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

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

(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceLineForm', invoiceLineForm);
    function invoiceLineForm() {
        return {
            restrict: 'E',
            scope: {
                invoiceLine: '='
            },
            templateUrl: 'app/private/invoiceLine/directives/invoiceLineform/invoiceLine-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('mediaTypeController', mediaTypeController);
    mediaTypeController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function mediaTypeController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.mediaType = {};
        vm.mediaTypeList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getmediaType = getmediaType;
        vm.create = create;
        vm.edit = edit;
        vm.delete = mediaTypeDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/mediaType/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/mediaType/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.mediaTypeList = result.data;
                },
                function (error) {
                    vm.mediaTypeList = [];
                    console.log(error);
                });
        }

        function getmediaType(id) {
            vm.mediaType = null;
            dataService.getData(apiUrl + '/mediaType/' + id)
                .then(function (result) {
                    vm.mediaType = result.data;
                },
                function (error) {
                    vm.mediaType = null;
                    console.log(error);
                });
        }
        function updatemediaType() {
            if (!vm.mediaType) return;
            dataService.putData(apiUrl + '/mediaType', vm.mediaType)
                .then(function (result) {
                    vm.mediaType = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.mediaType = {};
                    console.log(error);
                });
        }
        function createmediaType() {
            if (!vm.mediaType) return;
            dataService.postData(apiUrl + '/mediaType', vm.mediaType)
                .then(function (result) {
                    getmediaType(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deletemediaType() {
            dataService.deleteData(apiUrl + '/mediaType/' +
                vm.mediaType.mediaTypeId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.mediaType = {};
            vm.modalTitle = 'Create mediaType';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createmediaType;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit mediaType';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatemediaType;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New mediaType Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function mediaTypeDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete mediaType';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletemediaType;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeCard', mediaTypeCard);
    function mediaTypeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                mediaTypeId: '@',
                name: '@'
            },
            templateUrl: 'app/private/mediaType/directives/mediaTypecard/mediaType-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeForm', mediaTypeForm);
    function mediaTypeForm() {
        return {
            restrict: 'E',
            scope: {
                mediaType: '='
            },
            templateUrl: 'app/private/mediaType/directives/mediaTypeform/mediaType-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('playlistController', playlistController);
    playlistController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function playlistController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.playlist = {};
        vm.playlistList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getplaylist = getplaylist;
        vm.create = create;
        vm.edit = edit;
        vm.delete = playlistDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/playlist/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/playlist/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.playlistList = result.data;
                },
                function (error) {
                    vm.playlistList = [];
                    console.log(error);
                });
        }

        function getplaylist(id) {
            vm.playlist = null;
            dataService.getData(apiUrl + '/playlist/' + id)
                .then(function (result) {
                    vm.playlist = result.data;
                },
                function (error) {
                    vm.playlist = null;
                    console.log(error);
                });
        }
        function updateplaylist() {
            if (!vm.playlist) return;
            dataService.putData(apiUrl + '/playlist', vm.playlist)
                .then(function (result) {
                    vm.playlist = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.playlist = {};
                    console.log(error);
                });
        }
        function createplaylist() {
            if (!vm.playlist) return;
            dataService.postData(apiUrl + '/playlist', vm.playlist)
                .then(function (result) {
                    getplaylist(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteplaylist() {
            dataService.deleteData(apiUrl + '/playlist/' +
                vm.playlist.playlistId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.playlist = {};
            vm.modalTitle = 'Create playlist';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createplaylist;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit playlist';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateplaylist;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New playlist Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function playlistDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete playlist';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteplaylist;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistCard', playlistCard);
    function playlistCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistId: '@',
                name: '@'                
            },
            templateUrl: 'app/private/playlist/directives/playlistcard/playlist-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistForm', playlistForm);
    function playlistForm() {
        return {
            restrict: 'E',
            scope: {
                playlist: '='
            },
            templateUrl: 'app/private/playlist/directives/playlistform/playlist-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('playlistTrackController', playlistTrackController);
    playlistTrackController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function playlistTrackController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.playlistTrack = {};
        vm.playlistTrackList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.getplaylistTrack = getplaylistTrack;
        vm.create = create;
        vm.edit = edit;
        vm.delete = playlistTrackDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/playlistTrack/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/playlistTrack/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.playlistTrackList = result.data;
                },
                function (error) {
                    vm.playlistTrackList = [];
                    console.log(error);
                });
        }

        function getplaylistTrack(id) {
            vm.playlistTrack = null;
            dataService.getData(apiUrl + '/playlistTrack/' + id)
                .then(function (result) {
                    vm.playlistTrack = result.data;
                },
                function (error) {
                    vm.playlistTrack = null;
                    console.log(error);
                });
        }
        function updateplaylistTrack() {
            if (!vm.playlistTrack) return;
            dataService.putData(apiUrl + '/playlistTrack', vm.playlistTrack)
                .then(function (result) {
                    vm.playlistTrack = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.playlistTrack = {};
                    console.log(error);
                });
        }
        function createplaylistTrack() {
            if (!vm.playlistTrack) return;
            dataService.postData(apiUrl + '/playlistTrack', vm.playlistTrack)
                .then(function (result) {
                    getplaylistTrack(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deleteplaylistTrack() {
            dataService.deleteData(apiUrl + '/playlistTrack/' +
                vm.playlistTrack.playlistId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.playlistTrack = {};
            vm.modalTitle = 'Create playlistTrack';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createplaylistTrack;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit playlistTrack';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateplaylistTrack;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New playlistTrack Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function playlistTrackDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete playlistTrack';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteplaylistTrack;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackCard', playlistTrackCard);
    function playlistTrackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistId: '@',
                trackId: '@'              
            },
            templateUrl: 'app/private/playlistTrack/directives/playlistTrackcard/playlistTrack-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackForm', playlistTrackForm);
    function playlistTrackForm() {
        return {
            restrict: 'E',
            scope: {
                playlistTrack: '='
            },
            templateUrl: 'app/private/playlistTrack/directives/playlistTrackform/playlistTrack-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('trackController', trackController);
    trackController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function trackController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.track = {};
        vm.trackList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;
        //Funciones
        vm.gettrack = gettrack;
        vm.create = create;
        vm.edit = edit;
        vm.delete = trackDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;       
        init();
        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }
        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ?
                window.innerWidth : screen.width;
            if (widthScreen < 420) vm.maxSize = 5;
            totalRecords();
        }
        function pageChanged() {
            getPageRecords(vm.currentPage);
        }
        function totalRecords() {
            dataService.getData(apiUrl + '/track/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/track/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.trackList = result.data;
                },
                function (error) {
                    vm.trackList = [];
                    console.log(error);
                });
        }

        function gettrack(id) {
            vm.track = null;
            dataService.getData(apiUrl + '/track/' + id)
                .then(function (result) {
                    vm.track = result.data;
                },
                function (error) {
                    vm.track = null;
                    console.log(error);
                });
        }
        function updatetrack() {
            if (!vm.track) return;
            dataService.putData(apiUrl + '/track', vm.track)
                .then(function (result) {
                    vm.track = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.track = {};
                    console.log(error);
                });
        }
        function createtrack() {
            if (!vm.track) return;
            dataService.postData(apiUrl + '/track', vm.track)
                .then(function (result) {
                    gettrack(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }
        function deletetrack() {
            dataService.deleteData(apiUrl + '/track/' +
                vm.track.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.track = {};
            vm.modalTitle = 'Create track';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createtrack;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit track';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatetrack;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New track Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function trackDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete track';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletetrack;
            vm.isDelete = true;
        }
        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('trackCard', trackCard);
    function trackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                trackName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/track/directives/trackcard/track-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('trackForm', trackForm);
    function trackForm() {
        return {
            restrict: 'E',
            scope: {
                track: '='
            },
            templateUrl: 'app/private/track/directives/trackform/track-form.html'
        };
    }
})();
(function () {
    'use strict';

    angular.module('app').controller('loginController', loginController);

    loginController.$inject = ['$http', 'authenticationService',
        'configService', '$state'];

    function loginController($http,authenticationService,
        configService,$state) {

        var vm = this;
        vm.user = {};
        vm.title = 'login';
        vm.login = login;
        vm.showError = false;

        init();

        function init() {
            if (configService.setLogin()) $state.go("home");
            authenticationService.logout();

        }

        function login() {
            authenticationService.login(vm.user).then(function (result) {
                vm.showError = false;
                $state.go("home");
            }, function (error) {
                vm.showError = true;
            });
        }
    }


})();