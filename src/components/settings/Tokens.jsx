import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { Status } from 'reducers/alterationsResponse'
import Notification from 'components/generics/Notification'
import { invalidateToken } from 'actions/token'

class Tokens extends Component {

    state = {
        userTokenCopyStatus: undefined
    }

    render() {
        const {userToken, invalidateToken, responseOfRevokeToken } = this.props
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
                    <div className="ribbon warning revoke notifiable">
                        <p className="message">Click this button to revoke your token. This will automatically disconnect you from all your devices.</p>
                        <div className="controls">
                            <button className="control warning" onClick={invalidateToken}>
                                <i className="fa fa-sign-out"></i>
                            </button>
                        </div>
                        <Notification
                            alterationResponse={responseOfRevokeToken}
                            pendingMessage={null}
                            successfulMessage={null}
                            failedMessage="Unable to invalidate token"
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
    userToken: state.token,
    responseOfRevokeToken: state.alterationsResponse.unique.revokeToken,

})

Tokens = connect(
    mapStateToProps,
    { invalidateToken }
)(Tokens)

export default Tokens
