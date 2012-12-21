/* 
 * Plugin to validate forms
 * @author Alvaro José Agámez Licha, Johann Paul Echavarría Zapata
 */

(function($) {

    /**
     * 
     * @param {DOMElement} element The element to validate
     * @param {DOMElement form The form that contains the element to validate
     * @returns {boolean} TRUE on error, FALSE otherwise
     */
    function validateRequired(element, form) {
        switch (element.type) {
            case 'checkbox': 
            case 'radio': {
                if (0 === $(':input[name="' + element.name + '"]:checked', form).length) {
//                    alert('ERROR: ' + element.name + ' is required');
                    showError(element, 'required');
                    return true;
                };
                
                return false;
                break;
            }

            case 'password': 
            case 'textarea': 
            case 'text': {
                if ('' === $.trim($(element).val())) {
                    showError(element, 'required');
                    return true;
                }

                return false;
                break;
            }

            case 'select-one': {
                if ('' === $('option:selected', element).val()) {
                    showError(element, 'required');
                    return true;
                }
                
                return false;
                break;
            }

            case 'select-multiple': {
                if (0 === $('option:selected', element).length) {
                    showError(element, 'required');
                    return true;
                }

                return false;
                break;
            }
        }
    }

    function validateEmail() {
        
    }

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
     * Displays the error message for an element that is not valid
     * 
     * @param {DOMElement} element
     * @param {string} type
     * @returns {void}
     */
    function showError(element, type) {
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

                    switch ($(element).attr('data-validation')) {
                        case "required": {
                            errorFlag = validateRequired(element, form);
                            break;
                        }
                    }
                });

                return !errorFlag;
            });
        });
    }
})(jQuery);
