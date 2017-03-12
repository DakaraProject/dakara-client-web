import React, { Component } from 'react'
import SongPageList from '../containers/SongPageList'
import LoginForm from '../containers/LoginForm'

class App extends Component {
    render() {
        if (this.props.isLoggedIn) {
            return (
                <div>
                    <SongPageList />
                    <button onClick={this.props.logout}>
                        Logout
                    </button>
                </div>
                )
        } else {
            return (
                <div>
                    <LoginForm />
                </div>
                )
        }
    }
}

export default App
