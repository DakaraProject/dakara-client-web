import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadCurrentUser } from 'actions'
import Header from './Header'
import Footer from './Footer'
import Player from './player/Player'
import { IsAuthenticated } from 'components/permissions/Base'

class Main extends Component {
    componentWillMount() {
        if (this.props.isLoggedIn) {
            this.props.loadCurrentUser()
        }
    }

    componentWillUpdate(nextProps) {
        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.props.loadCurrentUser()
        }
    }

    render() {
        return (
            <div id="main">
                <Header/>
                <div id="content">
                    <IsAuthenticated>
                        <Player/>
                    </IsAuthenticated>
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
    { loadCurrentUser }
)(Main)

export default Main
