import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { stringify } from 'query-string'
import { defaultPathname } from 'index'

class ProtectedRoute extends Component {
    static propTypes = {
        component: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]).isRequired,
        isLoggedIn: PropTypes.bool,
        hasUserInfo: PropTypes.bool,
    }

    render() {
        const { component: Component, isLoggedIn, hasUserInfo, ...rest } = this.props
        const renderFunction = (props) => {
            if (!isLoggedIn) {
                const { pathname, search } = this.props.location
                let queryObj
                if (search || pathname != defaultPathname ) {
                    queryObj = {
                        from: pathname + search
                    }
                }


                return (
                    <Redirect to={{
                        pathname: '/login',
                        search: stringify(queryObj)
                    }}/>
                )
            }

            if (!hasUserInfo) {
                return null
            }

            return (
                <Component {...props}/>
            )
        }

        return (
            <Route {...rest} render={renderFunction}/>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    hasUserInfo: !!state.authenticatedUsers
})

ProtectedRoute = withRouter(connect(
    mapStateToProps,
)(ProtectedRoute))

export {ProtectedRoute}
