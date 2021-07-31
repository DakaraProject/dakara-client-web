import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { Status } from 'reducers/alterationsResponse'
import Notification from 'components/generics/Notification'

class Tokens extends Component {

    state = {
        userTokenCopyStatus: undefined
    }

    render() {
        const {userToken} = this.props
        const {userTokenCopyStatus} = this.state

        return (
            <div id="tokens" className="box">
                <SettingsTabList/>
                <div className="content">
                    <p>User token</p>
                    <div className="token user notifiable">
                        <div className="key">{userToken}</div>
                        <div className="controls">
                            <button className="copy control primary" onClick={() => {
                                this.copyToClipboard(userToken, "userTokenCopyStatus")
                            }}>
                                <i className="fa fa-clipboard"></i>
                            </button>
                        </div>
                        <Notification
                            alterationResponse={{status: userTokenCopyStatus}}
                            successfulMessage="Copied!"
                            failedMessage="Error when copying to clipboard"
                        />
                    </div>
                </div>
            </div>
        )
    }

    copyToClipboard = (text, copyStatusName) => {
        // copy text to clipboard using the clipboard API and manage success or
        // failure of the operation
        this.setState({[copyStatusName]: Status.pending})
        navigator.clipboard.writeText(text).then(
            () => {
                this.setState({[copyStatusName]: Status.successful})
            },
            () => {
                this.setState({[copyStatusName]: Status.failed})
            }
        )
    }
}

const mapStateToProps = (state) => ({
    userToken: state.token
})

Tokens = connect(
    mapStateToProps,
    {}
)(Tokens)

export default Tokens
