import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { invalidateToken } from 'actions/token'
import Token from 'components/generics/Token'
import Notification from 'components/generics/Notification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { loadPlayerToken, createPlayerToken } from 'actions/playlist'
import { Status } from 'reducers/alterationsResponse'

class Tokens extends Component {

    render() {
        const { userToken, playerTokenState, invalidateToken, responseOfRevokeToken, createPlayerToken, responseOfCreatePlayerToken, karaoke } = this.props
        const { token: playerToken } = playerTokenState.data
        const { status: playerTokenStatus } = playerTokenState

        let playerTokenBox
        if (playerTokenStatus === Status.successful) {
            if (playerToken) {
                playerTokenBox = (
                    <>
                        <Token token={playerToken} />
                        <div className="ribbon info">
                            <p className="message">You can copy this token to authenticate the player.</p>
                        </div>
                    </>
                )
            } else {
                playerTokenBox = (
                    <div className="ribbon primary notifiable">
                        <p className="message">Create a token</p>
                        <div className="controls">
                            <button className="control primary" onClick={() => {createPlayerToken(karaoke.id)}}>
                                <i className="fa fa-sign-out"></i>
                            </button>
                        </div>
                        <Notification
                            alterationResponse={responseOfCreatePlayerToken}
                            pendingMessage={null}
                            successfulMessage={null}
                            failedMessage="Unable to create player token"
                        />
                    </div>
                )
            }
        }

        return (
            <div id="tokens" className="box">
                <SettingsTabList/>
                <div className="content">
                    <div className="user">
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
                    <IsPlaylistManager>
                        <div className="player">
                            <p>Player token</p>
                            {playerTokenBox}
                        </div>
                    </IsPlaylistManager>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        const { user, karaoke, loadPlayerToken, playerTokenState } = this.props

        if (!playerTokenState.status && karaoke.id && IsPlaylistManager.hasPermission(user)) {
            loadPlayerToken(karaoke.id)
        }
    }
}

const mapStateToProps = (state) => ({
    userToken: state.token,
    playerTokenState: state.playlist.playerToken,
    responseOfRevokeToken: state.alterationsResponse.unique.revokeToken,
    responseOfCreatePlayerToken: state.alterationsResponse.unique.createPlayerToken,
    user: state.authenticatedUser,
    karaoke: state.playlist.digest.data.karaoke,

})

Tokens = connect(
    mapStateToProps,
    { invalidateToken, loadPlayerToken, createPlayerToken }
)(Tokens)

export default Tokens
