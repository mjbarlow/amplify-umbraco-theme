(function () {
    'use strict';
    function amplifyColorPaletteController($scope, amplifyService, assetsService, angularHelper, localizationService) {
        var vm = this;
        vm.update = update;
        vm.add = add;
        vm.addDisabled = addDisabled;
        vm.spectrumColorUpdate = spectrumColorUpdate;
        vm.remove = remove;
        vm.promptIsVisible = false;
        vm.showPrompt = showPrompt;
        vm.hidePrompt = hidePrompt;

        vm.newColor = {
            Alias: '',
            Name: '',
            Value: ''
        };

        vm.sortableOptions = amplifyService.sortableOptions;

        function spectrumColorUpdate(color, newColor, alias) {
            angularHelper.safeApply($scope, function () {
                if (newColor) {
                    vm.newColor.Value = color;
                } else {
                    vm.update(alias, color);
                }
            });
        }

        assetsService.loadCss('lib/spectrum/spectrum.css', $scope);

        function init() {
            if (!$scope.model.value) {
                $scope.model.value = [];
            }
        }

        function update(colorAlias, colorName, colorValue) {
            for (var i = 0, l = $scope.model.value.length; i < l; i++) {
                if ($scope.model.value[i].Alias === colorAlias) {
                    $scope.model.value[i].Name = colorName;
                    $scope.model.value[i].Value = colorValue;
                }
            }
        }

        function add() {

            if (vm.newColor) {

                if (!vm.newColor.Value || vm.n) {
                    vm.colorError = true;
                    return;
                }

                var variableAlias = amplifyService.toSassVariable(vm.newColor.Alias);
                var exists = amplifyService.getVariable($scope.model.value, variableAlias);

                if (!exists) {
                    $scope.model.value.unshift(
                        {
                            Alias: variableAlias,
                            Name: vm.newColor.Name,
                            Value: vm.newColor.Value
                        }
                    );
                    vm.colorError = false;
                    return;
                } else {

                    exists.Enabled = true;
                    exists.Value = vm.newColor.Value;
                    return;
                }
            }

            vm.colorError = true;
        }

        function addDisabled() {

            return vm.newColor.Alias.length === 0 || vm.newColor.Value.length === 0 || vm.newColor.Name.length === 0;
        }

        function showPrompt(item) {
            item.deletePrompt = true;
        }

        function hidePrompt(item) {
            item.deletePrompt = false;
        }

        function remove($index) {
            $scope.model.value.splice($index, 1);
        }

        init();
    }
    angular.module('umbraco')
        .controller('amplifyColorPaletteController', amplifyColorPaletteController);
}
)();
(function () {
    'use strict';
    function amplifyGradientPaletteController($scope, amplifyService, assetsService, angularHelper, localizationService) {
        var vm = this;
        vm.update = update;
        vm.add = add;
        vm.addDisabled = addDisabled;
        vm.spectrumColorUpdate = spectrumColorUpdate;
        vm.remove = remove;
        vm.promptIsVisible = false;
        vm.showPrompt = showPrompt;
        vm.hidePrompt = hidePrompt;
        vm.gradientStyle = gradientStyle;
        vm.sortableOptions = amplifyService.sortableOptions;

        vm.newGradient = {
            Alias: '',
            Name: '',
            StartColor: '',
            EndColor: '',
            Degree: '',
        };

        function spectrumColorUpdate(color, newColor, alias) {
            angularHelper.safeApply($scope, function () {
                if (newColor) {
                    vm.newColor.StartColor = color.StartColor;
                    vm.newColor.EndColor = color.EndColor;
                } else {
                    vm.update(alias, color);
                }
            });
        }

        assetsService.loadCss('lib/spectrum/spectrum.css', $scope);

        function init() {
            if (!$scope.model.value) {
                $scope.model.value = [];
            }
        }

        function update(colorAlias, color) {
            for (var i = 0, l = $scope.model.value.length; i < l; i++) {
                if (
                    $scope.model.value[i].Alias === colorAlias) {
                    $scope.model.value[i].StartColor = color.StartColor;
                    $scope.model.value[i].EndColor = color.EndColor;
                }
            }
        }

        function add() {

            if (vm.newGradient) {

                if (!vm.newGradient.StartColor) {
                    vm.Error = true;
                    return;
                }

                var alias = amplifyService.toSassVariable(vm.newGradient.Alias);
                var exists = amplifyService.getVariable($scope.model.value, alias);
                if (!exists) {
                    $scope.model.value.unshift(
                        {
                            Alias: alias,
                            Name: vm.newGradient.Name,
                            StartColor: vm.newGradient.StartColor,
                            EndColor: vm.newGradient.EndColor,
                            Degree: vm.newGradient.Degree
                        }
                    );
                    vm.Error = false;
                    return;
                } else {
                    exists.StartColor = vm.newGradient.StartColor;
                    exists.EndColor = vm.newGradient.EndColor;
                    exists.Degree = vm.newGradient.Degree;
                    return;
                }
            }

            vm.Error = true;
        }

        function addDisabled() {
            return vm.newGradient.Alias.length === 0
                || vm.newGradient.StartColor.length === 0
                || vm.newGradient.EndColor.length === 0;
        }

        function showPrompt(item) {
            item.deletePrompt = true;
        }

        function hidePrompt(item) {
            item.deletePrompt = false;
        }

        function remove($index) {
            $scope.model.value.splice($index, 1);
        }

        function gradientStyle(startColor, endColor, degree) {
            return 'background: linear-gradient(' + degree + 'deg, ' + startColor + ' 0%, ' + endColor + ' 100%);';
        }

        init();
    }
    angular.module('umbraco')
        .controller('amplifyGradientPaletteController', amplifyGradientPaletteController);
}
)();

(function () {
    'use strict';
    function amplifyColorPickerController($scope, $timeout, amplifyService) {
        var vm = this;
        vm.initActiveColor = initActiveColor;
        vm.selectColor = selectColor;
        vm.selectedColor = '';
        vm.colorStyle = colorStyle;
        vm.isSelected = isSelected;
        vm.isConfigured = true;
        vm.propertyAlias = '';
        vm.setDefault = setDefault;

        vm.config = {
            items: [],
            multiple: false,
            size: 'm'
        };

        function init() {
            getPalette();
          
        }

        function getPalette() {
            amplifyService.getColorPalette(vm.propertyAlias)
                .then(function (result) {
                    vm.config.items = result.data.map((color, index) => ({ value: color.value, alias: color.alias, name: color.name, sortOrder: index, id: (index + 1) }));
                    vm.loading = false;
                    vm.initActiveColor();
                });
        }

        function initActiveColor() {
            if (!$scope.model.value) {
                return;
            }
            vm.setDefault($scope.model.value.alias);
        }

        function setDefault(alias) {
            var foundItem = null;
            for (var j = 0; j < vm.config.items.length; j++) {

                if (vm.config.items[j].alias === alias) {
                    foundItem = vm.config.items[j];
                    break;
                }
            }
            if (foundItem) {
                $scope.model.value = foundItem;
                vm.selectedColor = foundItem.alias;
            }
        }

        function selectColor(color) {
            
            $timeout(function () {
                if (color.alias === $scope.model.value.alias) {
                    $scope.propertyForm.selectedColor.$setViewValue('');
                    $scope.model.value = '';
                } else {
                    $scope.propertyForm.selectedColor.$setViewValue(color.alias);
                    $scope.model.value = color;
                }
            });
        }

        function colorStyle(value) {
            return 'background: ' + value + ';';
        }

        function isSelected(color) {
     
            return vm.selectedColor === color;
        }

        if ($scope.model.config && $scope.model.config.propertyAlias) {
            vm.propertyAlias = $scope.model.config.propertyAlias;
        }

        init();
    }
    angular.module('umbraco').controller("amplifyColorPickerController", amplifyColorPickerController);
}
)();

(function () {
    'use strict';
    function amplifyGradientPickerController($scope, $timeout, amplifyService) {
        var vm = this;
        vm.initActiveColor = initActiveColor;
        vm.selectColor = selectColor;
        vm.selectedColor = '';
        vm.gradientStyle = gradientStyle;
        vm.isSelected = isSelected;
        vm.isConfigured = true;
        vm.defaultValue = '';
        vm.propertyAlias = '';
        vm.setDefault = setDefault;

        vm.config = {
            items: [],
            multiple: false,
            size: 'm'
        };

        function init() {
            getPalette();
        }

        function getPalette() {
            amplifyService.getGradientPalette(vm.propertyAlias)
                .then(function (result) {
                    vm.config.items = result.data.map((color, index) => ({ startColor: color.startColor, endColor: color.endColor, degree: color.degree, alias: color.alias, name: color.name, sortOrder: index, id: (index + 1) }));
                    vm.loading = false;
                    vm.initActiveColor();
                });
        }

        function initActiveColor() {
            if (!$scope.model.value) {
                vm.setDefault(vm.defaultValue);
                return;
            }
            vm.setDefault($scope.model.value.alias);
        }

        function setDefault(alias) {
            var foundItem = null;
            for (let j = 0; j < vm.config.items.length; j++) {

                if (vm.config.items[j].alias === alias) {
                    foundItem = vm.config.items[j];
                    break;
                }
            }
            if (foundItem) {
                $scope.model.value = foundItem;
                vm.selectedColor = foundItem.alias;
            }
        }

        function selectColor(color) {

            $timeout(function () {
                if (color.alias === $scope.model.value.alias) {
                    $scope.propertyForm.selectedColor.$setViewValue('');
                    $scope.model.value = '';
                } else {
                    $scope.propertyForm.selectedColor.$setViewValue(color.alias);
                    $scope.model.value = color;
                }
            });
        }

        function gradientStyle(item) {
            return 'background: linear-gradient(' + item.degree + 'deg, ' + item.startColor + ' 0%, ' + item.endColor + ' 100%);';
        }

        function isSelected(color) {

            return vm.selectedColor === color;
        }

        if ($scope.model.config && $scope.model.config.propertyAlias) {
            vm.propertyAlias = $scope.model.config.propertyAlias;
        }

        init();
    }
    angular.module('umbraco').controller("amplifyGradientPickerController", amplifyGradientPickerController);
}
)();

(function () {

    'use strict';

    function amplifyDashboardController($scope)
    {

        var vm = this;

    }

    angular.module('umbraco')
        .controller('amplifyDashboardController', amplifyDashboardController);
})();
