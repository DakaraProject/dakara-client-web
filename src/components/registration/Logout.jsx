import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router'

import { logout } from 'actions/token'

class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.logout()
    }

    render() {
        return (
            <Navigate to="/login" />
        )
    }
}

Logout = connect(
    () => ({}),
    { logout }
)(Logout)

export default Logout
