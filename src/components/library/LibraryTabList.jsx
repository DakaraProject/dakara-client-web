import React, { Component } from 'react'

import Tab from 'components/generics/Tab'
import { workTypeStatePropType } from 'reducers/library'

export default class LibraryTabList extends Component {
    static propTypes = {
        workTypeState: workTypeStatePropType.isRequired,
    }

    render() {
        // Work Types links
        const workTypesTabs = this.props.workTypeState.data.workTypes.map((workType) => (
                <Tab
                    key={workType.query_name}
                    to={`/library/${workType.query_name}`}
                    iconName={workType.icon_name}
                    name={workType.name_plural}
                />
            ))

        return (
            <nav className="tab-bar library-chooser">
                <Tab
                    to="/library/song"
                    iconName="bars"
                    extraClassName="home"
                />
                <Tab
                    to="/library/artist"
                    iconName="music"
                    name="Artists"
                />
                {workTypesTabs}
            </nav>
        )
    }
}
