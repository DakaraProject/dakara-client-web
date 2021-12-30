import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import { Link as OldLink } from 'react-router-dom'

export default class Link extends Component {
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
            <OldLink
                {...rest}
                to={newTo}
            >
                {this.props.children}
            </OldLink>
        )
    }
}
