function faIconButtonsPrevaluesController($scope, editorService, $sce) {
   var vm = this;

   vm.sortableOptions = {
        distance: 10,
        tolerance: 'pointer',
        opacity: 0.7,
        scroll: true,
        cursor: 'move',
        handle: ".list-view-layout__sort-handle"
    };

   vm.add = function() {
        var item = {
            label: '',
            value: '',
            svg: ''
        };
        $scope.model.value.push(item);
    };

   vm.showPrompt = function(item) {
        item.deletePrompt = true;
    };

   vm.hidePrompt = function(item) {
        item.deletePrompt = false;
    };

   vm.remove = function($index) {
        $scope.model.value.splice($index, 1);
    };

   if (!$scope.model.value) {
        $scope.model.value = [];
    }

    $scope.addIcon = function (item) {
        var faPicker = {
            title: "Font Awesome Icon Search",
            view: "/App_Plugins/FaLinksPropertyEditor/faLinks.picker.html",
            size: "small",
            submit: function (model) {
                item.svg = model.svg;
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };
        editorService.open(faPicker);
    };

    // Render svg
    $scope.trustAsHtml = $sce.trustAsHtml;


   vm.removeIcon = function (item) {
        item.svg = "";
   };
}
angular.module('umbraco').controller("FaIconButtons.Prevalues.Controller", faIconButtonsPrevaluesController);
