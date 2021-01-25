function optionButtonsPropertyEditorController($scope, $http, $window) {
    $scope.setValue = function (value) {
        $scope.model.value = value;
    };
    $scope.setClasses = function (value) {
        
        let classes = {
            'btn-selection': $scope.model.value === value,
            'btn-info': $scope.model.value !== value
        };
        return classes;
    };
}
angular.module('umbraco').controller("optionButtonsPropertyEditorController", optionButtonsPropertyEditorController);