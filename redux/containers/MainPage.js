import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux'
import { logout } from '../actions'

class LoggedinPage extends Component {
    componentWillMount() {
        if (!this.props.isLoggedIn) {
            browserHistory.push("/login")
        } 
    }

    componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoggedIn) {
            browserHistory.push("/login")
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.props.logout}>
                    Logout
                </button>
                <Link to="/library">Library</Link>
                <Link to="/user">User</Link>

                <div>player</div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

LoggedinPage = connect(
    mapStateToProps,
    { logout }
)(LoggedinPage)

export default LoggedinPage

