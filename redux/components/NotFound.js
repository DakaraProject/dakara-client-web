import React, { Component } from 'react'


export default class NotFound extends Component {
    render() {
        const fromUrl = this.props.location.query.from
        return (
                <div className="not-found">
                    <h2>Not found</h2>
                    <p>{fromUrl} did not match any route</p>
                </div>
       )
    }
}
