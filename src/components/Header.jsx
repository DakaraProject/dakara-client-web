import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Tab from 'components/generics/Tab'
import { userPropType } from 'serverPropTypes/users'

class Header extends Component {
    static propTypes = {
        user: userPropType,
        isLoggedIn: PropTypes.bool.isRequired,
    }

    render() {
        let menu
        if (this.props.isLoggedIn) {
            let userTab
            if (this.props.user) {
                userTab = (
                    <Tab
                        to="/user"
                        iconName="user"
                        name={this.props.user.username}
                        extraClassName="no-name-mobile"
                    />
                )
            }

            menu = (
                <nav className="tab-bar menu">
                    <Tab
                        to="/library"
                        iconName="home"
                    />
                    <Tab
                        to="/playlist"
                        iconName="list-ol"
                    />
                    <Tab
                        to="/settings"
                        iconName="cog"
                    />
                    {userTab}
                    <Tab
                        to="/logout"
                        iconName="sign-out"
                    />
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
    user: state.authenticatedUser
})

Header = withRouter(connect(
    mapStateToProps
)(Header))

export default Header
