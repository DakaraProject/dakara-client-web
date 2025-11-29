import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Settings() {
  return (
    <div id="settings" className="box neutral">
      <TabBar>
        <Tab to="/settings/users" iconName="users" name="Users" defaultRoute />
        <Tab to="/settings/song-tags" iconName="tags" name="Tags" />
        <Tab to="/settings/kara-status" iconName="play" name="Kara status" />
        <Tab
          to="/settings/kara-date-stop"
          iconName="clock"
          name="Kara stop time"
        />
        <Tab to="/settings/tokens" iconName="user-circle" name="Tokens" />
      </TabBar>
      <Outlet />
    </div>
  )
}
