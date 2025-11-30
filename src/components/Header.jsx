import { useSelector } from 'react-redux'
import { NavLink } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Header() {
  const user = useSelector((state) => state.authenticatedUser)
  const isLoggedIn = useSelector((state) => !!state.token)

  let menu
  if (isLoggedIn) {
    let userTab
    if (user) {
      userTab = (
        <Tab
          to="/user"
          iconName="user"
          name={user.username}
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
