import React, { Component } from 'react'
import { Link } from 'react-router';

class Header extends Component {
    render() {
        let userSpace
        if (this.props.isLoggedIn) {
            userSpace = (
                <div className="user-space">
                    <Link to="/user" className="user-name">User</Link>
                    <a href="#" onClick={this.props.logout} className="logout">
                        Logout
                    </a>
                </div>
                )
        }

        return (
            <header>
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

