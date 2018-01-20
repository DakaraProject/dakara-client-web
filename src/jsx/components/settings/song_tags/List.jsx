import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import { getSongTagList, editSongTag } from 'actions'
import Navigator from 'components/generics/Navigator'
import SongTagEntry from './Entry'

class SongTagList extends Component {
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
        const { entries, notifications, editSongTag, location, forms } = this.props

        const tagList = entries.data.results.map((tag) => {
            let notification = notifications[tag.id]
            const form = forms[`tagColorEdit${tag.id}`]
            let formNofitication
            if (form) {
                formNofitication = form.global
            }

            return (
                <SongTagEntry
                    key={tag.id}
                    tag={tag}
                    notification={notification}
                    formNofitication={formNofitication}
                    editSongTag={editSongTag}
                />
            )
        })

        return (
            <div className="box" id="song-tag-list">
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
    entries: state.library.songTags.entries,
    notifications: state.library.songTags.notifications,
    forms: state.forms
})

SongTagList = withRouter(connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
    }
)(SongTagList))

export default SongTagList
