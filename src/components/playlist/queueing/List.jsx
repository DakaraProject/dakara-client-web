import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { clearAlteration } from 'actions/alterations'
import { removeEntryFromPlaylist, reorderPlaylistEntry } from 'actions/playlist'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import PlaylistEntry from 'components/playlist/queueing/Entry'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { playlistEntriesStatePropType } from 'reducers/playlist'

class Queueing extends Component {
    static propTypes = {
        clearAlteration: PropTypes.func.isRequired,
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        reorderPlaylistEntry: PropTypes.func.isRequired,
        responseOfMultipleRemoveEntry: PropTypes.objectOf(alterationResponsePropType),
        responseOfMultipleReorderPlaylistEntry: PropTypes.objectOf(
            alterationResponsePropType
        ),
    }

    state = {
        reorderEntryId: null,
    }

    componentDidUpdate() {
        const { reorderEntryId } = this.state

        // when in reorder mode, if the entry to reorder has been removed, quit
        // reorder mode
        if (reorderEntryId !== null) {
            if (this.getEntryPosition(reorderEntryId) === -1) {
                this.setState({reorderEntryId: null})
            }
        }
    }

    /**
     * Get the position of an intry within the array of entries
     * @param entryId the ID of the entry to get the position of
     * @return the position of the entry, `null` if `entryId` is null, `-1` if
     * the entry was not found
     */
    getEntryPosition = (entryId) => {
        if (entryId === null) {
            return null
        }

        return this.props.playlistEntriesState.data.playlistEntries.findIndex(
            e => e.id === entryId
        )
    }

    /**
     * Callback passed to entries for their reorder button
     * @param id ID of the entry which button was clicked
     */
    onReorderButtonClick = (id) => {
        const { reorderEntryId } = this.state
        const { reorderPlaylistEntry } = this.props

        if (reorderEntryId !== null) {
            // if in reorder mode, reorderEntryId will be reordered relative to id
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
            // otherwise, assume the user wants to cancel

            // after reordering or cancel, quit reorder mode
            this.setState({
                reorderEntryId: null,
            })
        } else {
            // if not in reorder mode, enter reorder mode for the given id
            this.setState({
                reorderEntryId: id,
            })
        }
    }

    render() {
        const { playlistEntries } = this.props.playlistEntriesState.data
        const { status } = this.props.playlistEntriesState
        const {
            removeEntryFromPlaylist: removeEntry,
            responseOfMultipleRemoveEntry,
            responseOfMultipleReorderPlaylistEntry
        } = this.props
        const reorderEntryPosition = this.getEntryPosition(this.state.reorderEntryId)

        const playlistEntriesComponent = playlistEntries.map((entry, position) => (
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
                    responseOfReorderPlaylistEntry={
                        responseOfMultipleReorderPlaylistEntry[entry.id]
                    }
                    position={position}
                    onReorderButtonClick={this.onReorderButtonClick}
                    reorderEntryPosition={reorderEntryPosition}
                />
            </CSSTransition>
        ))

        return (
            <div id="queuing">
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
    // eslint-disable-next-line max-len
    responseOfMultipleRemoveEntry: state.alterationsResponse.multiple.removeEntryFromPlaylist || {},
    // eslint-disable-next-line max-len
    responseOfMultipleReorderPlaylistEntry: state.alterationsResponse.multiple.reorderPlaylistEntry || {},
})

Queueing = connect(
    mapStateToProps,
    {
        removeEntryFromPlaylist,
        clearAlteration,
        reorderPlaylistEntry
    }
)(Queueing)

export default Queueing
