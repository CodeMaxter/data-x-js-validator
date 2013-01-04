/* 
 * Plugin to validate forms
 * @author Alvaro José Agámez Licha, Johann Paul Echavarría Zapata
 */

/*Begin of Array.indexOf definition for IE<9
https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/IndexOf#Compatibility
*/ 
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}
/*End of Array.indexOf definition*/ 
 
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
        var index = dataValidations.indexOf('required');
        var head = dataValidations.slice(0, index);
        var tail = dataValidations.slice(index + 1);
        dataValidations = head.concat(tail);

        // Takes the first validation like a pivot to compare
        var pivot = dataValidations.shift();
        if (dataValidations.length > 0) {
            for (var index = 0; index < dataValidations.length; index++) {
                if (-1 === validationMap[pivot].indexOf(dataValidations[index])) {
					showError(element, 'missconfig');
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Hide the error message for an element
     * 
     * @param {DOMElement} element
     * @returns {void}
     */
    function hideError(element) {
        $(element).css({"border": ''});        
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
     * @returns description {boolean}
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

    function isValidRegex(element) {
        switch (element.type) {
            case 'password':
            case 'textarea':
            case 'text':
                try {
                    if (!pattern.test($(element).val())) {
                        showError(element, 'regex');
                        return false;
                    }
                } catch (Exception) {
                    return false;
                }

                break;
            default:
                // TODO: Do something with the fields that do not allow the validation regex
                break;
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
     * Displays the error message for an element that is not valid
     * 
     * @param {DOMElement} element
     * @param {string} type
     * @returns {void}
     */
    function showError(element, type) {

        var errorMess;
    
        switch (type) {
            case "wrongValidationsConfig":
                errorMess = "Validation attributes in conflict. Please fix it.";
                break;
            case "alnum":
                errorMess = "It must be Alphanumeric.";
                break;
            case "alpha":
                errorMess = "It must be alphabetical.";
                break;
            case "email":
                errorMess = "It must be a correct email.";
                break;
            case "integer":
                errorMess = "It must be an integer.";
                break;
            case "number":
                errorMess = "It must be number.";
                break;
            case "required":
                errorMess = "It must be filled.";
                break;
        }
        
        if (undefined !== $(element).data(".errorMessage") 
            || "" !== $(element).data(".errorMessage")
        ) {
        //alert("sal");
        //return false;
        }

        switch ($(element.form).attr("data-validation")) {
            case "field-left":
                $("<span class='errorMessage'>"+errorMess+"</span>").insertBefore($(element)).show(1200);
                 break;
            case "field-right":
                //$(element).after("<span class='errorMessage'>No pasó validación</span>").hide().fadeIn("slow");
                $("<span class='errorMessage'>"+errorMess+"</span>").insertAfter($(element)).show(1200);
                break;		
            case "field-bottom":
                $("<div class='errorMessage'>"+errorMess+"</div>").insertAfter($(element)).show(1200);
                 break;
            case "field-top":
                $("<div class='errorMessage'>"+errorMess+"</div>").insertBefore($(element)).show(1200);
                break;
            case "summary-top":
                break;
            case "summary-bottom":
                break;		
        }

        $(element).data("errorMessage", errorMess);
        $(element).css({"border": "2px solid red"});
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

            form.submit(function() {
                $(".errorMessage").remove(); /*Oculta mensajes de error*/
                var errorFlag = true;

                $(":input[data-validation]", this).each(function(index, element) {
                    // Remove the error css attributes o class
                    hideError(element);

                    var dataValidations = $(element).attr('data-validation').split(' ');
                    if (!checkValidations(dataValidations)) {
                        showError(element, 'wrongValidationsConfig');
//                        return false;
                    }

                    $(dataValidations).each(function (index, validation) {
                        switch (validation) {
                            case "alnum":
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    if(false === isValidAlnum(element)){
                                    errorFlag = false;
                                    }
                                }
                                break;

                            case "alpha":
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    if(false === isValidAlpha(element)){
                                    errorFlag = false;
                                    }                                                                    
                                }
                                break;

                            case "email": 
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    if(false === isValidEmail(element)){
                                    errorFlag = false;
                                    }                                                                    
                                }
                                break;

                            case "integer":
                                    if(false === isValidInteger(element)){
                                    errorFlag = false;
                                    }                                                                                            
                                break;

                            case "number":
                                    if(false === isValidNumber(element)){
                                    errorFlag = false;
                                    }                            
                                break;

                            case "regex":
                                errorFlag = isValidRegex(element);
                                break;

                            case "required":
                                    if(false === isValidRequired(element)){
                                    errorFlag = false;
                                    }                                                            
                                break;

                            default:
                                // TODO: Do something
                                break;
                        }
                    });
                });

                return errorFlag;
            });
        });
    }
})(jQuery);
