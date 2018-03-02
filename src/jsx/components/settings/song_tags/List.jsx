import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { getSongTagList, editSongTag, clearTagListEntryNotification } from 'actions/songTags'
import Navigator from 'components/generics/Navigator'
import SongTagEntry from './Entry'
import SettingsTabList from '../TabList'

class SongTagList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        entries: PropTypes.shape({
            data: PropTypes.shape({
                results: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.any.isRequired,
                    }).isRequired,
                ),
            }).isRequired,
        }).isRequired,
        editStatus: PropTypes.object,
        formsResponse: PropTypes.object.isRequired,
        editSongTag: PropTypes.func.isRequired,
        getSongTagList: PropTypes.func.isRequired,
        clearTagListEntryNotification: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page != prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getSongTagList(pageNumber)
    }

    render() {
        const { entries, editsStatus, editSongTag, location, formsResponse } = this.props

        const tagList = entries.data.results.map((tag) => {
            let editStatus
            if (editsStatus) {
                editStatus = editsStatus[tag.id]
            }

            const formResponse = formsResponse[`tagColorEdit${tag.id}`]

            return (
                <SongTagEntry
                    key={tag.id}
                    tag={tag}
                    editStatus={editStatus}
                    formResponse={formResponse}
                    editSongTag={editSongTag}
                    clearTagListEntryNotification={this.props.clearTagListEntryNotification}
                />
            )
        })

        return (
            <div className="box" id="song-tag-list">
                <SettingsTabList/>
                <div className="box-header">
                    <h1>Song tags management</h1>
                </div>
                <div className="listing-table-container">
                    <table className="listing song-tag-list-listing notifiable">
                        <thead>
                            <tr className="listing-header">
                                <th className="name">Name</th>
                                <th className="enabled">Enabled</th>
                                <th className="color">Color</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagList}
                        </tbody>
                    </table>
                </div>
                <Navigator
                    data={entries.data}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    entries: state.settings.songTags.entries,
    editsStatus: state.alterationsStatus.editSongTag,
    formsResponse: state.forms
})

SongTagList = withRouter(connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
        clearTagListEntryNotification
    }
)(SongTagList))

export default SongTagList
