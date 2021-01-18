(function () {
    'use strict';

    function amplifyService($http, localizationService, notificationsService) {

        var serviceRoot = Umbraco.Sys.ServerVariables.Amplify.AmplifyService;

        var service = {
            compareValues: compareValues,
            filterVariables: filterVariables,
            toSassVariable: toSassVariable,
            getVariable: getVariable,
            setOrder: setOrder,
            resetVariable: resetVariable,
            deleteVariable: deleteVariable,
            sortableOptions: sortableOptions,
            getColorPalette: getColorPalette,
            getGradientPalette: getGradientPalette
        };

        return service;

        function compareValues(key, order = 'asc') {
            return function innerSort(a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    return 0;
                }

                const varA = (typeof a[key] === 'string')
                    ? a[key].toUpperCase() : a[key];
                const varB = (typeof b[key] === 'string')
                    ? b[key].toUpperCase() : b[key];

                let comparison = 0;
                if (varA > varB) {
                    comparison = 1;
                } else if (varA < varB) {
                    comparison = -1;
                }
                return (
                    (order === 'desc') ? (comparison * -1) : comparison
                );
            };
        }

        function filterVariables(variables, attributeVal) {
            const filteredVariables = [];
            for (var i = 0, l = variables.length; i < l; i++) {
                if (variables[i].Type === attributeVal) {
                    filteredVariables.push(variables[i]);
                }
            }
            return filteredVariables;
        }

        function toSassVariable(sassVariable) {
            if (sassVariable.charAt(0) !== '$') {
                sassVariable = '$' + sassVariable;
            }
            return sassVariable.toLowerCase();
        }

        function getVariable(variables, attributeVal) {
            for (var i = 0, l = variables.length; i < l; i++) {
                if (variables[i].Alias === attributeVal) {
                    return variables[i];
                }
            }
        }

        function setOrder(variables) {
            for (var i = 0, l = variables.length; i < l; i++) {
                variables[i].Order = i;
            }
        }

        function resetVariable(variables, idx) {

            variables[idx].Value = variables[idx].DefaultVal;
        }

        function deleteVariable(variables, idx) {

            localizationService.localize('content_nestedContentDeleteItem').then(function (value) {
                if (confirm(value)) {
                    variables.splice(idx, 1);
                }
            });
        }

        function sortableOptions() {
            return {
                axis: 'y',
                containment: 'parent',
                cursor: 'move',
                items: '> div.control-group',
                tolerance: 'pointer',
                handle: '.handle'
            };
        }

        function getColorPalette(alias) {
            return $http.get(`${serviceRoot}GetColorPalette?alias=${alias}`);
        }

        function getGradientPalette(alias) {
            return $http.get(`${serviceRoot}GetGradientPalette?alias=${alias}`);
        }

    }
    angular.module('umbraco.services')
        .factory('amplifyService', amplifyService);
})();