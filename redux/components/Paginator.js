import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router'

export default class Paginator extends Component {
    render() {
        const { location, current, last } = this.props
        const hasNext = current != last
        const hasPrevious = current != 1
        const pathname = location.pathname

        return (
            <nav className="paginator controls">
                <PaginatorLink
                    to={{pathname, query: {...location.query, page: 1}}}
                    disabled={!hasPrevious}
                >
                    <i className="fa fa-angle-double-left"></i>
                </PaginatorLink>
                <PaginatorLink
                    to={{pathname, query: {...location.query, page: current - 1}}}
                    disabled={!hasPrevious}
                >
                    <i className="fa fa-angle-left"></i>
                </PaginatorLink>
                <PaginatorLink
                    to={{pathname, query: {...location.query, page: current + 1}}}
                    disabled={!hasNext}
                >
                    <i className="fa fa-angle-right"></i>
                </PaginatorLink>
                <PaginatorLink
                    to={{pathname, query: {...location.query, page: last}}}
                    disabled={!hasNext}
                >
                    <i className="fa fa-angle-double-right"></i>
                </PaginatorLink>
            </nav>
        );
    }
}

class PaginatorLink extends Component {
    render () {
        const { to, disabled } = this.props
        if (disabled) {
            return (
                <div className={"control primary disabled"}>{this.props.children}</div>
            )
        }

        return (
            <Link to={to} className={"control primary"}>{this.props.children}</Link>
        )
    }
}
