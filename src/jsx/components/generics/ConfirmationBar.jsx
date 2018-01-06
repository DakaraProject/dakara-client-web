import React, { Component } from 'react'

export default class ConfirmationBar extends Component {
    render() {
        const { message, onConfirm, onCancel } = this.props

        return (
            <div className="notified">
                <div className="notification warning">
                    <div className="message">
                        {message || "Are you sure?"}
                    </div>
                    <div className="controls">
                        <button
                            onClick={onConfirm}
                            className="control success"
                        >
                            <span className="icon">
                                <i className="fa fa-check"></i>
                            </span>
                        </button>
                        <button
                            onClick={onCancel}
                            className="control danger"
                        >
                            <span className="icon">
                                <i className="fa fa-times"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}