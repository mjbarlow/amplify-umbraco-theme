function faLinkPrevaluesController($scope) {
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
            name: '',
            value: ''
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
}
angular.module('umbraco').controller("FaLinks.Prevalues.Controller", faLinkPrevaluesController);
