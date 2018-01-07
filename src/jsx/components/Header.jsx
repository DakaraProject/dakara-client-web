import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
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
                    <NavLink
                        to="/library"
                        className="tab squared"
                        activeClassName="active"
                    >
                        <span className="icon">
                            <i className="fa fa-home"></i>
                        </span>
                    </NavLink>
                    <NavLink
                        to="/song-tags"
                        className="tab squared"
                        activeClassName="active"
                    >
                        <span className="icon">
                            <i className="fa fa-tags"></i>
                        </span>
                    </NavLink>
                    <NavLink
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
                    </NavLink>
                    <NavLink
                        to="/user"
                        className="tab"
                        activeClassName="active"
                    >
                        {username}
                    </NavLink>
                    <NavLink
                        to="/logout"
                        className="tab squared"
                    >
                        <span className="icon">
                            <i className="fa fa-sign-out"></i>
                        </span>
                    </NavLink>
                </nav>
            )
        }

        return (
            <header id="header" className="box">
                <h1>
                    <NavLink to="/">
                        Dakara
                    </NavLink>
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

Header = withRouter(connect(
    mapStateToProps
)(Header))

export default Header
