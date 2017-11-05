import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { defaultPathname } from '../index'

class LoggedinPage extends Component {
    redirect = () => {
        const { pathname, search } = this.props.location
        let query
        if (search || pathname != defaultPathname ) {
            query = {
                from: pathname + search
            }
        }

        browserHistory.push({
            pathname: "/login",
            query
        })
    }

    componentWillMount() {
        if (!this.props.isLoggedIn) {
            this.redirect()
            return
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoggedIn) {
            this.redirect()
        }
    }

    render() {
        // Only render when we're logged in and
        // We got current user info
        if (!(this.props.isLoggedIn && this.props.hasUserInfo)) {
            return null
        }

        return (
            <div id="logged-in">
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    hasUserInfo: !!state.authenticatedUsers
})

LoggedinPage = connect(
    mapStateToProps,
)(LoggedinPage)

export default LoggedinPage

