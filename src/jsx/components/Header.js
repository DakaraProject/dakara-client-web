import React, { Component } from 'react'
import { Link } from 'react-router';

class Header extends Component {
    render() {
        let userSpace
        if (this.props.isLoggedIn) {
            userSpace = (
                <div className="user-space">
                    <Link to="/user" className="user-name">User</Link>
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
