import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadCurrentUser } from '../actions'
import HeaderPage from './HeaderPage'
import Footer from '../components/Footer'
import PlayerBoxPage from './PlayerBoxPage'

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
                <HeaderPage/>
                <div id="content">
                    <PlayerBoxPage/>
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
