import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'

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
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoggedIn) {
            this.redirect()
        }
    }

    render() {
        if (!this.props.isLoggedIn) {
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
    isLoggedIn: !!state.token
})

LoggedinPage = connect(
    mapStateToProps
)(LoggedinPage)

export default LoggedinPage

