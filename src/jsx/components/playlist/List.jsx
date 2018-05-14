import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import { removeEntryFromPlaylist, clearPlaylistEntryNotification } from 'actions/playlist'
import PlaylistEntry from './Entry'
import PlaylistTabList from './TabList'
import Navigator from 'components/generics/Navigator'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { alterationResponsePropType } from 'reducers/alterationsResponse'

class Playlist extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        responseOfMultipleRemoveEntry: PropTypes.objectOf(alterationResponsePropType),
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        clearPlaylistEntryNotification: PropTypes.func.isRequired,
    }

    render() {
        const { playlistEntries } = this.props.playlistEntriesState.data
        const { removeEntryFromPlaylist: removeEntry, responseOfMultipleRemoveEntry } = this.props

        const playlistEntriesComponent = playlistEntries.map( entry => (
            <CSSTransition
                classNames='add-remove'
                timeout={{
                    enter: 300,
                    exit: 650
                }}
                key={entry.id}
            >
                <PlaylistEntry
                    entry={entry}
                    removeEntry={removeEntry}
                    clearPlaylistEntryNotification={this.props.clearPlaylistEntryNotification}
                    responseOfRemoveEntry={responseOfMultipleRemoveEntry[entry.id]}
                />
            </CSSTransition>
        ))

        return (
            <div id="playlist" className="box">
                <PlaylistTabList/>
                <div className="box-header">
                    <h1>Playlist</h1>
                </div>
                <TransitionGroup
                    component="ul"
                    className="listing"
                >
                    {playlistEntriesComponent}
                </TransitionGroup>
                <Navigator
                    count={playlistEntries.length}
                    names={{
                        singular: 'song',
                        plural: 'songs'
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistEntriesState: state.playlist.entries,
    responseOfMultipleRemoveEntry: state.alterationsResponse.multiple.removeEntryFromPlaylist || {},
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        removeEntryFromPlaylist,
        clearPlaylistEntryNotification
    }
)(Playlist))

export default Playlist
