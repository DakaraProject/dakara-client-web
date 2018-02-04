import React, { Component } from 'react'

export default class NotFound extends Component {
    render() {
        const url = this.props.location.pathname
        return (
                <div className="box" id="error-page">
                    <div className="box-header">
                        <h2>Not found</h2>
                    </div>
                    <div className="url">{url}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
        )
    }
}
