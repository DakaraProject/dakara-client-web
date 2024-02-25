import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'
import {
    Navigate,
    Outlet,
} from 'react-router-dom'

import { withLocation } from 'components/adapted/ReactRouterDom'

class ProtectedRoute extends Component {
    static propTypes = {
        hasUserInfo: PropTypes.bool,
        isLoggedIn: PropTypes.bool,
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

export default ProtectedRoute
