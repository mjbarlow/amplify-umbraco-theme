(function () {
    'use strict';
    function amplifyColorsController($scope, amplifyService, notificationsService, assetsService, angularHelper, localizationService) {

            var vm = this;
            vm.working = false;
            vm.loading = true;
            vm.save = save;
            vm.delete = amplifyService.delete;
            vm.reset = amplifyService.reset;
            vm.buildSass = amplifyService.buildSass;

            vm.colorVariableError = false;

            vm.hslToHex = hslToHex;
            vm.updateColor = updateColor;

            vm.addColorVariable = addColorVariable;
            vm.addColorVariableDisabled = addColorVariableDisabled;

            vm.addColor = addColor;
            vm.addColorDisabled = addColorDisabled;
    
            vm.spectrumColorUpdate = spectrumColorUpdate;

            vm.newColorVariable = {
                Type: 'themecolor',
                DefaultVal: '',
                Alias: '',
                Value: ''
            };

            vm.newColor = {
                Type: 'color',
                DefaultVal: '',
                Alias: '',
                Value: ''
            };

            vm.sortableOptions = {
                axis: 'y',
                containment: 'parent',
                cursor: 'move',
                items: '> div.control-group',
                tolerance: 'pointer'
            };

            function spectrumColorUpdate(color, newcolor, alias) {

                angularHelper.safeApply($scope, function () {
                    if (newcolor) {
                        vm.newColor.Value = color;
                    } else {
                        vm.updateColor(alias, color);
                    }
                });
            }

            assetsService.loadCss('lib/spectrum/spectrum.css', $scope);

            init();

            function init() {
                get();
            }

            function get() {
                amplifyService.getVariables()
                    .then(function (result) {
                        vm.colors = amplifyService.filterVariables(result.data, 'color').sort(amplifyService.compareValues('Order'));
                        vm.colorVariables = amplifyService.filterVariables(result.data, 'themecolor').sort(amplifyService.compareValues('Order'));
                        vm.loading = false;
                    });
            }

            function hslToHex(color) {
                if (color.charAt(0) === '$') {
                    let myColor = amplifyService.getVariable(vm.colors, color);
                    return amplifyService.hslToHex(myColor.Value);
                }
                return amplifyService.hslToHex(color);
            }

            function updateColor(colorAlias, colorValue) {
                for (var i = 0, l = vm.colors.length; i < l; i++) {
                    if (vm.colors[i].Alias === colorAlias) {
                        vm.colors[i].Value = colorValue;
                    }
                }
            }

            function save() {
                vm.working = true;

                amplifyService.setOrder(vm.colorVariables);
                amplifyService.setOrder(vm.colors);

                var colorVariables = vm.colors.concat(vm.colorVariables);

                amplifyService.saveVariables(colorVariables)
                    .then(function (result) {
                        vm.working = false;
                        notificationsService.success('Saved', 'Colors updated');
                    }, function (error) {
                        notificationsService.error('Saving', error.data.Message);
                    });
            }

            function addColorVariable() {

                if (vm.newColorVariable) {

                    if (!vm.newColorVariable.Value) {
                        vm.colorVariableError = true;
                        return;
                    }

                    var variableAlias = amplifyService.toSassVariable(vm.newColorVariable.Alias);
                    var exists = amplifyService.getVariable(vm.colorVariables, variableAlias);

                    if (!exists) {

                        vm.colorVariables.unshift(
                            {
                                Type: 'themecolor',
                                DefaultVal: vm.newColorVariable.Value,
                                Alias: variableAlias,
                                Value: vm.newColorVariable.Value,
                                Enabled: true,
                                Order: 0

                            }
                        );
                        vm.colorVariableError = false;
                        return;
                    } else {

                        exists.Enabled = true;
                        exists.Value = vm.newColorVariable.Value;
                        return;
                    }
                }
                vm.colorVariableError = true;
            }

            function addColor() {

                if (vm.newColor) {

                    if (!vm.newColor.Value) {
                        vm.colorError = true;
                        return;
                    }

                    var variableAlias = amplifyService.toSassVariable(vm.newColor.Alias);
                    var exists = amplifyService.getVariable(vm.colors, variableAlias);

                    if (!exists) {
                        vm.colors.unshift(
                            {
                                Type: 'color',
                                DefaultVal: vm.newColor.Value,
                                Alias: variableAlias,
                                Value: vm.newColor.Value,
                                Enabled: true,
                                Order: 0
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

            function addColorVariableDisabled() {

                return vm.newColorVariable.Alias.length === 0 || vm.newColorVariable.Value.length === 0;
            }

            function addColorDisabled() {

                return vm.newColor.Alias.length === 0 || vm.newColor.Value.length === 0;
            }

            vm.saveButton = {
                state: 'init',
                defaultButton: {
                    labelKey: 'amplify_savecolors',
                    handler: vm.save
                },
                subButtons: [{
                    labelKey: 'amplify_buildsass',
                    handler: vm.buildSass
                }]
            };
        }
    angular.module('umbraco')
        .controller('amplifyColorsController', amplifyColorsController);
}
)();
(function () {
    'use strict';
    function amplifyDashController(amplifyService) {
        var vm = this;
        vm.buildSass = amplifyService.buildSass;
        vm.dashPathImage = Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/resources/amplify-theme-umbraco-mockups.png';
        vm.logoPath = Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/resources/amplify-umbraco-theme-logo-white.png';
        init();

        function init() { }
    }
    angular.module('umbraco')
        .controller('amplifyDashController', amplifyDashController);
}
)();
(function () {
    'use strict';
    function amplifyFontsController(amplifyService, notificationsService, editorService) {
        var vm = this;
        vm.working = false;
        vm.loading = true;
        vm.save = save;
        vm.chooseFont = chooseFont;

        vm.reset = amplifyService.resetVariable;
        vm.delete = amplifyService.deleteVariable;
        vm.sortableOptions = amplifyService.sortableOptions;

        vm.add = add;
        vm.addDisabled = addDisabled;

        vm.toggleEnabled = toggleEnabled;

        vm.newFont = {
            Type: '',
            DefaultVal: '',
            Alias: '',
            Value: '',
        };

        vm.sortableOptions = {
            axis: 'y',
            containment: 'parent',
            cursor: 'move',
            items: '> div.control-group',
            tolerance: 'pointer',
            handle: '.handle'
        };

        init();

        function init() {
            get();
        }

        function get() {

            amplifyService.getFonts()
                .then(function (result) {
                    vm.fonts = result.data.sort(amplifyService.compareValues('Order'));
                    vm.loading = false;
                });
        }

        function save() {
            vm.working = true;
            amplifyService.setOrder(vm.fonts);

            amplifyService.saveFonts(vm.fonts)
                .then(function () {
                    vm.working = false;
                    notificationsService.success('Saved', 'Fonts updated.');
                }, function (error) {
                    notificationsService.error('Saving', error.data.Message);
                });
        }

        function chooseFont(item) {
            var fontPicker = {
                title: "Google Font Search",
                view: "/app_plugins/amplify/views/amplify.fonts.picker.html",
                size: "medium",
                submit: function (model) {
                    item.Value = model.value;
                    item.Type = model.category;
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };
            editorService.open(fontPicker);
        }

        function add() {

            if (vm.newFont) {
                if (!vm.newFont.Value) {
                    vm.fontError = true;
                    return;
                }
                var fontReplace = vm.newFont.Value.replace(' ', '-')
                var variableAlias = amplifyService.toSassVariable("font-" + fontReplace);
                var exists = amplifyService.getVariable(vm.fonts, variableAlias);

                if (!exists) {

                    vm.fonts.unshift(
                        {
                            Type: vm.newFont.Type,
                            DefaultVal: vm.newFont.Value,
                            Alias: variableAlias,
                            Value: vm.newFont.Value,
                            Enabled: true,
                            Order: 0
                        }
                    );
                    vm.fontError = false;
                    return;
                } else {

                    exists.Enabled = true;
                    exists.Value = vm.newFont.Value;
                    return;
                }
            }

            vm.fontError = true;
        }

        function toggleEnabled(item) {
            item.Enabled = !item.Enabled;
        };

        function addDisabled() {
            return  vm.newFont.Value.length === 0;
        }
    }
    angular.module('umbraco')
        .controller('amplifyFontsController', amplifyFontsController);
}
)();
(function () {
    'use strict';
    function amplifyFontsPickerController($scope, $http, $element) {
        const dataUrl = '/app_plugins/amplify/resources/google-fonts.json';

        $scope.model.results = [];

        setTimeout(function () {
            var input = $element[0].querySelector("#amplify-fonts-search");
            if (input) input.focus();
            $scope.load();
        }, 20);

        $scope.submit = function (result) {
            if ($scope.model.submit) {
                $scope.model.submit(result);
            }
        };

        $scope.close = function () {
            if ($scope.model.close) {
                $scope.model.close();
            }
        };

        $scope.formatData = function (data) {
            $scope.model.results = [];
            angular.forEach(data,
                function (font, fontKey) {
                    var selectedFont = {
                        value: fontKey,
                        category: font.category
                    };
                    $scope.model.results.push(selectedFont);
                });
        };

        $scope.load = function () {
            if ($scope.model.search === '') {
                return;
            }
            $scope.model.loading = true;
            $http({
                method: 'GET',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                if (response !== null && response !== undefined && response.data !== undefined) {

                    $scope.formatData(response.data);
                }
                else {
                    $scope.model.results = null;
                }
                $scope.model.loading = false;
            });
        };
    }
    angular.module('umbraco')
        .controller("Amplify.Fonts.Picker.Controller", amplifyFontsPickerController);
}
)();
(function () {
    'use strict';
    function amplifyFontStacksController(amplifyService, notificationsService) {
        var vm = this;
        vm.working = false;
        vm.loading = true;
        vm.save = save;
        vm.reset = amplifyService.resetVariable;
        vm.delete = amplifyService.deleteVariable;
        vm.buildSass = amplifyService.buildSass;

        vm.addFont = addFont;
        vm.addFontDisabled = addFontDisabled;

        vm.addFontVariable = addFontVariable;
        vm.addFontVariableDisabled = addFontVariableDisabled;

        vm.newFont = {
            Type: 'font',
            DefaultVal: '',
            Alias: '',
            Value: ''
        };
        vm.newFontVariable = {
            Type: 'themefont',
            DefaultVal: '',
            Alias: '',
            Value: ''
        };

        init();

        function init() {
            get();
        }

        function get() {
            amplifyService.getFontStacks()
                .then(function (result) {
                    vm.fonts = result.data;
                    vm.fonts = amplifyService.filterVariables(result.data, 'font').sort(amplifyService.compareValues('Order'));
                    vm.fontVariables = amplifyService.filterVariables(result.data, 'themefont').sort(amplifyService.compareValues('Order'));
                    vm.loading = false;
                });
        }

        function save() {
            vm.working = true;

            amplifyService.setOrder(vm.fontVariables);
            amplifyService.setOrder(vm.fonts);

            var variables = vm.fonts.concat(vm.fontVariables);

            amplifyService.saveFontStacks(variables)
                .then(function () {
                    vm.working = false;
                    notificationsService.success('Saved', 'Font stacks updated');
                }, function (error) {
                    notificationsService.error('Saving', error.data.Message);
                });
        }

        function addFont() {

            if (vm.newFont) {

                if (!vm.newFont.Value) {
                    vm.fontError = true;
                    return;
                }

                var variableAlias = amplifyService.toSassVariable(vm.newFont.Alias);
                var exists = amplifyService.getVariable(vm.fonts, variableAlias);

                if (!exists) {

                    vm.fonts.unshift(
                        {
                            Type: 'font',
                            DefaultVal: vm.newFont.Value,
                            Alias: variableAlias,
                            Value: vm.newFont.Value,
                            Enabled: true,
                            Order: 0
                        }
                    );
                    vm.fontError = false;
                    return;
                } else {

                    exists.Enabled = true;
                    exists.Value = vm.newFont.Value;
                    return;
                }
            }

            vm.fontError = true;
        }

        function addFontVariable() {

            if (vm.newFontVariable) {

                if (!vm.newFontVariable.Value) {
                    vm.fontVariableError = true;
                    return;
                }

                var variableAlias = amplifyService.toSassVariable(vm.newFontVariable.Alias);
                var exists = amplifyService.getVariable(vm.fontVariables, variableAlias);

                if (!exists) {

                    vm.fontVariables.unshift(
                        {
                            Type: 'themefont',
                            DefaultVal: vm.newFontVariable.Value,
                            Alias: variableAlias,
                            Value: vm.newFontVariable.Value,
                            Enabled: true,
                            Order: 0
                        }
                    );
                    vm.fontVariableError = false;
                    return;
                } else {

                    exists.Enabled = true;
                    exists.Value = vm.newFontVariable.Value;
                    return;
                }
            }
            vm.fontVariableError = true;
        }

        function addFontVariableDisabled() {

            return vm.newFontVariable.Alias.length === 0 || vm.newFontVariable.Value.length === 0;
        }

        function addFontDisabled() {

            return vm.newFont.Alias.length === 0 || vm.newFont.Value.length === 0;
        }

        vm.saveButton = {
            state: 'init',
            defaultButton: {
                labelKey: 'amplify_savefontstacks',
                handler: vm.save
            },
            subButtons: [{
                labelKey: 'amplify_buildsass',
                handler: vm.buildSass
            }]
        };

    }
    angular.module('umbraco')
        .controller('amplifyFontStacksController', amplifyFontStacksController);
}
)();
(function () {
    'use strict';
    function amplifyGradientsController($scope, amplifyService, notificationsService, assetsService, localizationService) {
        var vm = this;
        vm.working = false;
        vm.loading = true;
        vm.error = false;

        vm.save = save;

        vm.reset = amplifyService.resetVariable;
        vm.delete = amplifyService.deleteVariable;
        vm.buildSass = amplifyService.buildSass;
        vm.sortableOptions = amplifyService.sortableOptions;

        vm.add = add;
        vm.addDisabled = addDisabled;

        vm.gradientStyle = gradientStyle;

        vm.new = {
            Alias: '',
            StartColor: '',
            EndColor: '',
            Degree: 90,
            Order: 0
        };

        assetsService.loadCss('lib/spectrum/spectrum.css', $scope);

        init();

        function init() {
            get();
        }

        function get() {
            amplifyService.getGradients()
                .then(function (result) {
                    vm.gradients = result.data.sort(amplifyService.compareValues('Order'));
                    vm.loading = false;
                });
        }

        function save() {
            vm.working = true;
            amplifyService.setOrder(vm.gradients);
            amplifyService.saveGradients(vm.gradients)
                .then(function () {
                    vm.working = false;
                    notificationsService.success('Saved', 'Gradients updated');
                }, function (error) {
                    notificationsService.error('Saving', error.data.Message);
                });
        }

        function add() {

            if (vm.new) {

                if (!vm.new.StartColor) {
                    vm.Error = true;
                    return;
                }

                var alias = amplifyService.toSassVariable(vm.new.Alias);
                var exists = amplifyService.getVariable(vm.gradients, alias);
                if (!exists) {
                    vm.gradients.unshift(
                        {
                            Alias: alias,
                            StartColor: vm.new.StartColor,
                            EndColor: vm.new.EndColor,
                            Degree: vm.new.Degree,
                            Order: 0
                        }
                    );
                    vm.Error = false;
                    return;
                } else {
                    exists.StartColor = vm.new.StartColor;
                    exists.EndColor = vm.new.EndColor;
                    exists.Degree = vm.new.Degree;
                    return;
                }
            }

            vm.Error = true;
        }

        function addDisabled() {

            return vm.new.Alias.length === 0
                || vm.new.StartColor.length === 0
                || vm.new.EndColor.length === 0;
        }

        function gradientStyle(startColor, endColor, degree) {
            return 'background: linear-gradient(' + degree + 'deg, ' + startColor + ' 0%, ' + endColor + ' 100%);';
        }

        vm.saveButton = {
            state: 'init',
            defaultButton: {
                labelKey: 'amplify_savegradients',
                handler: vm.save
            },
            subButtons: [{
                labelKey: 'amplify_buildsass',
                handler: vm.buildSass
            }]
        };
    }
    angular.module('umbraco')
        .controller('amplifyGradientsController', amplifyGradientsController);
}
)();
(function () {
    'use strict';
    function amplifySassVariablesController($scope, $element, amplifyService, notificationsService) {
        var vm = this;
        vm.working = false;
        vm.loading = true;
        vm.save = save;
        vm.reset = amplifyService.resetVariable;
        vm.delete = amplifyService.deleteVariable;
        vm.sortableOptions = amplifyService.sortableOptions;
        vm.buildSass = amplifyService.buildSass;

        vm.sassVariables = {};

        vm.add = add;
        vm.addDisabled = addDisabled;

        vm.newSassVariable = {
            Type: 'sassVariable',
            DefaultVal: '',
            Alias: '',
            Value: ''
        };
     
        init();

        function init() {
            get();
        }

        function get() {
            amplifyService.getSassVariables()
                .then(function (result) {
                    vm.sassVariables = amplifyService.filterVariables(result.data, 'sassVariable').sort(amplifyService.compareValues('Order'));
                    vm.loading = false;
                });
        }

        function save() {
            vm.working = true;
                amplifyService.setOrder(vm.sassVariables);
                amplifyService.saveSassVariables(vm.sassVariables)
                .then(function () {
                    vm.working = false;
                    notificationsService.success('Saved', 'Sass variables updated');
                }, function (error) {
                    notificationsService.error('Saving', error.data.Message);
                });
        }

        function add() {
            if (vm.newSassVariable) {

                var variableAlias = amplifyService.toSassVariable(vm.newSassVariable.Alias);
                var exists = amplifyService.getVariable(vm.sassVariables, variableAlias);

                if (!exists) {

                    vm.sassVariables.unshift(
                        {
                            Type: 'sassVariable',
                            DefaultVal: vm.newSassVariable.Value,
                            Alias: variableAlias,
                            Value: vm.newSassVariable.Value,
                            Enabled: true,
                            Order: 0
                        }
                    );

                    return;
                } else {

                    exists.Enabled = true;
                    exists.Value = vm.newSassVariable.Value;
                    return;
                }
            }
        }

        function addDisabled() {

            return vm.newSassVariable.Alias.length === 0 || vm.newSassVariable.Value.length === 0;
        }

        vm.saveButton = {
            state: 'init',
            defaultButton: {
                labelKey: 'amplify_savesassvariables',
                handler: vm.save
            },
            subButtons: [{
                labelKey: 'amplify_buildsass',
                handler: vm.buildSass
            }]
        };
    }
    angular.module('umbraco')
        .controller('amplifySassVariablesController', amplifySassVariablesController);
}
)();