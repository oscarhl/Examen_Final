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
