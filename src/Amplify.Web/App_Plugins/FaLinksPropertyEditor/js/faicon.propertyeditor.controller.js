
function faIconPropertyEditorController($scope, editorService, $sce) {
    var vm = this;
    vm.add = add;
    vm.showPrompt = showPrompt;
    vm.hidePrompt = hidePrompt;
    vm.remove = remove;

    function add() {
        const  item = {
            "className": "",
            "svg": "",
            "label": ""
        };
        $scope.model.value.push(item);
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

    const sortableOptions = {
        distance: 10,
        tolerance: "pointer",
        opacity: 0.7,
        scroll: true,
        cursor: "move",
        handle: "> .list-view-falink__sort-handle"
    };

    vm.sortableOptions = sortableOptions;

    if (!$scope.model.value) {
        $scope.model.value = [];
        vm.add();
    }

    $scope.addIcon = function (item) {
        const faPicker = {
            title: "Font Awesome Icon Search",
            view: "/App_Plugins/FaLinksPropertyEditor/faLinks.picker.html",
            size: "small",
            submit: function (model) {
                item.svg = model.svg;
                item.className = model.className;
                item.label = model.label;
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };
        editorService.open(faPicker);
    };

    $scope.removeIcon = function(item) {
        item.svg = "";
        item.className = "";
        item.label = "";
    };

    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.$watch(
        function () {
            return $scope.model.value.length;
        },
        function () {

            if ($scope.model.config && $scope.model.config.minNumber && parseInt($scope.model.config.minNumber) > $scope.model.value.length) {
                $scope.faIconForm.minCount.$setValidity("minCount", false);
            }
            else {
                $scope.faIconForm.minCount.$setValidity("minCount", true);
            }

            if ($scope.model.config && $scope.model.config.maxNumber && parseInt($scope.model.config.maxNumber) < $scope.model.value.length) {
                $scope.faIconForm.maxCount.$setValidity("maxCount", false);
            }
            else {
                $scope.faIconForm.maxCount.$setValidity("maxCount", true);
            }
            vm.sortableOptions.disabled = $scope.model.value.length === 1;
        }
    );

}
angular.module("umbraco").controller("FaIcon.PropertyEditor.Controller", faIconPropertyEditorController);
