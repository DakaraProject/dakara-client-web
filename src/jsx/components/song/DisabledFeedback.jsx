import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { songTagPropType } from 'serverPropTypes/library'

export default class DisabledFeedback extends Component {
    static propTypes = {
        tags: PropTypes.arrayOf(songTagPropType).isRequired,
    }

    render() {
        if (!this.props.tags.some((item) => (item.disabled))) return null

        return (
            <div className="disabled-feedback">
                <span className="icon">
                    <i className="fa fa-eye-slash"></i>
                </span>
            </div>
        )
    }
}
