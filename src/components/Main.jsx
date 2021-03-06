import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { loadCurrentUser } from 'actions/authenticatedUser'
import Header from './Header'
import Footer from './Footer'
import PlaylistApp from './playlistApp/PlaylistApp'
import { IsAuthenticated } from './permissions/Base'
import { loadWorkTypes } from 'actions/library'

class Main extends Component {
    playlistAppWrapperRef = React.createRef()

    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        loadCurrentUser: PropTypes.func.isRequired,
        loadWorkTypes: PropTypes.func.isRequired,
    }

    componentWillMount() {
        if (this.props.isLoggedIn) {
            this.props.loadCurrentUser()
            this.props.loadWorkTypes()
        }
    }

    componentWillUpdate(nextProps) {
        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.props.loadCurrentUser()
            this.props.loadWorkTypes()
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

Main = withRouter(connect(
    mapStateToProps,
    {
        loadCurrentUser,
        loadWorkTypes
    }
)(Main))

export default Main
