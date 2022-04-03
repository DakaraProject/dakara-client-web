import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import { createPlayerToken, loadPlayerToken, revokePlayerToken } from 'actions/playlist'
import { revokeToken } from 'actions/token'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import TokenWidget from 'components/generics/TokenWidget'
import { IsLibraryManager } from 'components/permissions/Library'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { playerTokenStatePropType } from 'reducers/playlist'
import { karaokePropType } from 'serverPropTypes/playlist'


class PlayerTokenBox extends Component {
    static propTypes = {
        createPlayerToken: PropTypes.func.isRequired,
        karaoke: karaokePropType.isRequired,
        loadPlayerToken: PropTypes.func.isRequired,
        playerTokenState: playerTokenStatePropType.isRequired,
        responseOfCreatePlayerToken: PropTypes.object,
        responseOfRevokeToken: PropTypes.object,
        revokePlayerToken: PropTypes.func.isRequired,
    }

    state = {
        confirmDisplayed: false
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    doConfirm = () => {
        const { karaoke, revokePlayerToken } = this.props
        this.clearConfirm()
        revokePlayerToken(karaoke.id)
    }

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
        } = this.props
        const { key: playerToken } = playerTokenState.data
        const { status: playerTokenStatus } = playerTokenState
        const created = !!playerToken

        // display something only if the player token has been fetched
        let playerTokenBox
        if (playerTokenStatus === Status.successful) {
            let playerTokenBoxContent
            if (created) {
                // display token
                playerTokenBoxContent = (
                    <div className="created">
                        <TokenWidget token={playerToken} />
                        <div className="ribbon info copy-help">
                            <p className="message">
                                You can use this token to authenticate the player.
                            </p>
                        </div>
                        <div className="revoke controls notifiable">
                            <CSSTransitionLazy
                                in={this.state.confirmDisplayed}
                                classNames="notified"
                                timeout={{
                                    enter: 300,
                                    exit: 150
                                }}
                            >
                                <ConfirmationBar
                                    onConfirm={this.doConfirm}
                                    onCancel={this.clearConfirm}
                                />
                            </CSSTransitionLazy>
                            <Notification
                                alterationResponse={responseOfRevokePlayerToken}
                                pendingMessage={null}
                                successfulMessage={null}
                                failedMessage="Unable to revoke player token"
                            />
                            <button
                                className="control primary"
                                onClick={this.displayConfirm}
                            >
                                Revoke token
                            </button>
                        </div>
                    </div>
                )
            } else {
                // display button to create token
                playerTokenBoxContent = (
                    <div className="create">
                        <div className="ribbon primary notifiable">
                            <p className="message">
                                Create a token that can be used to authenticate
                                the player.
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
                    </div>
                )
            }

            playerTokenBox = (
                <CSSTransition
                    in={created}
                    classNames="created"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    {playerTokenBoxContent}
                </CSSTransition>
            )
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
    static propTypes = {
        userToken: PropTypes.string.isRequired,
        responseOfRevokeToken: PropTypes.object,
        revokeToken: PropTypes.func.isRequired,
    }

    state = {
        confirmDisplayed: false
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    render() {
        const {
            userToken,
            revokeToken,
            responseOfRevokeToken,
        } = this.props

        return (
            <div id="tokens" className="content">
                <div className="token-box user">
                    <h3>User token</h3>
                    <div className="created">
                        <TokenWidget token={userToken} />
                        <IsLibraryManager>
                            <div className="ribbon info copy-help">
                                <p className="message">
                                    You can use this token to authenticate
                                    the feeder.
                                </p>
                            </div>
                        </IsLibraryManager>
                        <div className="revoke controls notifiable">
                            <CSSTransitionLazy
                                in={this.state.confirmDisplayed}
                                classNames="notified"
                                timeout={{
                                    enter: 300,
                                    exit: 150
                                }}
                            >
                                <ConfirmationBar
                                    message="This will disconnect you from 
                                    all your device. Are you sure?"
                                    onConfirm={revokeToken}
                                    onCancel={this.clearConfirm}
                                />
                            </CSSTransitionLazy>
                            <button
                                className="control primary"
                                onClick={this.displayConfirm}
                            >
                                Revoke token
                            </button>
                        </div>
                        <Notification
                            alterationResponse={responseOfRevokeToken}
                            pendingMessage={null}
                            successfulMessage={null}
                            failedMessage="Unable to revoke token"
                        />
                    </div>
                </div>
                <IsPlaylistManager>
                    <PlayerTokenBox />
                </IsPlaylistManager>
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
    { revokeToken }
)(Tokens)

export default Tokens
