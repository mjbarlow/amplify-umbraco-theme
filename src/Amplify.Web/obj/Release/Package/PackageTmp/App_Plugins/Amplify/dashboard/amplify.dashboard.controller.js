(function () {
    'use strict';

    function dashboardController() {

        var vm = this;

        vm.page = {
            title: 'Amplify ',
            description: '1.0.1',
            navigation: [
                {
                    'name': 'Amplify',
                    'alias': 'amplify',
                    'icon': 'icon-display',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.dashboard.html',
                    'active': true
                },
                {
                    'name': 'Gradients',
                    'alias': 'gradients',
                    'icon': 'icon-palette',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.gradients.html'
                },
                {
                    'name': 'Colors',
                    'alias': 'colors',
                    'icon': 'icon-color-bucket',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.colors.html'
                },
                {
                    'name': 'Font Stacks',
                    'alias': 'fontstacks',
                    'icon': 'icon-console',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.fontstacks.html'
                },
                {
                    'name': 'Fonts',
                    'alias': 'fonts',
                    'icon': 'icon-font',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.fonts.html'
                },
                {
                    'name': 'Sass',
                    'alias': 'sass',
                    'icon': 'icon-code',
                    'view': Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/amplify/views/amplify.sass.variables.html'
                }
            ]
        };
    }
    angular.module('umbraco').controller('amplifyDashboardController', dashboardController);
}());
