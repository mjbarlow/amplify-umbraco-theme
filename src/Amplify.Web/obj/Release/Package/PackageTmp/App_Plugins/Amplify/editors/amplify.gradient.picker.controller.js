
function amplifyGradientPickerController($scope, $timeout, amplifyService) {
    var vm = this;

    window.vm30 = $scope;
    vm.initActiveColor = initActiveColor;
    vm.selectColor = selectColor;
    vm.gradientStyle = gradientStyle;
    vm.selectedColor = '';
    vm.isSelected = isSelected;
    vm.items = [];
    vm.get = get;

    //vm.new = {
    //    Alias: '',
    //    StartColor: '',
    //    EndColor: '',
    //    Degree: 90,
    //    Order: 0
    //};


    init();

    function init() {
        vm.get();
    }
  

    // get the items from the service
    function initActiveColor() {
        
        if (!$scope.model.value) {
            return;
        }

        var selectedAlias = $scope.model.value;
        var foundItem = null;

        for (var key in vm.items) {
            var item = vm.items[key];
            if (item.Alias === selectedAlias) {
                foundItem = item;
                break;
            }
        }
        if (foundItem) {
            vm.selectedColor = foundItem.Alias;
        }
    }

    // set the color
    function selectColor (color) {
        $timeout(function () {
            var newColor = color ? color.Alias : null;

            if (newColor === $scope.model.value) {
                $scope.propertyForm.selectedColor.$setViewValue('');
                $scope.model.value = '';
            } else {
                $scope.propertyForm.selectedColor.$setViewValue(newColor);
                $scope.model.value = newColor;
            }
        });
    }

    function get() {

        amplifyService.getGradients()
            .then(function (result) {
                vm.items = result.data;
                vm.initActiveColor();
                vm.loading = false;
            });
    }

    function gradientStyle(startColor, endColor, degree) {
        return 'background: linear-gradient(' + degree + 'deg, ' + startColor + ' 0%, ' + endColor + ' 100%);';
    }

    function isSelected(color) {
        return vm.selectedColor && color.Alias === vm.selectedColor;
    }

}
angular.module('umbraco').controller("amplifyGradientPickerController", amplifyGradientPickerController);
