import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import UserWidget from 'components/generics/UserWidget'

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
                        to="/song-tags"
                        className="tab squared"
                        activeClassName="active"
                    >
                        <span className="icon">
                            <i className="fa fa-tags"></i>
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

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    user: state.authenticatedUsers
})

Header = connect(
    mapStateToProps
)(Header)

export default Header
