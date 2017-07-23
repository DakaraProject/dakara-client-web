import React, { Component } from 'react'
import { Link } from 'react-router';

class Header extends Component {
    render() {
        let userSpace
        if (this.props.isLoggedIn) {
            let username
            if (this.props.user) {
                username = this.props.user.username
            }

            userSpace = (
                <div className="user-space">
                    <Link to="/user" className="user-name">{username}</Link>
                    <Link to="/logout" className="logout">Logout</Link>
                </div>
                )
        }

        return (
            <header className="box">
                <h1>
                    <Link to="/">
                        Dakara
                    </Link>
                </h1>
                {userSpace}
            </header>
        )
    }
}

export default Header
