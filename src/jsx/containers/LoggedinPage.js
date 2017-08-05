import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadCurrentUser } from '../actions'

class LoggedinPage extends Component {
    redirect = () => {
        const { pathname, search } = this.props.location
        browserHistory.push({
            pathname: "/login",
            query: {
                from: pathname + search
            }
        })
    }

    componentWillMount() {
        if (!this.props.isLoggedIn) {
            this.redirect()
            return
        }

        this.props.loadCurrentUser()
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
    hasUserInfo: !!state.users
})

LoggedinPage = connect(
    mapStateToProps,
    { loadCurrentUser }
)(LoggedinPage)

export default LoggedinPage

