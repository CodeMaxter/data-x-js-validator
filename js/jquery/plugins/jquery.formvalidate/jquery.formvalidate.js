/* 
 * Plugin to validate forms
 * @author Alvaro José Agámez Licha, Johann Paul Echavarría Zapata
 */

(function ($) {
    'use strict';


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
        //alert("Error: " + element.name + " " + type)
        //alert(form.attr("data-validation"));
        var errorMess = "aaa"; /*asignación temporal*/
        if (undefined !== $(element).data(".errorMessage") 
            || "" !== $(element).data(".errorMessage")
        ) {
        //alert("sal");
        //return false;
        }

        switch ($(element.form).attr("data-validation")) {
            case "field-left":
                $("<span class='errorMessage'>No pasó validación</span>").insertBefore($(element)).show(1200);
                 break;
            case "field-right":
                //$(element).after("<span class='errorMessage'>No pasó validación</span>").hide().fadeIn("slow");
                $("<span class='errorMessage'>No pasó validación</span>").insertAfter($(element)).show(1200);
                break;		
            case "field-bottom":
                $("<div class='errorMessage'>No pasó validación</div>").insertAfter($(element)).show(1200);
                 break;
            case "field-top":
                $("<div class='errorMessage'>No pasó validación</div>").insertBefore($(element)).show(1200);
                break;
            case "summary-top":
                break;
            case "summary-bottom":
                break;		
        }

        $(element).data("errorMessage",errorMess);
        $(element).css({"border": "1px solid red"});
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
                    $(dataValidations).each(function (index, validation) {
                        switch (validation) {
                            case "alnum":
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    errorFlag = isValidAlnum(element);
                                }
                                break;

                            case "alpha":
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    errorFlag = isValidAlpha(element);
                                }
                                break;

                            case "email": 
                                if ($.inArray("require", dataValidations)
                                    || "" !== element.value
                                ) {
                                    errorFlag = isValidEmail(element);
                                }
                                break;

                            case "integer":
                                errorFlag = isValidInteger(element);
                                break;

                            case "number":
                                errorFlag = isValidNumber(element);
                                break;

                            case "required":
                                errorFlag = isValidRequired(element);
                                break;

                            default:
                                // TODO: Make something
                                break;
                        }
                    });
                });

                return errorFlag;
            });
        });
    }
})(jQuery);
