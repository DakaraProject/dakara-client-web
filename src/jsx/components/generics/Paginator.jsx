import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router'
import ControlLink from './ControlLink'

export default class Paginator extends Component {
    render() {
        const { location, current, last } = this.props
        const hasNext = current != last
        const hasPrevious = current != 1
        const pathname = location.pathname

        return (
            <nav className="paginator controls">
                <ControlLink
                    to={{pathname, query: {...location.query, page: 1}}}
                    disabled={!hasPrevious}
                    className="primary"
                >
                    <span className="icon">
                        <i className="fa fa-angle-double-left"></i>
                    </span>
                </ControlLink>
                <ControlLink
                    to={{pathname, query: {...location.query, page: current - 1}}}
                    disabled={!hasPrevious}
                    className="primary"
                >
                    <span className="icon">
                        <i className="fa fa-angle-left"></i>
                    </span>
                </ControlLink>
                <ControlLink
                    to={{pathname, query: {...location.query, page: current + 1}}}
                    disabled={!hasNext}
                    className="primary"
                >
                    <span className="icon">
                        <i className="fa fa-angle-right"></i>
                    </span>
                </ControlLink>
                <ControlLink
                    to={{pathname, query: {...location.query, page: last}}}
                    disabled={!hasNext}
                    className="primary"
                >
                    <span className="icon">
                        <i className="fa fa-angle-double-right"></i>
                    </span>
                </ControlLink>
            </nav>
        );
    }
}
