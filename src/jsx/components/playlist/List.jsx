import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import { removeEntryFromPlaylist, reorderPlaylistEntry } from 'actions/playlist'
import { clearAlteration } from 'actions/alterations'
import PlaylistEntry from './Entry'
import PlaylistTabList from './TabList'
import Navigator from 'components/generics/Navigator'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { alterationResponsePropType } from 'reducers/alterationsResponse'

class Playlist extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        responseOfMultipleRemoveEntry: PropTypes.objectOf(alterationResponsePropType),
        responseOfMultipleReorderPlaylistEntry: PropTypes.objectOf(alterationResponsePropType),
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        reorderPlaylistEntry: PropTypes.func.isRequired
    }

    state = {
        reorderEntryId: null,
    }

    componentDidUpdate() {
        const { reorderEntryId } = this.state
        if (this.getEntryPosition(reorderEntryId) === -1) {
            this.setState({reorderEntryId: null})
        }
    }

    getEntryPosition = (entryId) => {
        if (entryId === null) {
            return null
        }
        return this.props.playlistEntriesState.data.playlistEntries.findIndex(
            e => e.id == entryId
        )
    }

    onReorderButtonClick = (id) => {
        const { reorderEntryId } = this.state
        const { reorderPlaylistEntry } = this.props

        if (reorderEntryId !== null) {
            const reorderEntryPosition = this.getEntryPosition(reorderEntryId)
            const position = this.getEntryPosition(id)
            if (reorderEntryPosition > position) {
                reorderPlaylistEntry({
                    playlistEntryId: reorderEntryId,
                    beforeId: id,
                })
            } else if (reorderEntryPosition < position) {
                reorderPlaylistEntry({
                    playlistEntryId: reorderEntryId,
                    afterId: id,
                })
            }

            this.setState({
                reorderEntryId: null,
            })
        } else {
            this.setState({
                reorderEntryId: id,
            })
        }

    }

    render() {
        const { playlistEntries } = this.props.playlistEntriesState.data
        const { status } = this.props.playlistEntriesState
        const { removeEntryFromPlaylist: removeEntry,
            responseOfMultipleRemoveEntry, responseOfMultipleReorderPlaylistEntry } = this.props
        const reorderEntryPosition = this.getEntryPosition(this.state.reorderEntryId)

        const playlistEntriesComponent = playlistEntries.map( (entry, position) => (
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
                    clearAlteration={this.props.clearAlteration}
                    responseOfRemoveEntry={responseOfMultipleRemoveEntry[entry.id]}
                    responseOfReorderPlaylistEntry={responseOfMultipleReorderPlaylistEntry[entry.id]}
                    position={position}
                    onReorderButtonClick={this.onReorderButtonClick}
                    reorderEntryPosition={reorderEntryPosition}
                />
            </CSSTransition>
        ))

        return (
            <div id="playlist" className="box">
                <ListingFetchWrapper
                    status={status}
                >
                    <PlaylistTabList/>
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
    responseOfMultipleRemoveEntry: state.alterationsResponse.multiple.removeEntryFromPlaylist || {},
    responseOfMultipleReorderPlaylistEntry: state.alterationsResponse.multiple.reorderPlaylistEntry || {},
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        removeEntryFromPlaylist,
        clearAlteration,
        reorderPlaylistEntry
    }
)(Playlist))

export default Playlist
