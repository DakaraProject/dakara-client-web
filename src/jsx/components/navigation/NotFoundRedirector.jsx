import React, { Component } from 'react'
import { browserHistory } from 'react-router'

export default class NotFoundRedirector extends Component {
    componentWillMount() {
        browserHistory.replace({pathname: "/404", query: {from: this.props.location.pathname}})
    }

    render() {
        return null
    }
}
