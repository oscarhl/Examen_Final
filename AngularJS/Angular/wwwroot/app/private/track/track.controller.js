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
