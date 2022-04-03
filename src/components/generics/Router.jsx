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

class ProtectedRoute extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool,
        hasUserInfo: PropTypes.bool,
        location: PropTypes.object.isRequired,
    }

    /**
     * Add desired page to query string
     */
    createQueryFrom = () => {
        const { pathname, search } = this.props.location

        // if pathname is the root page, ignore it
        let actualPathname = ''
        if (pathname !== '/') {
            actualPathname = pathname
        }

        // if desired page is the root page, ignore it
        const query = actualPathname + search
        if (query.length === 0) {
            return {}
        }

        return {
            from: actualPathname + search
        }
    }

    render() {
        const { children, isLoggedIn, hasUserInfo } = this.props

        if (!isLoggedIn) {
            // if not logged, redirect to login page
            return (
                <Navigate
                    to={{
                        pathname: '/login',
                        search: stringify(this.createQueryFrom())
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

ProtectedRoute = withLocation(connect(
    mapStateToProps,
)(ProtectedRoute))

export {ProtectedRoute}
