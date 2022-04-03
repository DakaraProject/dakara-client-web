import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import {
    Link as OldLink,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams
} from 'react-router-dom'

/**
 * Add the location prop to a component
 */
export const withLocation = (Component) => (props) => (
    <Component
        location={useLocation()}
        {...props}
    />
)

/**
 * Add the params prop to a component
 */
export const withParams = (Component) => (props) => (
    <Component
        params={useParams()}
        {...props}
    />
)

/**
 * Add the navigate prop to a component
 */
export const withNavigate = (Component) => (props) => (
    <Component
        navigate={useNavigate()}
        {...props}
    />
)

/**
 * Add the searchParams and setSearchParams props to a component
 */
export const withSearchParams = (Component) => (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    return (
        <Component
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            {...props}
        />
    )
}

/**
 * Link that accepts an object as query string
 */
export default class Link extends Component {
    static propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]).isRequired,
    }

    render () {
        const { to, ...rest } = this.props

        // to can be a string or an object
        let newTo
        if (typeof(to) === 'object') {
            newTo = {...to, search: stringify(to.queryObj)}
        } else {
            newTo = to
        }

        return (
            <OldLink
                {...rest}
                to={newTo}
            >
                {this.props.children}
            </OldLink>
        )
    }
}
