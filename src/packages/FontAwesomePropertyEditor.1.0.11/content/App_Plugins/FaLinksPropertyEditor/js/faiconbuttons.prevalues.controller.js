function faIconButtonsPrevaluesController($scope, editorService, $sce) {
   const vm = this;

   vm.sortableOptions = {
        distance: 10,
        tolerance: "pointer",
        opacity: 0.7,
        scroll: true,
        cursor: "move",
        handle: ".list-view-layout__sort-handle"
    };

   vm.add = function() {
       const item = {
           label: "",
           value: "",
           svg: ""
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

    vm.removeIcon = function (item) {
        item.svg = "";
   };

   if (!$scope.model.value) {
        $scope.model.value = [];
   };

    $scope.addIcon = function (item) {
        const faPicker = {
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

    $scope.trustAsHtml = $sce.trustAsHtml;
}
angular.module("umbraco").controller("FaIconButtons.Prevalues.Controller", faIconButtonsPrevaluesController);
