import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSongTagList, editSongTag, clearTagListEntryNotification } from 'actions'
import Paginator from 'components/generics/Paginator'
import SongTagEntry from './Entry'

class SongTagList extends Component {
    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.query.page != prevProps.location.query.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const pageNumber = this.props.location.query.page
        this.props.getSongTagList(pageNumber)
    }

    render() {
        const { entries, notifications, editSongTag, location, forms } = this.props
        const { current, last } = entries.data

        const tagList = entries.data.results.map((tag) => {
            let notification = notifications[tag.id]
            const form = forms[`tagColorEdit${tag.id}`]
            let formNotification
            if (form) {
                formNotification = form.global
            }

            return (
                <SongTagEntry
                    key={tag.id}
                    tag={tag}
                    notification={notification}
                    formNotification={formNotification}
                    editSongTag={editSongTag}
                    clearTagListEntryNotification={this.props.clearTagListEntryNotification}
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
                <div className="navigator">
                    <Paginator
                        location={location}
                        current={current}
                        last={last}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    entries: state.library.songTags.entries,
    notifications: state.library.songTags.notifications,
    forms: state.forms
})

SongTagList = connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
        clearTagListEntryNotification
    }
)(SongTagList)

export default SongTagList
