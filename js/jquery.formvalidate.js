/* 
 * Plugin to validate forms
 * @author Alvaro JosÃ© AgÃ¡mez Licha, Johann Paul EchavarrÃ­a Zapata
 */
(function ($) {
    'use strict';

    function checkValidations(dataValidations, element) {
        var validationMap = {
            "integer": ["range", "enum"],
            "number": ["range", "enum"],
            "alnum": ["email", "enum"],
            "alpha": ["enum"],
            "range": ["integer", "number", "enum"],
            "enum": ["integer", "number", "alnum", "alpha"],
            "email": ["alnum", "enum"],
            "regex": ["integer", "number", "alnum", "alpha", "email"]
        };

        /** 
         * The required validation match with every other, then we don't need
         * worry about it
         */
//        var index = dataValidations.indexOf('required');
        var index = $.inArray('required', dataValidations);
        var head = dataValidations.slice(0, index);
        var tail = dataValidations.slice(index + 1);
        dataValidations = head.concat(tail);

        // Takes the first validation like a pivot to compare
        var pivot = dataValidations.shift();
        if (dataValidations.length > 0) {
            for (var index = 0; index < dataValidations.length; index++) {
//                if (-1 === validationMap[pivot].indexOf(dataValidations[index])) {
                if (-1 === $.inArray(dataValidations[index], validationMap[pivot])) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     *
     * @returns {String}
     */
    function generateId(stringLength) {
        var chars = "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
            id = '';

        if (stringLength === undefined) {
            stringLength = 8;
        }

        for (var index = 0; index < stringLength; index++) {
            var randonNumber = Math.floor(Math.random() * chars.length);
            id += chars.substring(randonNumber, randonNumber + 1);
        }

        return id;
    }

    /**
     * 
     * @param {Aarray} validations
     * @returns {Array}
     */
    function getValidationsArray(validations)
    {
        var result = [];
        for (var index = 0; index < validations.length; index++) {
            result.push(validations[index].name);
        }
    
        return result;
    }

    /**
     * Hide the error message for an element
     * 
     * @param {DOMElement} element
     * @returns {void}
     */
    function hideError(element) {
//        $(element).css({"border": ''});        
        $(element).removeClass("form-invalid-field");
//        $(element).next(".form-invalid-message").remove();
//        $(":input[name=" + element.name + "]:last-child")
//            .next(".form-invalid-message").remove();
        $("#" + $(element).data("iconUniqueId")).remove();
//        $(element).next(".form-invalid-tooltip").remove();
    }

    /**
     * Validates whether the value of an element is alphanumeric
     * 
     * @param {DOMElement} element
     * @returns {boolean}
     */
    function isValidAlnum(element) {
        var pattern = /^[a-zA-z0-9]+$/;

        try {
            if (!pattern.test(element.value)) {
                showError(element, 'alnum');
                return false;
            }

            return true;
        } catch (Exception) {
            return false;
        }
    }

    /**
     * Validates whether the value of an element is alphabetic
     * 
     * @param {DOMElement} element
     * @returns {boolean}
     */
    function isValidAlpha(element) {
        var pattern = /^[a-zA-Z]+$/;

        try {
            if (!pattern.test(element.value)) {
                showError(element, 'alpha');
                return false;
            }

            return true;
        } catch (Exception) {
            return false;
        }
    }

    /**
     * Validates whether the value of an element is an email
     * 
     * @param {DOMElement} element
     * @returns {boolean}
     */
    function isValidEmail(element) {
        var pattern = /(^[0-9a-zA-Z]+(?:[._][0-9a-zA-Z]+)*)@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;

        try {
            if (!pattern.test(element.value)) {
                showError(element, 'email');
                return false;
            }

            return true;
        } catch (Exception) {
            return false;
        }
    }

    /**
     * 
     * @param {DOMElement} element
     * @param {Array} params
     * @returns {Boolean}
     */
    function isValidEnum(element, params) {
//        if (-1 === params.indexOf(element.value)) {
        if (-1 === $.inArray(element.value, params)) {
            showError(element, 'enum');
            return false;
        }

        return true;
    }

    /**
     * Validates whether the value of an element is an integer
     * 
     * @param {DOMElement} element
     * @returns {boolean}
     */
    function isValidInteger(element) {
        if ((undefined === element.value) || (null === element.value)) {
            return false;
        }

        if (0 !== element.value % 1) {
            showError(element, 'integer');
            return false;
        }

        return true;
    }

    /**
     * Validates whether the value of an element is an number
     * 
     * @param {DOMElement} element
     * @returns {boolean}
     */
    function isValidNumber(element) {
        if (isNaN(parseFloat(element.value)) && isFinite(element.value)) {
            showError(element, 'number');
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {DOMElement} element
     * @param {integer} min
     * @param {integer} max
     * @returns {Boolean}
     */
    function isValidRange(element, min, max)
    {
        // TODO Validar que min y max sean enteros
        if (element.value < min || element.value > max) {
            showError(element, 'range');
            return false;
        }
    
        return true;
    }

    /**
     * 
     * @param {DOMElement} element
     * @param {string} expresion
     * @returns {Boolean}
     */
    function isValidRegex(element, expresion) {
        var regExp = new RegExp(expresion);

        if (!regExp.test(element.value)) {
            showError(element, 'regex');
            return false;
        }

        return true;
    }

    /**
     * Validates whether an required element has a value
     * 
     * @param {DOMElement} element
     * @returns {boolean} TRUE on error, FALSE otherwise
     */
    function isValidRequired(element) {
        var errorFlag = true;

        switch (element.type) {
            case "checkbox":
            case "radio":
                if (0 === $(':input[name="' + element.name + '"]:checked', element.form).length) {
                    errorFlag = false;                    
                }

                break;

            case 'password':
            case 'textarea':
            case 'text':
                if ('' === $.trim($(element).val())) {
                    errorFlag = false;
                }

                break;

            case 'select-one':
                if ('' === $('option:selected', element).val()) {
                    errorFlag = false;
                }

                break;

            case 'select-multiple':
                if (0 === $('option:selected', element).length) {
                    errorFlag = false;
                }

                break;
        }

        if (!errorFlag) {
            showError(element, 'required');
        }

        return errorFlag;
    }

    /**
     * 
     * @param {Array} validations Validations to parse
     * @returns {object}
     */
    function parseValidations(validations) {
        var parsed = [];

        $(validations).each(function(index, validation) {
//            var beginIndex = validation.indexOf('[');
            var beginIndex = $.inArray('[', validation);
            if (-1 !== beginIndex) {
                var endIndex = validation.lastIndexOf(']');

                if (-1 !== endIndex) {
                    var params = validation.substring(beginIndex + 1, endIndex);

                    if (-1 !== params.indexOf("-")) {
                        params = params.split("-");
                    } else {
                        if (-1 !== params.indexOf(",")) {
                            params = params.split(",");
                        }
                    }

                    parsed.push({
                        "name" : validation.substring(0, beginIndex),
                        "params": params
                    });
                } else {
                    return false;
                }
            } else {
                parsed.push({
                    "name" : validation,
                    "params": null
                });
            }
        });

        return parsed;
    }

    /**
     * 
     * @param {string} value
     * @param {Array} validations
     * @returns {integer}
     */
    function searchValidation(value, validations)
    {
        for (var index = 0; index < validations.length; index++) {
            if (validations[index].name === value) {
                return index;
            }
        }

        return -1;
    }

    /**
     * Displays the error message for an element that is not valid
     * 
     * @param {DOMElement} element
     * @param {string} type
     * @returns {void}
     */
    function showError(element, type) {
        // If a field has an error message, then it is not necessary to add another
        if ($(element).parent(":has(span.form-invalid-message)").length > 0) {
            return;
        }

        var errorMessage = i18n[type];

        switch ($(element.form).attr("data-validation")) {
            case "field-left":
                $("<span/>", {"class": "form-invalid-message", "text": errorMessage}).insertBefore(element).show(1200);
                 break;
            case "field-right":
                $("<span/>", {
                    "class": "form-invalid-message", 
                    "text": errorMessage
                }).insertAfter($(":input[name=" + element.name + "]:last-child")).show(1200);

                break;		
            case "field-bottom":
                $("<div/>", {"class": "form-invalid-message", "text": errorMessage}).insertAfter(element).show(1200);
                 break;
            case "field-top":
                $("<div/>", {"class": "form-invalid-message", "text": errorMessage}).insertBefore(element).show(1200);
                break;
            case "field-icon":
//                $("<img/>", {
//                    "src": "img/exclamation.png", 
//                    "class": "form-invalid-icon",
////                    "title": errorMessage
//                }).insertAfter($(":input[name=" + element.name + "]:last-child"));

                var uniqueId = generateId();
                $("<div/>", {"class": "form-invalid-tooltip", "id": uniqueId})
                    .append($("<img/>", {
                        "src": "img/exclamation.png", 
                        "class": "form-invalid-icon"
                    }))
                    .append(
                        $("<div/>", {"class": "form-invalid-tooltip-content"})
                            .append($("<b/>"))
                            .append($("<span/>", {"text": errorMessage}))
                    )
                    .insertAfter($(":input[name=" + element.name + "]:last-child"));

                break;
            case "summary-top":
                break;
            case "summary-bottom":
                break;		
        }

//        $(element).removeData();
        $(element).data("errorMessage", errorMessage);
        if (undefined === $(':input[name="' + element.name + '"]', element.form).data("iconUniqueId")) {
//            $(element).data("iconUniqueId", uniqueId);
            $(':input[name="' + element.name + '"]', element.form).data("iconUniqueId", uniqueId);
        }
        $(element).addClass("form-invalid-field");
    }

    /**
     * 
     * @param {DOMElelement} element
     * @returns {boolean}
     */
    function validateField(element) {
        var errorFlag = true;

        var dataValidations = $.trim($(element).attr('data-validation')).split(' ');
        dataValidations = parseValidations(dataValidations);

        if (!checkValidations(getValidationsArray(dataValidations))) {
            showError(element, 'attributesInConflict');
        }

        $(dataValidations).each(function (index, validation) {
            var isRequired = searchValidation("required", dataValidations);

            switch (validation.name) {
                case "alnum":
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidAlnum(element) && errorFlag;
                    }
                    break;

                case "alpha":
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidAlpha(element) && errorFlag;
                    }
                    break;

                case "email": 
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidEmail(element) && errorFlag;
                    }
                    break;

                case "enum":
                    if (-1 !== isRequired || "" !== element.value) {
                        if (Array.isArray(validation.params)) {
                            errorFlag = isValidEnum(element, validation.params) && errorFlag;
                        } else {
                            showError(element, "enumParams");
                        }
                    }
                    break;

                case "integer":
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidInteger(element) && errorFlag;
                    }
                    break;

                case "number":
                    if (-1 !== isRequired || "" !== element.value ) {
                        errorFlag = isValidNumber(element) && errorFlag;
                    }
                    break;

                case "range":
                    if (-1 !== isRequired || "" !== element.value ) {
                        errorFlag = isValidRange(
                            element, 
                            validation.params[0], 
                            validation.params[1]
                        ) && errorFlag;
                    }
                    break;

                case "regex":
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidRegex(element, validation.params) && errorFlag;
                    }
                    break;

                case "required":
                    if (-1 !== isRequired || "" !== element.value) {
                        errorFlag = isValidRequired(element) && errorFlag;
                    }                                                            
                    break;

                default:
                    // TODO: Do something
                    break;
            }

            if (!errorFlag) {
                return false;
            }
        });

        return errorFlag;
    }

    $.fn.formValidate = function(options) {
        options = $.extend({
            errorClass: "error"
        }, options);

        return this.each(function() {
            var form = $(this);

            // Check whether the element we are working on is actually a form
            if (!form.is("form")) {
                return;
            }

            form.submit(function(event) {
                var errorFlag = true;

                // Hide error messages
                $(".form-invalid-message").remove();
                $(".form-invalid-icon").remove();
                $(".form-invalid-field").removeClass("form-invalid-field");

                $(":input[data-validation]", this).each(function(index, element) {
                    // Remove the error css attributes o class
                    hideError(element);

                    errorFlag = validateField(element) && errorFlag;

                    // Validate single element
//                    $(element).on("change click", function(event) {
                    $(':input[name="' + element.name + '"]', element.form).on("change click", function(event) {
                        if (!validateField(this)) {
                            // Cancel form submit 
                            event.stopPropagation();
                            showError(this);
                        } else {
                            hideError(this);
                        }
                    });

//                    var dataValidations = $.trim($(element).attr('data-validation')).split(' ');
//                    dataValidations = parseValidations(dataValidations);
//
//                    if (!checkValidations(getValidationsArray(dataValidations))) {
//                        showError(element, 'attributesInConflict');
//                    }
//
//                    $(dataValidations).each(function (index, validation) {
//                        var isRequired = searchValidation("required", dataValidations);
//
//                        switch (validation.name) {
//                            case "alnum":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidAlnum(element) && errorFlag;
//                                }
//                                break;
//
//                            case "alpha":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidAlpha(element) && errorFlag;
//                                }
//                                break;
//
//                            case "email": 
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidEmail(element) && errorFlag;
//                                }
//                                break;
//
//                            case "enum":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    if (Array.isArray(validation.params)) {
//                                        errorFlag = isValidEnum(element, validation.params);
//                                    } else {
//                                        showError(element, "enumParams");
//                                    }
//                                }
//                                break;
//
//                            case "integer":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidInteger(element) && errorFlag;
//                                }
//                                break;
//
//                            case "number":
//                                if (-1 !== isRequired || "" !== element.value ) {
//                                    errorFlag = isValidNumber(element) && errorFlag;
//                                }
//                                break;
//
//                            case "range":
//                                if (-1 !== isRequired || "" !== element.value ) {
//                                    errorFlag = isValidRange(
//                                        element, 
//                                        validation.params[0], 
//                                        validation.params[1]
//                                    ) && errorFlag;
//                                }
//                                break;
//
//                            case "regex":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidRegex(element, validation.params) && errorFlag;
//                                }
//                                break;
//
//                            case "required":
//                                if (-1 !== isRequired || "" !== element.value) {
//                                    errorFlag = isValidRequired(element) && errorFlag;
//                                }                                                            
//                                break;
//
//                            default:
//                                // TODO: Do something
//                                break;
//                        }
//
//                        if (!errorFlag) {
//                            return false;
//                        }
//
//                        return errorFlag;
//                    });
                });

                return errorFlag;
            });
        });
    }
})(jQuery);
