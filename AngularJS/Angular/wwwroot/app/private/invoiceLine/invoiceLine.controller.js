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
