import React, { Component } from 'react'

import Tab from 'components/generics/Tab'

export default class SettingsTabList extends Component {

    render() {
        return (
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
            </nav>
        )
    }
}
