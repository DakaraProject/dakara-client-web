import React, { Component } from 'react'


export default class Forbidden extends Component {
    render() {
        const fromUrl = this.props.location.query.from
        return (
                <div className="box" id="error-page">
                    <h2>Forbidden</h2>
                    <div className="from-url">{fromUrl}</div>
                    <p>We're sorry, you do not have the privilege to access this
                    ressource</p>
                </div>
       )
    }
}
