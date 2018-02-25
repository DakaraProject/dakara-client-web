import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from './Link'
import classNames from 'classnames'

export default class ControlLink extends Component {
    static propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
        disabled: PropTypes.bool,
        className: PropTypes.string,
    }

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
