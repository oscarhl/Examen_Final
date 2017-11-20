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
