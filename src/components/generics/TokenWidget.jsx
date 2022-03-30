import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Notification from 'components/generics/Notification'
import { Status } from 'reducers/alterationsResponse'

export default class TokenWidget extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
    }

    state = {
        tokenCopyStatus: undefined
    }

    copyToClipboard = (text) => {
        // copy text to clipboard using the clipboard API and manage success or
        // failure of the operation
        this.setState({tokenCopyStatus: Status.pending})
        navigator.clipboard.writeText(text).then(
            () => {
                this.setState({tokenCopyStatus: Status.successful})
            },
            () => {
                this.setState({tokenCopyStatus: Status.failed})
            }
        )
    }

    render() {
        const { token } = this.props
        const { tokenCopyStatus } = this.state

        return (
            <div className="token-widget notifiable">
                <div className="token">{token}</div>
                <div className="controls">
                    <button className="control primary" onClick={() => {
                        this.copyToClipboard(token)
                    }}>
                        <i className="fa fa-clipboard"></i>
                    </button>
                </div>
                <Notification
                    alterationResponse={{status: tokenCopyStatus}}
                    successfulMessage="Copied!"
                    failedMessage="Error when copying to clipboard"
                />
            </div>
        )
    }
}
