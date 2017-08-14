import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export const FormBlock = ({title, onSubmit, submitText, response, children}) => {
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

    return (
        <form
            onSubmit={onSubmit}
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
                {children}
            </div>
            <div className="controls">
                <button type="submit" className="control primary">
                    {submitText}
                </button>
            </div>
        </form>
    )
}

export class Field extends Component {
    render() {
        const { id, type, reference, placeholder, label, response } = this.props

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

        return (
            <div className="field">
                <label htmlFor={id}>
                    {label}
                </label>
                <div className="input">
                    <input
                        id={id}
                        ref={reference}
                        placeholder={placeholder}
                        type={type}
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
