﻿function faLinksPropertyEditorController($scope, angularHelper, iconHelper, editorService, entityResource, localizationService, $sce) {
    var vm = this;

    vm.add = add;
    vm.showPrompt = showPrompt;
    vm.hidePrompt = hidePrompt;
    vm.remove = remove;
    vm.hideIcon = false;

    function add() {
        const item = {
            "primaryClass": "",
            "secondaryClass": "",
            "className": "",
            "svg": "",
            "label": "",
            "link": []
        };
        $scope.model.value.push(item);
    }

    function showPrompt(item) {
        item.deletePrompt = true;
    }

    function hidePrompt(item) {
        item.deletePrompt = false;
    }

    function remove($index, item) {
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

    $scope.removeIcon = function (item) {
        item.svg = "";
        item.className = "";
        item.label = "";
    };

    $scope.trustAsHtml = $sce.trustAsHtml;

    var currentForm = angularHelper.getCurrentForm($scope);

    $scope.model.value.forEach(function (item) {
        item.link.icon = iconHelper.convertFromLegacyIcon(item.link.icon);
    });

    $scope.openLinkPicker = function (item, link) {

        const target = link ? {
            name: link.name,
            anchor: link.queryString,
            udi: link.isMedia ? null : link.udi,
            url: link.url,
            target: link.target
        } : null;

        const linkPicker = {

            currentTarget: target,
            submit: function (model) {
                if (model.target.url || model.target.anchor) {

                    if (model.target.anchor && model.target.anchor[0] !== "?" && model.target.anchor[0] !== "#") {
                        model.target.anchor = (model.target.anchor.indexOf("=") === -1 ? "#" : "?") + model.target.anchor;
                    }
                    if (link) {
                        if (link.isMedia && link.url === model.target.url) {

                        } else {
                            link.udi = model.target.udi;
                            link.isMedia = model.target.isMedia;
                        }

                        link.name = model.target.name || model.target.url || model.target.anchor;
                        link.queryString = model.target.anchor;
                        link.target = model.target.target;
                        link.url = model.target.url;
                    } else {
                        link = {
                            isMedia: model.target.isMedia,
                            name: model.target.name || model.target.url || model.target.anchor,
                            queryString: model.target.anchor,
                            target: model.target.target,
                            udi: model.target.udi,
                            url: model.target.url
                        };
                        item.link = [];
                        item.link.push(link);
                    }

                    if (link.udi) {
                        var entityType = link.isMedia ? "media" : "document";

                        entityResource.getById(link.udi, entityType).then(function (data) {
                            link.icon = iconHelper.convertFromLegacyIcon(data.icon);
                            link.published =
                                (data.metaData && data.metaData.IsPublished === false && entityType === "Document")
                                    ? false
                                    : true;
                            link.trashed = data.trashed;
                            if (link.trashed) {
                                item.url = localizationService.dictionary.general_recycleBin;
                            }
                        });
                    } else {
                        link.icon = "icon-link";
                        link.published = true;
                    }

                    currentForm.$setDirty();
                }
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };
        editorService.linkPicker(linkPicker);
    };

    $scope.$watch(
        function () {
            return $scope.model.value.length;
        },
        function () {
            if ($scope.model.config && $scope.model.config.minNumber && parseInt($scope.model.config.minNumber) > $scope.model.value.length) {
                $scope.faLinksForm.minCount.$setValidity("minCount", false);
            }
            else {
                $scope.faLinksForm.minCount.$setValidity("minCount", true);
            }

            if ($scope.model.config && $scope.model.config.maxNumber && parseInt($scope.model.config.maxNumber) < $scope.model.value.length) {
                $scope.faLinksForm.maxCount.$setValidity("maxCount", false);
            }
            else {
                $scope.faLinksForm.maxCount.$setValidity("maxCount", true);
            }
            vm.sortableOptions.disabled = $scope.model.value.length === 1;
        }
    );

    $scope.removeLink = function (item) {
        item.link = [];
    };

    vm.init = function () {
        if ($scope.model.config && $scope.model.config.hideIconPicker) {
            vm.hideIcon = $scope.model.config.hideIconPicker == true;
        }
    }
    vm.init();
}
angular.module("umbraco").controller("FaLinks.PropertyEditor.Controller", faLinksPropertyEditorController);
