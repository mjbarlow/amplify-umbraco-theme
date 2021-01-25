function faLinksPickerController($scope, $http, $element, $sce) {
    const iconsDataUrl = '/App_Plugins/FaLinksPropertyEditor/icons.json';

    const styles = {
        brands: "fab",
        solid: "fas",
        regular: "far"
    }; 

    $scope.model.results = [];

    setTimeout(function () {
        var input = $element[0].querySelector("#falinks-search");
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

    $scope.className = function(iconCat, iconName) {
        return styles[iconCat] + " fa-" + iconName; 
    };

    $scope.formatData = function (data) {
       $scope.model.results = [];
        angular.forEach(data,
           function (icon, iconKey) {
               angular.forEach(icon.svg,
                   function(iconCat, iconCatKey) {
                       var item = {
                           label: icon.label,
                           svg: iconCat.raw,
                           terms: icon.search.terms,
                           className: $scope.className(iconCatKey, iconKey)
                       };
                       item.terms.push(icon.label);
                       $scope.model.results.push(item);
                   });
           });
   };                   
   
    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.load = function() {
        if ($scope.model.search === '') {
            return;
        }
        $scope.model.loading = true;    
        $http({
            method: 'GET',
            url: iconsDataUrl,
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
angular.module('umbraco').controller("FaLinks.Picker.Controller", faLinksPickerController);