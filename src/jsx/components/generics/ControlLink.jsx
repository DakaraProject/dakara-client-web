import React, { Component } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

export default class ControlLink extends Component {
    render () {
        const { to, disabled, className } = this.props
        const classNamesArray = ['control', className]

        if (disabled) {
            return (
                <div
                    className={classNames(classNamesArray, 'disabled')}
                >
                    {this.props.children}
                </div>
            )
        }

        return (
            <Link
                to={to}
                className={classNames(classNamesArray)}
            >
                {this.props.children}
            </Link>
        )
    }
}
