import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router';

class App extends Component {
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

export default App
