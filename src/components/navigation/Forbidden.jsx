import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Forbidden extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    }

    render() {
        const url = this.props.location.pathname
        return (
                <div className="box" id="error-page">
                    <div className="header">
                        <h2>Forbidden</h2>
                    </div>
                    <div className="url">{url}</div>
                    <p>We're sorry, you do not have the privilege to access this
                    ressource</p>
                </div>
       )
    }
}
