import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { invalidateToken } from 'actions/token'
import TokenWidget from 'components/generics/TokenWidget'
import Notification from 'components/generics/Notification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { IsLibraryManager } from 'components/permissions/Library'
import { loadPlayerToken, createPlayerToken, revokePlayerToken } from 'actions/playlist'
import { Status } from 'reducers/alterationsResponse'


class PlayerTokenBox extends Component {
    componentDidUpdate() {
        const { karaoke, loadPlayerToken, playerTokenState } = this.props

        // load player token as soon as the karaoke ID has been fetched
        if (!playerTokenState.status && karaoke.id) {
            loadPlayerToken(karaoke.id)
        }
    }

    render() {
        const {
            createPlayerToken,
            karaoke,
            playerTokenState,
            responseOfCreatePlayerToken,
            responseOfRevokePlayerToken,
            revokePlayerToken,
        } = this.props
        const { token: playerToken } = playerTokenState.data
        const { status: playerTokenStatus } = playerTokenState

        let playerTokenBox
        // display something only if the player token has been fetched
        if (playerTokenStatus === Status.successful) {
            if (playerToken) {
                // display token
                playerTokenBox = (
                    <>
                        <TokenWidget token={playerToken} />
                        <div className="ribbon info copy-help">
                            <p className="message">
                                You can copy this token to authenticate the player.
                            </p>
                        </div>
                        <div className="ribbon warning revoke notifiable">
                            <p className="message">
                                Click this button to revoke the player token.
                            </p>
                            <div className="controls">
                                <button
                                    className="control warning"
                                    onClick={() => {revokePlayerToken(karaoke.id)}}
                                >
                                    <i className="fa fa-minus-circle"></i>
                                </button>
                            </div>
                            <Notification
                                alterationResponse={responseOfRevokePlayerToken}
                                pendingMessage={null}
                                successfulMessage={null}
                                failedMessage="Unable to revoke player token"
                            />
                        </div>
                    </>
                )
            } else {
                // display button to create token
                playerTokenBox = (
                    <div className="ribbon primary create notifiable">
                        <p className="message">
                            Create a token that can be used to authenticate the player.
                        </p>
                        <div className="controls">
                            <button
                                className="control primary"
                                onClick={() => {createPlayerToken(karaoke.id)}}
                            >
                                <i className="fa fa-plus-circle"></i>
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
            <div className="token-box player">
                <h3>Player token</h3>
                {playerTokenBox}
            </div>
        )
    }
}

const mapStateToPropsPlayerTokenBox = (state) => ({
    playerTokenState: state.playlist.playerToken,
    responseOfCreatePlayerToken: state.alterationsResponse.unique.createPlayerToken,
    responseOfRevokePlayerToken: state.alterationsResponse.unique.revokePlayerToken,
    karaoke: state.playlist.digest.data.karaoke,

})

PlayerTokenBox = connect(
    mapStateToPropsPlayerTokenBox,
    { loadPlayerToken, createPlayerToken, revokePlayerToken }
)(PlayerTokenBox)


class Tokens extends Component {
    render() {
        const {
            userToken,
            invalidateToken,
            responseOfRevokeToken,
        } = this.props

        return (
            <div id="tokens" className="box">
                <SettingsTabList/>
                <div className="content">
                    <div className="token-box user">
                        <h3>User token</h3>
                        <TokenWidget token={userToken} />
                        <IsLibraryManager>
                            <div className="ribbon info copy-help">
                                <p className="message">
                                    You can copy this token to authenticate the feeder.
                                </p>
                            </div>
                        </IsLibraryManager>
                        <div className="ribbon warning revoke notifiable">
                            <p className="message">
                                Click this button to revoke your token.
                                This will automatically disconnect you from all your devices.
                            </p>
                            <div className="controls">
                                <button
                                    className="control warning"
                                    onClick={invalidateToken}
                                >
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
                        <PlayerTokenBox />
                    </IsPlaylistManager>
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
