import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class NotFound extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    }

    render() {
        const url = this.props.location.pathname
        return (
                <div className="box" id="error-page">
                    <div className="header">
                        <h2>Not found</h2>
                    </div>
                    <div className="url">{url}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
        )
    }
}
