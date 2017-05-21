import React, { Component } from 'react'

export default class Delayer extends Component {
    state = {display: false}

    componentDidMount() {
        this.timeout = setTimeout( () => {
                this.setState({display: true})
            },
            this.props.delay
        )
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    render() {
        if (this.state.display) {
            return this.props.children
        }

        return null
    }
}
