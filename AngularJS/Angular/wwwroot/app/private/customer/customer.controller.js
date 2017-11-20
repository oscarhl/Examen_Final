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
