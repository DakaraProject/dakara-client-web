import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LibraryTab from './LibraryTab'

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
                    <LibraryTab
                        key={workType.query_name}
                        queryName={workType.query_name}
                        iconName={workType.icon_name}
                        name={workType.name_plural}
                    />
            )
        })

        return (
            <nav className="tab-bar library-chooser">
                <LibraryTab
                    queryName="song"
                    iconName="bars"
                    extraClassName="home"
                />
                <LibraryTab
                    queryName="artist"
                    iconName="music"
                    name="Artists"
                />
                {workTypesTabs}
            </nav>
        )
    }
}
