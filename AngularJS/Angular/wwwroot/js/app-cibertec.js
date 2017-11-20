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
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('productController', productController);
    productController.$inject = ['dataService', 'configService',
        '$state', '$scope'];
    function productController(dataService, configService, $state,
        $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.product = {};
        vm.productList = [];
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
        vm.getProduct = getProduct;
        vm.create = create;
        vm.edit = edit;
        vm.delete = productDelete;
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
            dataService.getData(apiUrl + '/product/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }
        function getPageRecords(page) {
            dataService.getData(apiUrl + '/product/list/' + page + '/'
                + vm.itemsPerPage)
                .then(function (result) {
                    vm.productList = result.data;
                },
                function (error) {
                    vm.productList = [];
                    console.log(error);
                });
        }

        function getProduct(id) {
            vm.product = null;
            dataService.getData(apiUrl + '/product/' + id)
                .then(function (result) {
                    vm.product = result.data;
                },
                function (error) {
                    vm.product = null;
                    console.log(error);
                });
        }
        function updateProduct() {
            if (!vm.product) return;
            dataService.putData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    vm.product = {};                   
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.product = {};
                    console.log(error);
                });
        }
        function createProduct() {
            if (!vm.product) return;
            dataService.postData(apiUrl + '/product', vm.product)
                .then(function (result) {
                    getProduct(result.data);
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
        function deleteProduct() {
            dataService.deleteData(apiUrl + '/product/' +
                vm.product.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }
        function create() {
            vm.product = {};
            vm.modalTitle = 'Create Product';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createProduct;
            vm.isDelete = false;
        }
        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Product';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateProduct;
            vm.isDelete = false;
        }
        function detail() {
            vm.modalTitle = 'The New Product Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;           
        }
        function productDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Product';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteProduct;
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
        .directive('productCard', productCard);
    function productCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                productName: '@',
                supplierId: '@',
                unitPrice: '@',
                package: '@',
                isDiscontinued: '='
            },
            templateUrl: 'app/private/product/directives/productcard/product-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('productForm', productForm);
    function productForm() {
        return {
            restrict: 'E',
            scope: {
                product: '='
            },
            templateUrl: 'app/private/product/directives/productform/product-form.html'
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