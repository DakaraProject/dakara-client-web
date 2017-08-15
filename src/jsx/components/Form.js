import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class FormBlock extends Component {

    state = {
        formValues: {}
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


    render() {
        const {title, onSubmit, submitText, response, children} = this.props

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
                (field) => React.cloneElement(field,
                    {
                        response,
                        setValue: this.setFieldValue,
                        formValues,
                    }
                )
            )

        return (
            <form
                onSubmit={e => {
                    e.preventDefault()
                    onSubmit(formValues)
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

export class Field extends Component {
    render() {
        const {
            id,
            type,
            placeholder,
            label,
            setValue,
            formValues,
            response,
        } = this.props

        // field error
        let message
        if (response) {
            const fieldErrors = response.fields[id]

            if (fieldErrors) {
                const messageContent = fieldErrors.map((fieldError, id) => (
                    <div className="error" key={id}>{fieldError}</div>
                ))

                message = (
                    <div className="notification danger">{messageContent}</div>
                )
            }
        }

        let value = ""
        if (formValues && formValues[id]) {
            value = formValues[id]
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
                        value={value}
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
