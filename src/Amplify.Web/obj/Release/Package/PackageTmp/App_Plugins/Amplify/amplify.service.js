/**
 * @ngdoc
 * @name amplifyService
 * @requires $http
 * 
 * @description provides the link to the amplify api elements
 *              required for the dashboard to function
 */

(function () {
    'use strict';

    function amplifyService($http, localizationService, notificationsService) {

        var serviceRoot = Umbraco.Sys.ServerVariables.Amplify.AmplifyService;

        var service = {
            getFonts: getFonts,
            getFontStacks: getFontStacks,
            saveFonts: saveFonts,
            saveFontStacks: saveFontStacks,
            saveVariables: saveVariables,
            saveGradients: saveGradients,
            saveSassVariables: saveSassVariables,
            buildSass: buildSass,
            getVariables: getVariables,
            getSassVariables: getSassVariables,
            hslToHex: hslToHex,
            getSwatch: getSwatch,
            getGradients: getGradients,
            compareValues: compareValues,
            filterVariables: filterVariables,
            toSassVariable: toSassVariable,
            getVariable: getVariable,
            setOrder: setOrder,
            resetVariable: resetVariable,
            deleteVariable: deleteVariable,
            sortableOptions: sortableOptions
        };

        return service;

        function getFonts() {
            return $http.get(serviceRoot + 'GetFonts');
        }

        function getFontStacks() {
            return $http.get(serviceRoot + 'GetFontStacks');
        }

        function saveFonts(settings) {
            return $http.post(serviceRoot + 'SaveFonts', settings);
        }

        function saveFontStacks(settings) {
            return $http.post(serviceRoot + 'SaveFontStacks', settings);
        }

        function saveVariables(settings) {
            return $http.post(serviceRoot + 'SaveVariables', settings);
        }

        function saveGradients(settings) {
            return $http.post(serviceRoot + 'SaveGradients', settings);
        }

        function saveSassVariables(settings) {
            return $http.post(serviceRoot + 'SaveSassVariables', settings);
        }

        function buildSass() {
            $http.post(serviceRoot + 'BuildSass')
                .then(function (response) {
                    if (response.data) {
                        notificationsService.error('Saving', response.data);
                    }
                    else {
                        notificationsService.success('Success', 'Sass Built');
                    }

                }, function (error) {
                    notificationsService.error('Saving', error.data.Message);
                });
        }

        function getVariables() {
            return $http.get(serviceRoot + 'GetVariables');
        }

        function getSwatch() {
            return $http.get(serviceRoot + 'GetSwatch');
        }

        function getGradients() {
            return $http.get(serviceRoot + 'GetGradients');
        }

        function getSassVariables() {
            return $http.get(serviceRoot + 'GetSassVariables');
        }

        function hslToHex(color) {
            let regexp = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/g;
            let res = regexp.exec(color).slice(1);

            let h1 = parseInt(res[0]);
            let s1 = parseInt(res[1]);
            let l1 = parseInt(res[2]);

            let h = h1 /= 360;
            let s = s1 /= 100;
            let l = l1 /= 100;

            let r, g, b;
            if (s === 0) {
                r = g = b = l; 
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            const toHex = x => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        function compareValues(key, order = 'asc') {
            return function innerSort(a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    // property doesn't exist on either object
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
            let filteredVariables = [];
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
    }
    angular.module('umbraco.services')
        .factory('amplifyService', amplifyService);
})();