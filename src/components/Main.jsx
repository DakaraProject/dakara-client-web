import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadCurrentUser } from 'actions/authenticatedUser'
import { loadServerSettings } from 'actions/internal'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { IsAuthenticated } from 'components/permissions/Base'
import PlaylistApp from 'components/playlistApp/PlaylistApp'

class Main extends Component {
    playlistAppWrapperRef = React.createRef()

    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        loadCurrentUser: PropTypes.func.isRequired,
        loadServerSettings: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.loadServerSettings()

        if (this.props.isLoggedIn) {
            this.props.loadCurrentUser()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
            this.props.loadCurrentUser()
        }
    }

    render() {
        return (
            <div id="main">
                <Header/>
                <IsAuthenticated>
                    <PlaylistApp/>
                </IsAuthenticated>
                <div id="content">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
})

Main = connect(
    mapStateToProps,
    {
        loadCurrentUser,
        loadServerSettings
    }
)(Main)

export default Main
