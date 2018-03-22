import React, { Component } from 'react'
import { parse, stringify } from 'query-string'
import PropTypes from 'prop-types'
import ControlLink from './ControlLink'

export default class Navigator extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        names: PropTypes.shape({
            singular: PropTypes.string.isRequired,
            plural: PropTypes.string.isRequired,
        }), // should be isRequired
        pagination: PropTypes.shape({
            current: PropTypes.number.isRequired,
            last: PropTypes.number.isRequired,
        }).isRequired,
        count: PropTypes.number,
    }

    render() {
        const { location, names, count } = this.props
        const { current, last } = this.props.pagination

        const hasNext = current != last
        const hasPrevious = current != 1
        const pathname = location.pathname
        const queryObj = parse(location.search)

        let counter
        if (names && typeof count !== 'undefined') {
            counter = (
                <div className="counter">
                    <span className="figure">{count}</span>
                    <span className="text">{count == 1 ? names.singular : names.plural}</span>
                </div>
            )
        }

        return (
            <div className="navigator">
                <nav className="paginator controls">
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: 1}}}
                        disabled={!hasPrevious}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="fa fa-angle-double-left"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: current - 1}}}
                        disabled={!hasPrevious}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="fa fa-angle-left"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: current + 1}}}
                        disabled={!hasNext}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="fa fa-angle-right"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: last}}}
                        disabled={!hasNext}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="fa fa-angle-double-right"></i>
                        </span>
                    </ControlLink>
                </nav>
                {counter}
            </div>
        )
    }
}
