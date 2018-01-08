import React, { Component } from 'react'

export default class NotFound extends Component {
    render() {
        const url = this.props.location.pathname
        return (
                <div className="box" id="error-page">
                    <h2>Not found</h2>
                    <div className="from-url">{url}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
        )
    }
}
