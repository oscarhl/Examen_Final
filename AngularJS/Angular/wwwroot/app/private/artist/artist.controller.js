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
