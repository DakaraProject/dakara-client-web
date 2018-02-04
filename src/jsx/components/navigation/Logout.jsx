import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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

Logout.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

Logout = connect(
    () => ({}),
    { logout }
)(Logout)

export default Logout
