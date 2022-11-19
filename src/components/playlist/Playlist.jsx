import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

import Tab from 'components/generics/Tab'

export default class Playlist extends Component {

    render() {
        return (
            <div id="playlist" className="box">
                <nav className="tab-bar">
                    <Tab
                        to="/playlist/played"
                        iconName="chevron-left"
                        name="Played"
                    />
                    <Tab
                        to="/playlist/queueing"
                        iconName="chevron-right"
                        name="Queuing"
                    />
                </nav>
                <Outlet />
            </div>
        )
    }
}
