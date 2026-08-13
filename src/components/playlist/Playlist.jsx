import { useState } from 'react'
import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Playlist() {
  const [searchBoxQuery, setSearchBoxQuery] = useState('')

  return (
    <div id="playlist" className="box neutral">
      <title>Dakara playlist</title>
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
      <Outlet context={[searchBoxQuery, setSearchBoxQuery]} />
    </div>
  )
}
