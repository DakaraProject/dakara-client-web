import React, { Component } from 'react';
import { Link } from 'react-router'

export default class extends Component {
    render () {
        const { to, disabled, className } = this.props
        if (disabled) {
            return (
                <div
                    className={"control disabled " + (className || "")}
                >
                    {this.props.children}
                </div>
            )
        }

        return (
            <Link
                to={to}
                className={"control " + (className || "")}
            >
                {this.props.children}
            </Link>
        )
    }
}

