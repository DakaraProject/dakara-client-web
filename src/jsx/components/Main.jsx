import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadCurrentUser } from 'actions'
import Header from './Header'
import Footer from './Footer'
import PlayerBox from './player/PlayerBox'

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
                    <PlayerBox/>
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
