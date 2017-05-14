import React, { Component } from 'react'

export default class Delayer extends Component {
    state = {display: false}

    componentWillMount() {
        setTimeout( () => {
                this.setState({display: true})
            },
            this.props.delay || 0
        )
    }

    render() {
        if (this.state.display) {
            return this.props.children
        }

        return null
    }
}
