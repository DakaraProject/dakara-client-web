import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { setFormValidationErrors } from '../actions'


/**
 * FormBlock component
 * For creating forms
 *
 * Required properties:
 * - title <str>: Name to display in the form header.
 * - onSubmit <func>: Called on submit when validation pass,
 *                      with object containing form values as argument.
 * - formName <str>: Unique form identifier.
 *
 * Optional properties:
 * - submitText <str>: Submit button text, default: "Submit"
 * - validate <func>: Called on submit, with object containing form values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - noClearOnSuccess <bool>: By default the form values are cleared when
 *                              request succeed.
 *                              If this value is true, forms are not cleared.
 *
 *
 *
 */
class FormBlock extends Component {

    state = {
        formValues: {
        }
    }

    componentWillMount() {
        const { formValues } = this.state
        const newFormValues = {}

        React.Children.map(this.props.children, field => {
            // only undefined values are replaced to null
            // this avoids corrupting falsy values such as false or 0
            // newFormValues[field.props.id] = field.props.defaultValue || ""
            newFormValues[field.props.id] = ('defaultValue' in field.props) ?
                field.props.defaultValue : null
        })

        this.setState({
            formValues: {
                ...formValues,
                ...newFormValues
            }
        })
    }

    componentDidUpdate(prevProps) {
        const { formName, formsResponse, noClearOnSuccess } = this.props
        const response = formsResponse[formName]
        const prevResponse = prevProps.formsResponse[formName]

        if (noClearOnSuccess) {
            return
        }

        // If there is a success notification
        if (response && response.global && response.global.type == 'success') {
            // and there was no response, or a different notification before
            if ( !prevResponse ||
                    response.global != prevResponse.global) {
                this.setState( {
                    formValues: {}
                })
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

    /** Method called before submit, to validate fields
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
        React.Children.map(this.props.children, field => {
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


    render() {
        const {title, onSubmit, submitText, formName, formsResponse, children} = this.props
        const response = formsResponse[formName]

        const { formValues } = this.state

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


        // Add props to fields
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
                        }
                    )
                }
            )

        return (
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if(this.validate()) {
                        onSubmit(formValues)
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
                <div className="set">
                    {fields}
                </div>
                <div className="controls">
                    <button type="submit" className="control primary">
                        {submitText || "Submit"}
                    </button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    formsResponse: state.forms
})

FormBlock = connect(
    mapStateToProps,
    { setFormValidationErrors }
)(FormBlock)

export { FormBlock }

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
 * Extra properties are passed to the field tag.
 */
class Field extends Component {

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
            ...remaining
        } = this.props

        // field error
        let message
        if (fieldErrors) {
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
            propsValue = null
        }
        const props = {
            id,
            value: propsValue,
            onChange: e => {setValue(id, e.target.value)},
            disabled,
            ...remaining
        }

        let disabledClassName = ''
        if (disabled) {
            disabledClassName = "disabled "
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
 * Extra properties are passed to the input tag.
 */
export class InputField extends Field {
    subRender = (props) => {
        const { value, ...remaining } = props
        const inputValue = value || ""
        return (
            <input
                value={inputValue}
                {...remaining}
            />
        )
    }
}

/**
 * Form Field component based on the Select tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to empty string.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - label <str/jsx>: Label of the field.
 * - options <Array>: List of the different options to display. Each list item
 *      must be an object with a `value` key and a `name` key.
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
 * Extra properties are passed to the select tag.
 */
export class SelectField extends Field {
    subRender = (props) => {
        const { options, value, multiple, ...remaining } = props

        // create options
        const content = options.map((option, id) => ((
            <option
                key={id}
                value={option.value}
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
                    value={value || ""}
                    multiple={multiple}
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
 * Extra properties are passed to the input tag.
 */
export class CheckboxField extends Field {
    subRender = (props) => {
        const { value, onChange, ...remaining } = props
        const { id, setValue } = this.props
        return (
            <div className="checkbox">
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={e => {setValue(id, e.target.checked)}}
                    onFocus={() => {
                        document.getElementById(
                            `${id}-fake`
                        ).classList.add(
                            "focus"
                        )
                    }}
                    onBlur={() => {
                        document.getElementById(
                            `${id}-fake`
                        ).classList.remove(
                            "focus"
                        )
                    }}
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
