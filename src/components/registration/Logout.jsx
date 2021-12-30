import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { logout } from 'actions/token'

class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    componentDidMount() {
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
