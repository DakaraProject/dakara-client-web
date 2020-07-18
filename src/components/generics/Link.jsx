import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'

export default class extends Component {
    static propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]).isRequired,
    }

    render () {
        const { to, ...rest } = this.props

        // to can be a string or an object
        let newTo
        if (typeof(to) === 'object') {
            newTo = {...to, search: stringify(to.queryObj)}
        } else {
            newTo = to
        }

        return (
            <Link
                {...rest}
                to={newTo}
            >
                {this.props.children}
            </Link>
        )
    }
}
