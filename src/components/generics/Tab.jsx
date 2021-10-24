import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class Tab extends Component {
    static propTypes = {
        name: PropTypes.string,
        extraClassName: PropTypes.string,
        iconName: PropTypes.string,
        to: PropTypes.string.isRequired,
    }

    render() {
        const { name, extraClassName, iconName, to } = this.props
        let tabName
        if (name) {
            tabName = (
                <span className="name">
                    {name}
                </span>
            )
        }

        // classes
        const linkClass = classNames(
            'tab',
            extraClassName,
            {
                squared: !name
            }
        )

        return (
                <NavLink
                    to={to}
                    className={linkClass}
                    activeClassName="active"
                >
                    <span className="icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </span>
                    {tabName}
                </NavLink>
                )
    }
}
