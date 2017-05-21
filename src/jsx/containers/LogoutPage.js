import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { logout } from '../actions'

class Logout extends Component {
    componentWillMount() {
        this.props.logout()
        browserHistory.push('/login')
    }

    render() {
        return null
    }
}

const LogoutPage = connect(
    () => ({}),
    { logout }
)(Logout)

export default LogoutPage
