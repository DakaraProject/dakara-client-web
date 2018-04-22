import React, { Component } from 'react'
import Tab from 'components/generics/Tab'

export default class PlaylistTabList extends Component {

    render() {
        return (
            <nav className="tab-bar">
                <Tab
                    to="/playlist/played"
                    iconName="fast-backward"
                    name="Past playlist"
                />
                <Tab
                    to="/playlist/queueing"
                    iconName="fast-forward"
                    name="Playlist"
                />
            </nav>
        )
    }
}
