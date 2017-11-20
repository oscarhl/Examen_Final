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
