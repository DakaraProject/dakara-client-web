import React, { Component } from 'react'

export default class Forbidden extends Component {
    render() {
        const url = this.props.location.pathname
        return (
                <div className="box" id="error-page">
                    <div className="box-header">
                        <h2>Forbidden</h2>
                    </div>
                    <div className="url">{url}</div>
                    <p>We're sorry, you do not have the privilege to access this
                    ressource</p>
                </div>
       )
    }
}
