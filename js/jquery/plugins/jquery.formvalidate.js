/* 
 * Plugin to validate forms
 * @author Alvaro José Agámez Licha, Johann Paul Echavarría Zapata
 */

(function($) {
    'use strict';


    /**
     * Hide the error message for an element
     * 
     * @param {DOMElement} element
     * @returns {void}
     */
    function hideError(element)
    {
        $(element).css({"border": ''});
    }

    /**
     * Validates whether the value of an element is an email
     * 
     * @param {DOMElement} element
     * @param {DOMElement} form
     * @returns {boolean}
     */
    function isValidEmail(element, form) {
        var emailPattern = /(^[0-9a-zA-Z]+(?:[._][0-9a-zA-Z]+)*)@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;

        try {
            if (!emailPattern.test(element.value)) {
                showError(element, 'email');
                return false;
            }

            return true;
        } catch (Exception){
            return false;
        }
    }

    /**
     * Validates whether the value of an element is an integer
     * 
     * @param {DOMElement} element
     * @param {DOMElement} form
     * @returns {boolean}
     */
    function isValidInteger(element, form) {
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
     * @param {DOMElement} form
     * @returns {boolean}
     */
    function isValidNumber(element, form) {
        if (isNaN(parseFloat(element.value)) && isFinite(element.value)) {
            showError(element, 'number');
            return false;
        }

        return true;
    }

    /**
     * Validates whether an required element has a value
     * 
     * @param {DOMElement} element The element to validate
     * @param {DOMElement form The form that contains the element to validate
     * @returns {boolean} TRUE on error, FALSE otherwise
     */
    function isValidRequired(element, form) {
        var errorFlag = true;

        switch (element.type) {
            case 'checkbox':
            case 'radio': {
                if (0 === $(':input[name="' + element.name + '"]:checked', form).length) {
                    errorFlag = false;
                }
                ;

                break;
            }

            case 'password':
            case 'textarea':
            case 'text': {
                if ('' === $.trim($(element).val())) {
                    errorFlag = false;
                }

                break;
            }

            case 'select-one': {
                if ('' === $('option:selected', element).val()) {
                    errorFlag = false;
                }

                break;
            }

            case 'select-multiple': {
                if (0 === $('option:selected', element).length) {
                    errorFlag = false;
                }

                break;
            }
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
        alert("Error: " + element.name + " " + type)
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
                var errorFlag = false;

                $(":input[data-validation]", this).each(function(index, element) {
                    // Remove the error css attributes o class
                    hideError(element);

                    var dataValidations = $(element).attr('data-validation').split(' ');
                    $(dataValidations).each(function(index, validation) {
                        switch (validation) {
                            case "email": {
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    errorFlag = isValidEmail(element, form);
                                }
                                break;
                            }

                            case "integer": {
                                errorFlag = isValidInteger(element, form);
                                break;
                            }

                            case "required": {
                                errorFlag = isValidRequired(element, form);
                                break;
                            }

                            case "number": {
                                errorFlag = isValidNumber(element, form);
                                break;
                            }
                        }
                    });
                });

                return errorFlag;
            });
        });
    }
})(jQuery);
