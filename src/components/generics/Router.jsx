import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams
} from 'react-router-dom'

class ProtectedRoute extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool,
        hasUserInfo: PropTypes.bool,
    }

    render() {
        const { children, isLoggedIn, hasUserInfo } = this.props

        if (!isLoggedIn) {
            // if not logged, redirect to login page
            // and add desired page to query string
            const { pathname, search } = this.props.location
            const queryObj = {
                from: pathname + search
            }

            return (
                <Navigate
                    to={{
                        pathname: '/login',
                        search: stringify(queryObj)
                    }}
                    replace
                />
            )
        }

        if (!hasUserInfo) {
            // if no logging info can be obtained, render nothing
            return null
        }

        return children ? children : (<Outlet/>)
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    hasUserInfo: !!state.authenticatedUser
})

ProtectedRoute = connect(
    mapStateToProps,
)(ProtectedRoute)

export {ProtectedRoute}

export const withLocation = (Component) => (props) => (
    <Component
        location={useLocation()}
        {...props}
    />
)

export const withParams = (Component) => (props) => (
    <Component
        params={useParams()}
        {...props}
    />
)

export const withNavigate = (Component) => (props) => (
    <Component
        navigate={useNavigate()}
        {...props}
    />
)

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
