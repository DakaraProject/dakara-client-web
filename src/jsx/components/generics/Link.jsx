import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { stringify } from 'query-string'

export default class extends Component {
    render () {
        const { to, ...rest } = this.props

        return (
            <Link
                {...rest}
                to={{...to, search: stringify(to.query)}}
            >
                {this.props.children}
            </Link>
        )
    }
}
