import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import { formatHourTime, params } from 'utils'
import { removeEntryFromPlaylist, clearPlaylistEntryNotification } from 'actions/playlist'
import PlaylistEntry from './Entry'
import Navigator from 'components/generics/Navigator'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { alterationStatusPropType, Status } from 'reducers/alterationsStatus'

class Playlist extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        statusRemoveEntry: alterationStatusPropType,
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        clearPlaylistEntryNotification: PropTypes.func.isRequired,
    }

    static defaultProps = {
        statusRemoveEntry: {},
    }

    render() {
        const { playlistEntries } = this.props.playlistEntriesState.data
        const { status } = this.props.playlistEntriesState
        const removeEntry = this.props.removeEntryFromPlaylist
        const statusRemoveEntry = this.props.statusRemoveEntry

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
                    statusRemoveEntry={statusRemoveEntry[entry.id]}
                />
            </CSSTransition>
        ))

        return (
            <div id="playlist" className="box">
                <ListingFetchWrapper
                    status={status}
                >
                    <TransitionGroup
                        component="ul"
                        className="listing"
                    >
                        {playlistEntriesComponent}
                    </TransitionGroup>
                </ListingFetchWrapper>
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
    statusRemoveEntry: state.alterationsStatus.removeEntryFromPlaylist,
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        removeEntryFromPlaylist,
        clearPlaylistEntryNotification
    }
)(Playlist))

export default Playlist
