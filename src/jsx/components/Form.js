import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { setFormValidationErrors } from '../actions'


/**
 * FormBlock component
 * For creating forms
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
            newFormValues[field.props.id] = field.props.defaultValue || ""
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

    /** Method called before submit to validate fields
     * @return boolean indicating validation success
     */
    validate = () => {
        const { setFormValidationErrors, formName, children } = this.props
        const { formValues } = this.state

        // Check fields validations
        let fieldsErrors = {}
        React.Children.map(this.props.children, field => {
            const { id, required } = field.props
            const value = formValues[id]
            // process each check for this field
            // for each failure, add error message to table
            const errors = []
            if (!value && required) {
                errors.push("This field is required.")
            }

            if (errors.length !== 0) {
                fieldsErrors[id] = errors
            }
        })

        if (Object.keys(fieldsErrors).length !== 0) {
            // Validation errors
            // Dispatch action to set errors
            setFormValidationErrors(formName, null, fieldsErrors)
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
                        {submitText}
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
 * Form Field component
 * Should be used as a direct child of a Form
 */
export class Field extends Component {

    render() {
        const {
            id,
            type,
            placeholder,
            label,
            setValue,
            value,
            fieldErrors,
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

        return (
            <div className="field">
                <label htmlFor={id}>
                    {label}
                </label>
                <div className="input">
                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={e => {setValue(id, e.target.value)}}
                    />
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
