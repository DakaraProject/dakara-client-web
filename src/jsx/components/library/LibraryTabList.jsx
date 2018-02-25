import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tab from 'components/generics/Tab'

export default class LibraryTabList extends Component {
    static propTypes = {
        workTypes: PropTypes.shape({
            data: PropTypes.shape({
                results: PropTypes.arrayOf(PropTypes.shape({
                    query_name: PropTypes.string.isRequired,
                    icon_name: PropTypes.string.isRequired,
                    name_plural: PropTypes.string.isRequired,
                }).isRequired).isRequired,
            }).isRequired,
        }).isRequired,
    }

    render() {
        // Work Types links
        const workTypesTabs = this.props.workTypes.data.results.map(function(workType) {
            return (
                    <Tab
                        key={workType.query_name}
                        to={`/library/${workType.query_name}`}
                        iconName={workType.icon_name}
                        name={workType.name_plural}
                    />
            )
        })

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
