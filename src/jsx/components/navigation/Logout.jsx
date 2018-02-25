import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from 'actions'

class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    componentWillMount() {
        this.props.logout()
        this.context.router.history.push('/login')
    }

    render() {
        return null
    }
}

Logout = connect(
    () => ({}),
    { logout }
)(Logout)

export default Logout
