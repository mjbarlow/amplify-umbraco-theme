(function () {


    // polyfill for matches and closest
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
    if (!Element.prototype.closest) Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };



    //execute init() on document ready
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        listen();
    } else {
        document.addEventListener("DOMContentLoaded", listen);
    }

    function listen() {
        if (typeof umbracoFormsCollection === "undefined") {
            //this will occur if this js file is loaded before the inline scripts, in which case
            //we'll listen for the inline scripts to execute a custom event.
            document.addEventListener("umbracoFormLoaded", init);
        }
        else {
            initCollection(umbracoFormsCollection);
        }
    }

    function initCollection(formsCollection) {
        configureUmbracoFormsValidation();

        for (var i = 0; i < formsCollection.length; i++) {
            init({ form: JSON.parse(decodeURI(formsCollection[i])) });
        }
    }

    function init(e) {

        var formItem = e.form;

        var forms = document.querySelectorAll('.umbraco-forms-form');

        for( var i = 0; i < forms.length; i++) {
            var form = forms[i];

            dependencyCheck(form);

            var page = form.querySelector('.umbraco-forms-page');
            var conditions = new UmbracoFormsConditions(page,
                formItem.fieldSetConditions,
                formItem.fieldConditions,
                formItem.recordValues);
            conditions.watch();
        };
    }

    /** Configures the jquery validation for Umbraco forms */
    function configureUmbracoFormsValidation() {

        if (window.aspnetValidation !== undefined) {
            // Asp-net validation setup:

            var validationService = new aspnetValidation.ValidationService();

            // TODO: equivilant to this:
            /*
            $.validator.setDefaults({
                ignore: ":hidden"
            });
            */
           
            function required(value, element, params) {
                // Handle single and multiple checkboxes:
                if(element.type.toLowerCase() === "checkbox") {
                    var allCheckboxesOfThisName = element.form.querySelectorAll("input[name='"+element.name+"']");
                    for (var i=0; i<allCheckboxesOfThisName.length; i++) {
                        if (allCheckboxesOfThisName[i].checked === true) {
                            return true;
                        }
                    }
                    return false;
                }
                return Boolean(value);
            }
            validationService.addProvider("requiredcb", required);
            validationService.addProvider("required", required);// this will go instead of the build-in required.


            function umbracoforms_regex(value, element, params) {
                if (!value || !params.pattern) {
                    return true;
                }
        
                let r = new RegExp(params.pattern);
                return r.test(value);
            }
            validationService.addProvider("umbracoforms_regex", umbracoforms_regex);

            function wrapProviderWithIgnorerBehaviour(provider) {
                return async function(value, element, params) {
                    
                    // If field is hidden we ignorer the validation.
                    if(element.offsetParent === null) {
                        return true;
                    }
                    return provider(value, element, params);
                }
            }

            // we can only incept with default validator if we do it after bootstrapping but before window load event triggers validationservice.
            window.addEventListener('load', event => {

                // Wrap all providers with ignorer hidden fields logic:
                for (var key in validationService.providers) {
                    validationService.providers[key] = wrapProviderWithIgnorerBehaviour(validationService.providers[key]);
                }
            });

            // bootstrap validation service.
            validationService.bootstrap();
            
            
            
             

        } else if ($ && $.validator !== undefined) {
            //Jquery validation setup

            $.validator.setDefaults({
                ignore: ":hidden"
            });

            $.validator.unobtrusive.adapters.addBool("requiredcb", "required");


            $.validator.addMethod("umbracoforms_regex", function (value, element) {

                var regex = $(element).attr("data-regex");
                var val = $(element).val();
                if (val.length === 0) {
                    return true;
                }
                return val.match(regex);
            });

            $.validator.unobtrusive.adapters.addBool("regex", "umbracoforms_regex");

            var submitInputs = document.querySelectorAll(".umbraco-forms-form input[type=submit]:not(.cancel)");
            for (var i = 0; i < submitInputs.length; i++) {
                var input = submitInputs[i];
                input.addEventListener("click", function (evt) {
                    evt.preventDefault();
                    var frm = $(this).closest("form");
                    frm.validate();
                    if (frm.valid()) {
                        frm.submit();
                        this.setAttribute("disabled", "disabled");
    
                    }
                }.bind(input));
            }
        }

    }

    /**
     * method to determine if Umbraco Forms can run and has the required dependencies loaded
     * @param {Form Element} formEl the element of the form
     */
    function dependencyCheck(formEl) {
        //Only perform check if the global 'Umbraco.Sys' is null/undefined
        //If present means we are in backoffice & that this is being rendered as a macro preview
        //We do not need to perform this check here
        if (typeof Umbraco !== "undefined" && typeof Umbraco.Sys !== "undefined") {
            return;
        }
        else {

            var errorElement = document.createElement("div");
            errorElement.className = "umbraco-forms missing-library";
            errorElement.style.color = "#fff";
            errorElement.style.backgroundColor = "#9d261d";
            errorElement.style.padding = "15px";
            errorElement.style.margin = "10px 0";
            var errorMessage = "";

            //Ensure umbracoForm is not null
            if (formEl) {

                //Check to see if the message for the form has been inserted already
                var checkForExistinhgErr = formEl.getElementsByClassName('umbraco-forms missing-library');
                if (checkForExistinhgErr.length > 0) {
                    return;
                }

                var hasValidationFramework = false;

                if (window.jQuery && $ && $.validator !== undefined) {
                    hasValidationFramework = true;
                } else if (window.aspnetValidation !== undefined) {
                    hasValidationFramework = true;
                }

                if(hasValidationFramework === false) {
                    errorMessage = errorMessage + "Umbraco Forms requires a validation framework to run, please read documentation for posible options.";
                }

                if (errorMessage !== "") {
                    errorElement.innerHTML = errorMessage + '<br/> <a href="https://our.umbraco.org/documentation/products/umbracoforms/developer/Prepping-Frontend/" target="_blank" style="text-decoration:underline; color:#fff;">See Umbraco Forms Documentation</a>';

                    formEl.insertBefore(errorElement, formEl.childNodes[0]);
                }
            }
        }
    }

    /**
     * Class to handle Umbraco Forms conditional statements
     * @param {any} form a reference to the form
     * @param {any} fieldsetConditions a reference to the fieldset conditions
     * @param {any} fieldConditions a reference to the field conditions
     * @param {any} values the form values
     * @return {Object} reference to the created class
     */
    function UmbracoFormsConditions(form, fieldsetConditions, fieldConditions, values) {

        //our conditions "class" - must always be newed to work as it uses a form instance to operate on
        //load all the information from the dom and serverside info and then the class will take care of the rest

        var self = {};
        self.form = form;
        self.fieldsetConditions = fieldsetConditions;
        self.fieldConditions = fieldConditions;
        self.values = values;
        self.dataTypes = {};

        //Iterates through all the form elements found on the page to update the registered value
        function populateFieldValues(page, formValues, dataTypes) {

            var selectFields = page.querySelectorAll("select");
            for(var i=0; i<selectFields.length; i++) {
                var field = selectFields[i];
                formValues[field.getAttribute("id")] = field.querySelector("option[value='" + field.value + "']").innerText;
                dataTypes[field.getAttribute("id")] = "select";
            };

            var textareaFields = page.querySelectorAll("textarea");
            for(var i=0; i<textareaFields.length; i++) {
                var field = textareaFields[i];
                formValues[field.getAttribute("id")] = field.value;
                dataTypes[field.getAttribute("id")] = "textarea";
            };

            // clear out all saved checkbox values to we can safely append
            var checkboxFields = page.querySelectorAll("input[type=checkbox]");
            for(var i=0; i<checkboxFields.length; i++) {
                var field = checkboxFields[i];
                formValues[field.getAttribute("name")] = null;
                dataTypes[field.getAttribute("id")] = "checkbox";
            };

            //$page.find("input").each(function () {
            var inputFields = page.querySelectorAll("input");
            for(var i=0; i<inputFields.length; i++) {
                var field = inputFields[i];

                if (field.getAttribute('type') === "text" || field.getAttribute("type") === "hidden") {
                    formValues[field.getAttribute("id")] = field.value;
                    dataTypes[field.getAttribute("id")] = "text";
                }

                if (field.getAttribute('type') === "radio") {
                    if (field.matches(':checked')) {
                        formValues[field.getAttribute("name")] = field.value;
                        dataTypes[field.getAttribute("id")] = "radio";
                    }
                }

                if (field.getAttribute("type") === "checkbox") {
                    if (field.getAttribute("id") !== field.getAttribute("name")) {
                        if (field.matches(":checked")) {
                            if (formValues[field.getAttribute("name")] === null) {
                                formValues[field.getAttribute("name")] = field.value;
                            }
                            else {
                                formValues[field.getAttribute("name")] += ";;" + field.value;
                            }
                        }
                    }
                    else {
                        formValues[field.getAttribute("name")] = (field.matches(":checked") ? "true" : "false");
                    }
                }
            };
        }

        /* Public api */

        self.operators = {
            Is: function (value, expected, dataType) {
                if ((value || "") === expected) {
                    return true;
                }
                if (value == null) {
                    return (expected == value);
                }

                if (dataType === "checkbox") {
                    if (expected.toUpperCase() === "TRUE" || expected.toUpperCase() === "ON") {
                        expected = "true"
                    } else if (expected.toUpperCase() === "FALSE" || expected.toUpperCase() === "OFF") {
                        expected = "false"
                    }
                }

                var values = value.split(';;');
                var matchingExpected = values.filter(
                    function (o) {
                        return o === expected;
                    });
                return matchingExpected.length > 0;
            },
            IsNot: function (value, unexpected, dataType) {
                if (value == null) {
                    return (unexpected != value);
                }
                var values = value.split(';;');
                var matchingUnexpected = values.filter(
                    function (o) {
                        return o === unexpected;
                    });

                if (dataType === "checkbox") {
                    if (unexpected.toUpperCase() === "TRUE" || unexpected.toUpperCase() === "ON") {
                        unexpected = "true"
                    } else if (unexpected.toUpperCase() === "FALSE" || unexpected.toUpperCase() === "OFF") {
                        unexpected = "false"
                    }
                }
                return (value || "") !== unexpected && matchingUnexpected.length === 0;
            },
            GreaterThen: function (value, limit, dataType) {
                return parseInt(value) > parseInt(limit);
            },
            LessThen: function (value, limit, dataType) {
                return parseInt(value) < parseInt(limit);
            },
            StartsWith: function (value, criteria, dataType) {
                return value && value.indexOf(criteria) === 0;
            },
            EndsWith: function (value, criteria, dataType) {
                return value && value.indexOf(criteria) === value.length - criteria.length;
            },
            Contains: function (value, criteria, dataType) {
                return value && value.indexOf(criteria) > -1;
            }
        };

        self.watch = function () {
            // This is a special case for pikaday
            // The only way around to pickup the value, for now, is to 
            // subscribe to blur events 
            var datepickerfields = self.form.querySelectorAll('.datepickerfield');
            for(var i = 0; i < datepickerfields.length; i++) {
                var field = datepickerfields[i];
                field.addEventListener('blur', function () {
                    if(this.value===""){
                        // Here comes the hack
                        // Force the hidden datepicker field the datepicker field
                        var id = this.getAttribute("id");
                        var hiddenDatePickerField = id.substr(0, id.length-2);
                        self.values[hiddenDatePickerField]="";
                        document.getElementsById(hiddenDatePickerField).value="";// sadly we cant use querySelector with current mark-up (would need to prefix IDs)
                    }
    
                    populateFieldValues(self.form, self.values, self.dataTypes);
                    //process the conditions
                    self.run();
                }.bind(field));
            }
            //subscribe to change events
            var changeablefields = self.form.querySelectorAll("input, textarea, select");
            for(var i = 0; i < changeablefields.length; i++) {
                var field = changeablefields[i];
                field.addEventListener("change", function () {
                    populateFieldValues(self.form, self.values, self.dataTypes);
                    //process the conditions
                    self.run();
                }.bind(field));
            }

            //register all values from the current fields on the page
            populateFieldValues(self.form, self.values, self.dataTypes);

            //the initial run-through of all the conditions
            self.run();
        };

        self.run = function () {
            var fsId,
                fieldId,

                /*
                fsConditions = params.fsConditions || {},
                fieldConditions = params.fieldConditions || {},
                values = params.values || {},*/

                cachedResults = {};

            function evaluateRuleInstance(rule) {
                var value = self.values[rule.field],
                    dataType = self.dataTypes[rule.field],
                    func = self.operators[rule.operator],
                    result = value !== null && func(value, rule.value, dataType);
                return result;
            }

            function evaluateRule(rule) {
                var dependencyIsVisible = true;

                if (self.fieldConditions[rule.field]) {
                    dependencyIsVisible = isVisible(rule.field, self.fieldConditions[rule.field]);
                }

                if (dependencyIsVisible) {
                    return evaluateRuleInstance(rule);
                }
                else {
                    return false;
                }
            }

            function evaluateCondition(id, condition) {
                // This was once pretty. Now it needs refactoring again. :)

                var any = condition.logicType === "Any",
                    all = condition.logicType === "All",
                    fieldsetVisibilities = {},
                    hasHiddenFieldset = false,
                    success = true,
                    rule,
                    i;

                for (i = 0; i < condition.rules.length; i++) {
                    rule = condition.rules[i];

                    if (id === rule.field || id === rule.fieldsetId) {
                        throw new Error("Field or fieldset " + id + " has a condition on itself.");
                    }

                    if (fieldsetVisibilities[rule.fieldsetId] !== undefined) {
                        continue;
                    }

                    if (self.fieldsetConditions[rule.fieldsetId]) {

                        fieldsetVisibilities[rule.fieldsetId] =
                            isVisible(rule.fieldsetId, self.fieldsetConditions[rule.fieldsetId]);

                        if (!fieldsetVisibilities[rule.fieldsetId]) {
                            hasHiddenFieldset = true;
                        }
                    }
                    else {
                        fieldsetVisibilities[rule.fieldsetId] = true;
                    }
                }

                if (all && hasHiddenFieldset) {
                    return false;
                }

                for (i = 0; i < condition.rules.length; i++) {
                    rule = condition.rules[i];

                    if (fieldsetVisibilities[rule.fieldsetId]) {
                        success = evaluateRule(condition.rules[i]);
                    }
                    else {
                        success = false;
                    }

                    if (any && success) {
                        break;
                    }
                    if (all && !success) {
                        break;
                    }
                }
                return success;
            }

            function evaluateConditionVisibility(id, condition) {
                var show = condition.actionType === "Show",
                    cachedResult = cachedResults[id];

                var success;
                if (cachedResult === undefined) {
                    cachedResults[id] = show; // set default value to avoid circular issues
                    success = (cachedResults[id] = evaluateCondition(id, condition));
                } else {
                    success = cachedResult;
                }

                var visible = !(success ^ show);
                return visible;
            }

            function isVisible(id, condition) {
                if (condition) {
                    return evaluateConditionVisibility(id, condition);
                }
                return true;
            }

            function handleCondition(element, id, condition, type) {
                var shouldShow = isVisible(id, condition);
                if (shouldShow) {
                    element.style.display = "";
                }
                else {
                    element.style.display = "none";
                }
            }

            for (fsId in self.fieldsetConditions) {
                if (self.fieldsetConditions.hasOwnProperty(fsId)) {
                    handleCondition(document.getElementById(fsId), fsId, self.fieldsetConditions[fsId], "Fieldset");// sadly we cant use querySelector with current mark-up (would need to prefix IDs)
                }
            }

            for (fieldId in self.fieldConditions) {
                if (self.fieldConditions.hasOwnProperty(fieldId)) {
                    handleCondition(document.getElementById(fieldId).closest(".umbraco-forms-field"),// sadly we cant use querySelector with current mark-up (would need to prefix IDs)
                        fieldId,
                        self.fieldConditions[fieldId],
                        "Field");
                }
            }
        };

        return self;
    }
})();