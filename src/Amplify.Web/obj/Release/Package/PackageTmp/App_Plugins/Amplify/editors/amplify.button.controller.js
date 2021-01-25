
function amplifyButtonController($scope, angularHelper, iconHelper, editorService, entityResource, localizationService) {
    var vm = this;

    vm.add = add;
    vm.showPrompt = showPrompt;
    vm.hidePrompt = hidePrompt;
    vm.toggleShowSettings = toggleShowSettings;
    vm.remove = remove;
    vm.showSettings = false;
    vm.setIsLight = setIsLight;
    vm.setIsOutlined = setIsOutlined;
    vm.setIsInverted = setIsInverted;
    vm.setIsFullWidth = setIsFullWidth;

    vm.sortableOptions = {
        distance: 10,
        tolerance: 'pointer',
        opacity: 0.7,
        scroll: true,
        cursor: 'move',
        handle: "> .sort-handle "
    };

    vm.buttonTypes = [
        {
            "name": "Primary",
            "value": "is-primary"
        },
        {
            "name": "Link",
            "value": "is-link"
        },
        {
            "name": "Info",
            "value": "is-info"
        },
        {
            "name": "Success",
            "value": "is-success"
        },
        {
            "name": "Warning",
            "value": "is-warning"
        },
        {
            "name": "Danger",
            "value": "is-danger"
        },
        {
            "name": "White",
            "value": "is-white"
        },
        {
            "name": "Light",
            "value": "is-light"
        },
        {
            "name": "Dark",
            "value": "is-dark"
        },
        {
            "name": "Black",
            "value": "is-black"
        },
        {
            "name": "Text",
            "value": "is-text"
        }
    ];

    vm.buttonSizes   = [
        {
            "name": "Small",
            "value": "is-small"
        },
        {
            "name": "Normal",
            "value": "is-normal"
        },
        {
            "name": "Medium",
            "value": "is-medium"
        },
        {
            "name": "Large",
            "value": "is-large"
        }
    ];

    function setIsLight(item) {
        item.isLight = !item.isLight;
    }

    function setIsOutlined(item) {
        item.isOutlined = !item.isOutlined;
    }

    function setIsInverted(item) {
        item.isInverted = !item.isInverted;
    }

    function setIsFullWidth(item) {
        item.isFullWidth = !item.isFullWidth;
    }

    function add() {
        var item = {
            "buttonType": "is-primary", // button type
            "buttonSize": "is-normal", // button size / small / normal / default / large
            "isLight": false,
            "isInverted": false,
            "isFullWidth": false,
            "isOutlined": false,
            "className": "", // used for fontawesome class name
            "label": "",
            "link": []
        };
        $scope.model.value.push(item);
    }

    function showPrompt(item) {
        item.deletePrompt = true;
    }

    function toggleShowSettings() {
        console.log('showingSettings');
        vm.showSettings = !vm.showSettings;
    }

    function hidePrompt(item) {
        item.deletePrompt = false;
    }

    function remove($index, item) {
        $scope.model.value.splice($index, 1);
    }

    if (!$scope.model.value) {
        $scope.model.value = [];
        vm.add();
    }

    $scope.addIcon = function (item) {
        var faPicker = {
            title: "Font Awesome Icon Search",
            view: "/App_Plugins/FaLinksPropertyEditor/faLinks.picker.html",
            size: "small",
            submit: function (model) {
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
        item.className = "";
        item.label = "";
    };

    var currentForm = angularHelper.getCurrentForm($scope);

    $scope.model.value.forEach(function (item) {
        item.link.icon = iconHelper.convertFromLegacyIcon(item.link.icon);
    });

    $scope.openLinkPicker = function (item, link) {

        // pass in the link set to target
        var target = link ? {
            name: link.name,
            anchor: link.queryString,
            udi: link.isMedia ? null : link.udi,
            url: link.url,
            target: link.target
        } : null;

        var linkPicker = {
            // could be link or null
            currentTarget: target,
            submit: function (model) {
                if (model.target.url || model.target.anchor) {
                    // if an anchor exists, check that it is appropriately prefixed
                    if (model.target.anchor && model.target.anchor[0] !== '?' && model.target.anchor[0] !== '#') {
                        model.target.anchor = (model.target.anchor.indexOf('=') === -1 ? '#' : '?') + model.target.anchor;
                    }
                    if (link) {
                        if (link.isMedia && link.url === model.target.url) {
                            // we can assume the existing media item is changed and no new file has been selected
                            // so we don't need to update the udi and isMedia fields
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
                            link.published = (data.metaData && data.metaData.IsPublished === false && entityType === "Document") ? false : true;
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
                $scope.amplifyButtonForm.minCount.$setValidity("minCount", false);
            }
            else {
                $scope.amplifyButtonForm.minCount.$setValidity("minCount", true);
            }

            if ($scope.model.config && $scope.model.config.maxNumber && parseInt($scope.model.config.maxNumber) < $scope.model.value.length) {
                $scope.amplifyButtonForm.maxCount.$setValidity("maxCount", false);
            }
            else {
                $scope.amplifyButtonForm.maxCount.$setValidity("maxCount", true);
            }
           vm.sortableOptions.disabled = $scope.model.value.length === 1;
        }
    );

    $scope.removeLink = function (item) {
        item.link = [];
    };
}
angular.module('umbraco').controller("amplify.Button.Controller", amplifyButtonController);
