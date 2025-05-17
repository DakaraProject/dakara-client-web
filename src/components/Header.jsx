import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'
import { userPropType } from 'serverPropTypes/users'

class Header extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    user: userPropType,
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
            extraClassName="square-on-smartphone"
          />
        )
      }

      menu = (
        <TabBar>
          <Tab to="/library" iconName="home" />
          <Tab to="/playlist" iconName="list-ol" />
          <Tab to="/settings" iconName="cog" />
          {/* #if DEV */}
          <Tab to="/lab" iconName="vial" />
          {/* #endif */}
          {userTab}
          <Tab to="/logout" iconName="sign-out-alt" />
        </TabBar>
      )
    }

    return (
      <header id="header" className="box">
        <h1>
          <NavLink to="/">Dakara</NavLink>
        </h1>
        {menu}
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.token,
  user: state.authenticatedUser,
})

Header = connect(mapStateToProps)(Header)

export default Header
