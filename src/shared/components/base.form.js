/**
 * Base class for form components
 * @class BaseFormComponent
 * @description
 * This class provides common functionality for form components.
 * It provides methods to check if a control is invalid and to get the error messages for a control.
 * @remarks
 * It is intended to be extended by other form components.
 */
export default class BaseFormComponent {
    /**
     * Check if a control is invalid
     * @param {Object} form - The form object
     * @param {string} controlName - The control name
     * @returns {boolean} True if the control is invalid, false otherwise
     * @protected
     */
    isInvalidControl(form, controlName) {
        return form[controlName].invalid && form[controlName].touched;
    }

    /**
     * Get the error messages for a control
     * @param {Object} form - The form object
     * @param {string} controlName - The control name
     * @returns {string} The error messages
     * @protected
     */
    errorMessagesForControl(form, controlName) {
        const control = form[controlName];
        let errorMessages = '';
        const errors = control.errors;
        if (!errors) return errorMessages;
        Object.keys(errors).forEach((errorKey) => {
            errorMessages += this.errorMessageForControl(controlName, errorKey);
        });
        return errorMessages;
    }

    /**
     * Get the error message for a control
     * @param {string} controlName - The control name
     * @param {string} errorKey - The error key
     * @returns {string} The error message
     * @private
     */
    errorMessageForControl(controlName, errorKey) {
        switch (errorKey) {
            case 'required':
                return `The field ${controlName} is required`;
            default:
                return `The field ${controlName} is invalid`;
        }
    }
}