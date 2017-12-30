import React, { Component } from 'react'
import { connect } from 'react-redux'
import Player from './Player'
import Playlist from './Playlist'

class PlayerBox extends Component {
    /**
     * This component render the playerBox composed of player and playlist
     * Only when loggedIn
     * Displays nothing when not loggedIn
     */
    render() {
        // Only render when we're logged in and
        // We got current user info
        if (!(this.props.isLoggedIn && this.props.hasUserInfo)) {
            return null
        }

        return (
            <div className="box">
                <Player/>
                <Playlist/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    hasUserInfo: !!state.authenticatedUsers
})

PlayerBox = connect(
    mapStateToProps,
    {}
)(PlayerBox)

export default PlayerBox
