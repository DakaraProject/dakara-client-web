import React, { Component } from 'react'

export default class NotFound extends Component {
    render() {
        const fromUrl = this.props.location.query.from
        return (
                <div className="box" id="error-page">
                    <h2>Not found</h2>
                    <div className="from-url">{fromUrl}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
       )
    }
}
