import React, { Component } from 'react'

export default class SongLibraryEntry extends Component {
    state = {display: false}

    componentWillMount() {
        setTimeout( () => {
                this.setState({display: true})
            },
            this.props.delay
        )
    }

    render() {
        if (this.state.display) {
            return this.props.children
        }

        return null
    }
}
