import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import Link from 'components/adapted/ReactRouterDom'

export default class ControlLink extends Component {
    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
        children: PropTypes.node,
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
