import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { logout } from 'actions/token'

class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.props.logout()
        this.props.history.push('/login')
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
