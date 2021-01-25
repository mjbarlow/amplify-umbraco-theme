
function amplifyStyleSettingsController($scope, $timeout, amplifyService) {
    var vm = this;
    window.vm10 = $scope;
    vm.initActiveColor = initActiveColor;
    vm.selectColor = selectColor;

    // todo: hook this up to the config
    vm.config = {
        items: [],
        multiple: false, // only pick one
        useLabel: false, // don't use labels
        size: 'm'
    };
    vm.isConfigured = true;

    init();

    function init() {
        getSwatch();
    }
    vm.initActiveColor();

    // get the items from the service
    function initActiveColor() {
        // no value
        if (!$scope.model.label) {
            return;
        }

        // Check on the label only - as this is going to be the unique key.
        var modelLabel = $scope.model.value.label;

        var foundItem = null;
        // Look for a matching color.
        for (var key in $scope.model.config.items) {
            var item = $scope.model.config.items[key];
            if (item.label === modelLabel) {
                foundItem = item;
                break;
            }
        }
        if (foundItem) {
            $scope.model.value.value = foundItem.value;
            $scope.model.value.label = foundItem.label;
        }
    }

    // set the color
    function selectColor (color) {
        $timeout(function () {
            var newColor = color ? color.value : null;
            $scope.propertyForm.selectedColor.$setViewValue(newColor);
        });
    }

    function getSwatch() {

        amplifyService.getSwatch()
            .then(function (result) {
                vm.config.items = result.data.map((color, index) => ({ value: amplifyService.hslToHex(color.Value), label: color.Alias, sortOrder: index, id: (index + 1) }));
                vm.loading = false;
            });
    }

    // Method required by the valPropertyValidator directive (returns true if the property editor has at least one color selected)
    $scope.validateMandatory = function () {
        var isValid = !$scope.model.validation.mandatory || $scope.model.value !== null && $scope.model.value !== '' && (!$scope.model.value.hasOwnProperty('value') || $scope.model.value.value !== '');
        return {
            isValid: isValid,
            errorMsg: 'Value cannot be empty',
            errorKey: 'required'
        };
    };

}
angular.module('umbraco').controller("amplifyStyleSettingsController", amplifyStyleSettingsController);
