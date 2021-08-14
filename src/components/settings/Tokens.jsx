import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { invalidateToken } from 'actions/token'
import Token from 'components/generics/Token'
import Notification from 'components/generics/Notification'

class Tokens extends Component {

    render() {
        const {userToken, invalidateToken, responseOfRevokeToken } = this.props

        return (
            <div id="tokens" className="box">
                <SettingsTabList/>
                <div className="content">
                    <p>User token</p>
                    <Token token={userToken} />
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
