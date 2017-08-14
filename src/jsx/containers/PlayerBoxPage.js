import React, { Component } from 'react'
import { connect } from 'react-redux'
import PlayerPage from './PlayerPage'
import PlaylistPage from './PlaylistPage'

class PlayerBoxPage extends Component {
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
                <PlayerPage/>
                <PlaylistPage/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    hasUserInfo: !!state.authenticatedUsers
})

PlayerBoxPage = connect(
    mapStateToProps,
    {}
)(PlayerBoxPage)

export default PlayerBoxPage 
