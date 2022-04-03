import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

import Tab from 'components/generics/Tab'

export default class Settings extends Component {

    render() {
        return (
            <div id="settings" className="box">
                <nav className="tab-bar">
                    <Tab
                        to="/settings/users"
                        iconName="users"
                        name="Users"
                    />
                    <Tab
                        to="/settings/song-tags"
                        iconName="tags"
                        name="Tags"
                    />
                    <Tab
                        to="/settings/kara-status"
                        iconName="check-square-o"
                        name="Kara status"
                    />
                    <Tab
                        to="/settings/kara-date-stop"
                        iconName="stop-circle-o"
                        name="Kara stop time"
                    />
                    <Tab
                        to="/settings/tokens"
                        iconName="user-circle"
                        name="Tokens"
                    />
                </nav>
                <Outlet />
            </div>
        )
    }
}
