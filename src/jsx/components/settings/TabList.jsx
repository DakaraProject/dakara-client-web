import React, { Component } from 'react'
import Tab from 'components/generics/Tab'
import UsersList from './users/List'
import SongTagsList from './song_tags/List'

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
            </nav>
        )
    }
}
