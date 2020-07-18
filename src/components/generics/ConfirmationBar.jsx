import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ConfirmationBar extends Component {
    static propTypes = {
        message: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    static defaultProps = {
        message: "Are you sure?",
    }

    render() {
        const { message, onConfirm, onCancel } = this.props

        return (
            <div className="notified">
                <div className="notification warning">
                    <div className="message">
                        {message}
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
