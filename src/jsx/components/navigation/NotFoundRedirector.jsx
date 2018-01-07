import React, { Component } from 'react'
import PropTypes from 'prop-types'

class NotFoundRedirector extends Component {
    componentWillMount() {
        this.context.router.history.replace({pathname: "/404", query: {from: this.props.location.pathname}})
    }

    render() {
        return null
    }
}

NotFoundRedirector.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

export default NotFoundRedirector
