import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Playlist() {
  return (
    <div id="playlist" className="box neutral">
      <TabBar>
        <Tab
          to="/playlist/queuing"
          iconName="chevron-right"
          name="Queuing"
          isDefault
        />
        <Tab to="/playlist/played" iconName="chevron-left" name="Played" />
        <Tab
          to="/playlist/player-errors"
          iconName="exclamation-triangle"
          name="Errors"
        />
      </TabBar>
      <Outlet />
    </div>
  )
}
