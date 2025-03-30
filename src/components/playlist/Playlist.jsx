import { Component } from 'react'
import { Outlet } from 'react-router'

import { Tab, Tabs } from 'components/generics/Tab'

export default class Playlist extends Component {
  render() {
    return (
      <div id="playlist" className="box">
        <Tabs>
          <Tab
            to="/playlist/queueing"
            iconName="chevron-right"
            name="Queuing"
          />
          <Tab to="/playlist/played" iconName="chevron-left" name="Played" />
          <Tab
            to="/playlist/player-errors"
            iconName="exclamation-triangle"
            name="Errors"
          />
        </Tabs>
        <Outlet />
      </div>
    )
  }
}
