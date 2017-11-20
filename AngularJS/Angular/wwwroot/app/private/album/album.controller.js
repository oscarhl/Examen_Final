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
