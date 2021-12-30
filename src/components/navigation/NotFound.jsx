import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class NotFound extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    }

    render() {
        const url = this.props.location.pathname
        return (
            <div id="error-page" className="box danger">
                <div className="header">
                    <h2>Not found</h2>
                </div>
                <div className="content">
                    <div className="url">{url}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
            </div>
        )
    }
}
