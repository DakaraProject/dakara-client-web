import PropTypes from 'prop-types'
import { parse } from 'query-string'
import { Component } from 'react'

import { withLocation } from 'components/adapted/ReactRouterDom'
import ControlLink from 'components/generics/ControlLink'

class Navigator extends Component {
    static propTypes = {
        count: PropTypes.number,
        location: PropTypes.object.isRequired,
        names: PropTypes.shape({
            plural: PropTypes.string.isRequired,
            singular: PropTypes.string.isRequired,
        }),
        pagination: PropTypes.shape({
            current: PropTypes.number.isRequired,
            last: PropTypes.number.isRequired,
        }),
    }

    render() {
        const { location, names, count, pagination } = this.props

        /**
         * paginator
         */

        let paginator
        if (pagination) {
            const { current, last } = pagination

            const hasNext = current !== last
            const hasPrevious = current !== 1
            const pathname = location.pathname
            const queryObj = parse(location.search)

            paginator = (
                <nav className="paginator controls">
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: 1}}}
                        disabled={!hasPrevious}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="las la-angle-double-left"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: current - 1}}}
                        disabled={!hasPrevious}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="las la-angle-left"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: current + 1}}}
                        disabled={!hasNext}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="las la-angle-right"></i>
                        </span>
                    </ControlLink>
                    <ControlLink
                        to={{pathname, queryObj: {...queryObj, page: last}}}
                        disabled={!hasNext}
                        className="primary"
                    >
                        <span className="icon">
                            <i className="las la-angle-double-right"></i>
                        </span>
                    </ControlLink>
                </nav>
            )
        }

        /**
         * items counter
         */

        let counter
        if (names && typeof count !== 'undefined') {
            counter = (
                <div className="counter">
                    <span className="figure">{count}</span>
                    <span className="text">
                        {
                            count === 1 ?
                                names.singular :
                                names.plural
                        }
                    </span>
                </div>
            )
        }

        return (
            <div className="navigator">
                {paginator}
                {counter}
            </div>
        )
    }
}

Navigator = withLocation(Navigator)

export default Navigator
