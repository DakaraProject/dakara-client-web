import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { setFormValidationErrors, submitForm, clearForm } from '../actions'


class Form extends Component {

    state = {
        formValues: {
        }
    }

    setDefaultFormValues = () => {
        const { formValues } = this.state
        const newFormValues = {}

        React.Children.map(this.props.children, field => {
            // only undefined values are replaced to the default value of the
            // component
            // this avoids corrupting falsy values such as false or 0
            if (field.props.defaultValue === undefined ||
                field.props.defaultValue == null) {
                    newFormValues[field.props.id] = field.type.getEmptyValue()
            } else {
                    newFormValues[field.props.id] = field.props.defaultValue
            }
        })

        this.setState({
            formValues: {
                ...formValues,
                ...newFormValues
            }
        })
    }

    componentWillMount() {
        this.setDefaultFormValues()
    }

    componentWillUnmount() {
        // Clear form messages
        this.props.clearForm(this.props.formName)
    }


    componentDidUpdate(prevProps) {
        const { formName, formsResponse, noClearOnSuccess, onSuccess } = this.props
        const response = formsResponse[formName]
        const prevResponse = prevProps.formsResponse[formName]

        // If there is a success notification
        if (response && response.global && response.global.type == 'success') {
            // and there was no response, or a different notification before
            if (!prevResponse || response.global != prevResponse.global) {
                if (!noClearOnSuccess) {
                    this.setDefaultFormValues()
                }

                if (onSuccess) onSuccess()
            }
        }
    }

    setFieldValue = (fieldId, value) => {
        const { formValues } = this.state
        this.setState({
            formValues: {
                ...formValues,
                [fieldId]: value
            }
        })
    }

    /**
     * Method called before submit, to validate fields
     * @return boolean indicating validation success
     */
    validate = () => {
        const { setFormValidationErrors, formName, children, validate } = this.props
        const { formValues } = this.state

        // Global validation
        let globalErrors
        if (validate) {
            globalErrors = validate(formValues)
        }

        if (!globalErrors || globalErrors.length === 0) {
            globalErrors = null
        }

        // Check fields validations
        let fieldsErrors = {}
        React.Children.forEach(this.props.children, field => {
            const { id, required, validate } = field.props
            const value = formValues[id]
            // process each check for this field
            // for each failure, add error message to table
            let errors = []
            if (!value && required) {
                errors.push("This field is required.")
            }

            if (validate) {
                // The field has a custom validate method
                const validateResult = validate(value, formValues)
                if (validateResult) {
                    errors = errors.concat(validateResult)
                }
            }

            if (errors.length !== 0) {
                fieldsErrors[id] = errors
            }
        })

        if (Object.keys(fieldsErrors).length !== 0 || globalErrors) {
            // Validation errors
            // Dispatch action to set errors
            setFormValidationErrors(formName, globalErrors, fieldsErrors)
            return false
        }

        return true
    }

    /**
     * Method called when form is submited and validatio has passed
     */
    submit = () => {
        const {
            formName,
            action,
            method,
            successMessage,
            excludedFields,
            submitForm,
            children
        } = this.props

        const { formValues } = this.state

        // generate the data to send
        const json = {}

        React.Children.forEach(children, (field) => {
            const { ignore, ignoreIfEmpty, id } = field.props
            const value = formValues[id]

            // if the field has to be ignored
            if (ignore) return
            if (ignoreIfEmpty && value == field.type.getEmptyValue()) return

            // add data
            json[id] = value
        })

        submitForm(formName, action, method || 'POST', json, successMessage)
    }

    /**
     * Add form props to children fields and put them in a set
     * @param inline the field is rendered in inline mode.
     * @returns set of fields with props.
     */
    renderFieldsSet = (inline) => {
        const { children, formName, formsResponse } = this.props
        const response = formsResponse[formName]
        const { formValues } = this.state

        const fields = React.Children.map(children,
            (field) => {
                const id = field.props.id
                let fieldErrors
                if (response) {
                    fieldErrors = response.fields[id]
                }

                return React.cloneElement(field,
                    {
                        fieldErrors,
                        setValue: this.setFieldValue,
                        value: formValues[id],
                        inline,
                    }
                )
            }
        )

        return (
            <div className="set">
                {fields}
            </div>
        )
    }

    renderControls = () => {
        const { submitText, submitClass } = this.props

        return (
            <div className="controls">
                <button
                    type="submit"
                    className={"control " + (submitClass || "primary")}
                >
                    {submitText || "Submit"}
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    formsResponse: state.forms
})

/**
 * FormBlock component
 * For creating forms
 *
 * Required properties:
 * - title <str>: Name to display in the form header.
 * - formName <str>: Unique form identifier.
 * - action <str>: url to submit form to, relative to base url
 *
 * Optional properties:
 * - method <str>: Method used to submit form, default to 'POST'
 * - submitText <str>: Submit button text, default: "Submit"
 * - successMessage <str>: Message to display when form submit suceed,
 *                           if null, no messsage is displayed.
 * - validate <func>: Called on submit, with object containing form values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - noClearOnSuccess <bool>: By default the form values are cleared when
 *                              request succeed.
 *                              If this value is true, forms are not cleared.
 * - onSuccess <func>: Called on form action success. Does not have access to
 *                      arguments.
 *
 *
 *
 */
class FormBlock extends Form {
    render() {
        const { title, formName, formsResponse } = this.props
        const response = formsResponse[formName]

        // global notification message
        let message
        if (response && response.global) {
            message = (
                        <div className="notified">
                            <div
                                className={"notification message " +
                                    response.global.type}
                            >
                                {response.global.message}
                            </div>
                        </div>
                    )
        }

        // get fields
        const fieldsSet = this.renderFieldsSet()

        // get controls
        const controls = this.renderControls()

        return (
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if(this.validate()) {
                        this.submit()
                    }
                }}
                className="form block"
                noValidate
            >
                <div className="header notifiable">
                    <h2>{title}</h2>
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {message}
                    </ReactCSSTransitionGroup>
                </div>
                {fieldsSet}
                {controls}
            </form>
        )
    }
}

FormBlock = connect(
    mapStateToProps,
    {
        setFormValidationErrors,
        submitForm,
        clearForm
    }
)(FormBlock)

export { FormBlock }

/**
 * FormInline component
 * For creating inline forms
 *
 * Required properties:
 * - title <str>: Name to display in the form header.
 * - formName <str>: Unique form identifier.
 * - action <str>: url to submit form to, relative to base url
 *
 * Optional properties:
 * - method <str>: Method used to submit form, default to 'POST'
 * - submitText <str>: Submit button text, default: "Submit"
 * - successMessage <str>: Message to display when form submit suceed,
 *                           if null, no messsage is displayed.
 * - validate <func>: Called on submit, with object containing form values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - noClearOnSuccess <bool>: By default the form values are cleared when
 *                              request succeed.
 *                              If this value is true, forms are not cleared.
 * - onSuccess <func>: Called on form action success. Does not have access to
 *                      arguments.
 *
 *
 *
 */
class FormInline extends Form {
    render() {
        const { formName } = this.props

        // get fields
        const fieldsSet = this.renderFieldsSet(true)

        // get controls
        const controls = this.renderControls()

        return (
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if(this.validate()) {
                        this.submit()
                    }
                }}
                className="form inline"
                noValidate
            >
                {fieldsSet}
                {controls}
            </form>
        )
    }
}

FormInline = connect(
    mapStateToProps,
    {
        setFormValidationErrors,
        submitForm,
        clearForm
    }
)(FormInline)

export { FormInline }

/**
 * Form Field abstract component
 * Specializations of this component should be used as a direct child of a Form
 *
 * Each specialization must take care of a null value by itself and convert it
 * to its most logical type or React required type.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 *
 * Optional properties:
 * - defaultValue <str>: Pre-fill field with given value.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the field tag.
 */
class Field extends Component {

    static getEmptyValue() {
        return ""
    }

    subRender = (props) => (null)

    render() {
        const {
            id,
            label,
            setValue,
            value,
            fieldErrors,
            defaultValue,
            validate,
            disabled,
            ignore,
            ignoreIfEmpty,
            inline,
            ...remaining
        } = this.props

        // field error
        let message
        if (fieldErrors && !inline) {
            const messageContent = fieldErrors.map((fieldError, id) => (
                <div className="error" key={id}>{fieldError}</div>
            ))

            message = (
                <div className="notification danger">{messageContent}</div>
            )
        }

        // props to pass to the field tag
        let propsValue = value

        if (propsValue === undefined) {
            propsValue = this.constructor.getEmptyValue()
        }

        const props = {
            id,
            value: propsValue,
            onChange: e => {setValue(id, e.target.value)},
            disabled,
            ...remaining
        }

        // class
        let disabledClassName = ''
        if (disabled) {
            disabledClassName = "disabled "
        }


        // Inline form: render input field only
        if (inline) {
            return (
                <div className={disabledClassName + "field"}>
                    {this.subRender(props)}
                </div>
            )
        }

        return (
            <div className={disabledClassName + "field"}>
                <label htmlFor={id} className="label">
                    {label}
                </label>
                <div className="input">
                    {this.subRender(props)}
                    <ReactCSSTransitionGroup
                        transitionName="error"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={100}
                    >
                        {message}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
}

/**
 * Form Field component based on the Input tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to empty string.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 *
 * Optional properties:
 * - type <str>: Html input type, default to text field.
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class InputField extends Field {
    subRender = (props) => (
        <input
            {...props}
        />
    )
}

/**
 * Form Field component based on the Select tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to empty string in the HTML tag. In the state, empty
 * strings are converted into null.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 * - options <Array>: List of the different options to display. Each list item
 *                      must be an object with a `value` key and a `name` key.
 *
 * Optional properties:
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the select tag.
 */
export class SelectField extends Field {
    static getEmptyValue() {
        return null
    }

    subRender = (props) => {
        const { options, multiple, value, ...remainingProps } = props
        const { id, setValue } = this.props

        // remove props from remaining
        const { onChange, ...remaining } = remainingProps

        // create options
        const content = options.map((option, id) => ((
            <option
                key={id}
                value={option.value || ''}
            >
                {option.name}
            </option>
        )))

        // case for select of type multiple
        let classNameMultiple = ""
        if (multiple) {
            classNameMultiple = "multiple "
        }

        return (
            <div className={classNameMultiple + "select"}>
                <select
                    multiple={multiple}
                    value={value || ''}
                    onChange={e => {setValue(id, e.target.value || null)}}
                    {...remaining}
                >
                    {content}
                </select>
            </div>
        )
    }
}

/**
 * Form Field component based on the Input tag of type checkbox
 * Should be used as a direct child of a Form
 *
 * Null value is converted to false.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 *
 * Optional properties:
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - toggle <book>: If true, display as toggle instead of checkbox.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class CheckboxField extends Field {
    static getEmptyValue() {
        return false
    }

    subRender = (props) => {
        const { value, toggle, ...remainingProps } = props
        const { id, setValue } = this.props

        // remove props from remaining
        const { onChange, ...remaining } = remainingProps

        const className = toggle ? "toggle" : "checkbox"

        return (
            <div className={className}>
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={e => {setValue(id, e.target.checked)}}
                    {...remaining}
                />
                <label
                    htmlFor={id}
                    className="fake marker"
                    id={`${id}-fake`}
                ></label>
            </div>
        )
    }
}

/**
 * Form Field component based on the Input tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to 0 value.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 *
 * Optional properties:
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class HueField extends Field {
    static getEmptyValue() {
        return 0
    }

    subRender = (args) => {
        const { value } = this.props

        return (
            <div className="hue">
                <div
                    className="preview"
                    style={{filter: `hue-rotate(${value}deg)`}}
                >
                    {value}
                </div>
                <div className="input fake">
                    <input
                        className="faked"
                        type="range"
                        min="0"
                        max="360"
                        step="5"
                        {...args}
                    />
                </div>
            </div>
        )
    }
}
