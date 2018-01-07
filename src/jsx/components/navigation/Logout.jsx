import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from 'actions'

class Logout extends Component {
    componentWillMount() {
        this.props.logout()
        this.context.router.history.push('/login')
    }

    render() {
        return null
    }
}

Logout = withRouter(connect(
    () => ({}),
    { logout }
)(Logout))

export default Logout
