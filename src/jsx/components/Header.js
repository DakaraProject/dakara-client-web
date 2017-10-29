import React, { Component } from 'react'
import { Link } from 'react-router'
import UserWidget from '../containers/UserWidget'

class Header extends Component {
    render() {
        let menu
        if (this.props.isLoggedIn) {
            let username
            if (this.props.user) {
                username = (
                    <UserWidget
                        user={this.props.user}
                    />
                )
            }

            menu = (
                <nav className="tab-bar menu">
                    <Link
                        to="/library"
                        className="tab squared"
                        activeClassName="active"
                    >
                        <span className="icon">
                            <i className="fa fa-home"></i>
                        </span>
                    </Link>
                    <Link
                        to="/users"
                        className="tab squared"
                        activeClassName="active"
                    >
                        <span
                            className="icon"
                            style={{fontSize: "1em"}}
                        >
                            <i className="fa fa-users"></i>
                        </span>
                    </Link>
                    <Link
                        to="/user"
                        className="tab"
                        activeClassName="active"
                    >
                        {username}
                    </Link>
                    <Link
                        to="/logout"
                        className="tab squared"
                    >
                        <span className="icon">
                            <i className="fa fa-sign-out"></i>
                        </span>
                    </Link>
                </nav>
            )
        }

        return (
            <header id="header" className="box">
                <h1>
                    <Link to="/">
                        Dakara
                    </Link>
                </h1>
                {menu}
            </header>
        )
    }
}

export default Header
