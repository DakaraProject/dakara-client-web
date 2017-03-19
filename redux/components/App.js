import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import SongPageList from '../containers/SongPageList'
import LoginForm from '../containers/LoginForm'

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
                <SongPageList />
                <button onClick={this.props.logout}>
                    Logout
                </button>
            </div>
        )
    }
}

export default App
