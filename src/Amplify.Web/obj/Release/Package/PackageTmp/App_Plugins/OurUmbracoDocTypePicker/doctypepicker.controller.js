angular.module("umbraco")
    .controller("OurUmbracoDocTypePicker.DocTypePicker", function ($scope, $http) {

        //setup the default config
        var config = {
            items: [],
            multiple: false,
            useToggle: false,
            elementFilter: 0,
            templateFilter: 0,
            filterTerm: ''
        };

        //map the user config
        angular.extend(config, $scope.model.config);

        //map back to the model
        $scope.model.config = config;


        
        $http.get("backoffice/OurUmbracoDocTypePicker/DocTypePickerApi/GetAllDocumentTypes", { params: {
                    elementFilter: $scope.model.config.elementFilter,
                    filterTerm: $scope.model.config.filterTerm,
                    templateFilter: $scope.model.config.templateFilter
                }
            })
            .then(function (response) {

            $scope.model.config.items = response.data;

            if ($scope.model.config.multiple) {
                for (var i = 0; i < $scope.model.value.length; i++) {
                    for (var j = 0; j < $scope.model.config.items.length; j++) {
                        if ($scope.model.value[i] === $scope.model.config.items[j].id) {
                            $scope.model.config.items[j].checked = true;
                            break;
                        }
                    }
                }
            } else {
                for (var k = 0; k < $scope.model.config.items.length; k++) {
                    if ($scope.model.value === $scope.model.config.items[k].id) {
                        $scope.model.config.items[k].selected = true;
                        break;
                    }
                }
            }
        });

        //ensure this is a bool, old data could store zeros/ones or string versions
        $scope.model.config.multiple = Object.toBoolean($scope.model.config.multiple);
        $scope.model.config.useToggle = Object.toBoolean($scope.model.config.useToggle);


        function convertArrayToDictionaryArray(model) {
            //now we need to format the items in the dictionary because we always want to have an array
            var newItems = [];
            for (var i = 0; i < model.length; i++) {
                newItems.push({ id: model[i], sortOrder: 0, value: model[i] });
            }

            return newItems;
        }

        function convertObjectToDictionaryArray() {
            //now we need to format the items in the dictionary because we always want to have an array
            var newItems = [];
            var vals = _.values($scope.model.config.items);
            var keys = _.keys($scope.model.config.items);

            for (var i = 0; i < vals.length; i++) {
                var label = vals[i].value ? vals[i].value : vals[i];
                newItems.push({ id: keys[i], sortOrder: vals[i].sortOrder, value: label });
            }

            return newItems;
        }

        $scope.updateSingleDropdownValue = function () {
            $scope.model.value = [$scope.model.singleDropdownValue];
        };


        $scope.updateMultiToggle = function updateMultiToggle(item) {
            if ($scope.model.value === "") {
                $scope.model.value = [];
            }

            item.checked = !item.checked;

            if (item.checked) {
                $scope.model.value.push(item.id);
            } else {
                var index = $scope.model.value.indexOf(item.id);
                if (index !== -1) $scope.model.value.splice(index, 1);
            }

            // set to null for mandatory to work
            if ($scope.model.value.length === 0) {
                $scope.model.value = null;
            }
        };


        if (angular.isArray($scope.model.config.items)) {
            //PP: I dont think this will happen, but we have tests that expect it to happen..
            //if array is simple values, convert to array of objects
            if (!angular.isObject($scope.model.config.items[0])) {
                $scope.model.config.items = convertArrayToDictionaryArray($scope.model.config.items);
            }
        }
        else if (angular.isObject($scope.model.config.items)) {
            $scope.model.config.items = convertObjectToDictionaryArray($scope.model.config.items);
        }
        else {
            throw "The items property must be either an array or a dictionary";
        }

        //sort the values
        $scope.model.config.items.sort(function (a, b) { return (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0); });

        //now we need to check if the value is null/undefined, if it is we need to set it to "" so that any value that is set
        // to "" gets selected by default
        if ($scope.model.value === null || $scope.model.value === undefined) {
            if ($scope.model.config.multiple) {
                $scope.model.value = [];
            }
            else {
                $scope.model.value = "";
            }
        }

        // if we run in single mode we'll store the value in a local variable
        // so we can pass an array as the model as our PropertyValueEditor expects that
        $scope.model.singleDropdownValue = "";
        if (!Object.toBoolean($scope.model.config.multiple) && $scope.model.value) {
            $scope.model.singleDropdownValue = Array.isArray($scope.model.value) ? $scope.model.value[0] : $scope.model.value;
        }

        // if we run in multiple mode, make sure the model is an array (in case the property was previously saved in single mode)
        // also explicitly set the model to null if it's an empty array, so mandatory validation works on the client

        if ($scope.model.config.multiple && $scope.model.value) {
            $scope.model.value = !Array.isArray($scope.model.value) ? [$scope.model.value] : $scope.model.value;
            if ($scope.model.value.length === 0) {
                $scope.model.value = null;
            }
        }
    });