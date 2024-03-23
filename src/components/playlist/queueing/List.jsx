import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { clearAlteration } from 'actions/alterations'
import {
    loadPlaylistEntries,
    removeEntryFromPlaylist,
    reorderPlaylistEntry
} from 'actions/playlist'
import { withSearchParams } from 'components/adapted/ReactRouterDom'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import PlaylistEntry from 'components/playlist/queueing/Entry'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'
import { queuingStatePropType } from 'reducers/playlist'
import {
    playlistEntriesStatePropType
} from 'reducers/playlistLive'
import { findLast } from 'utils'

class Queueing extends Component {
    static propTypes = {
        clearAlteration: PropTypes.func.isRequired,
        loadPlaylistEntries: PropTypes.func.isRequired,
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        playlistQueuingState: queuingStatePropType.isRequired,
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        reorderPlaylistEntry: PropTypes.func.isRequired,
        responseOfMultipleRemoveEntry: PropTypes.objectOf(alterationResponsePropType),
        responseOfMultipleReorderPlaylistEntry: PropTypes.objectOf(
            alterationResponsePropType
        ),
    }

    state = {
        reorderEntryId: null,
        transitionsEnabled: false,
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps, prevState) {
        // reset reorder entry ID
        if (this.state.reorderEntryId !== prevState.reorderEntryId) {
            const { reorderEntryId } = this.state

            // when in reorder mode, if the entry to reorder has been removed, quit
            // reorder mode
            if (reorderEntryId !== null) {
                if (this.getEntryPosition(reorderEntryId) === -1) {
                    this.setState({reorderEntryId: null})
                }
            }
        }

        // refresh if moved to a different page
        if (this.props.searchParams !== prevProps.searchParams) {
            this.setState({transitionsEnabled: false})
            this.refreshEntries()
        }

        // refresh if the playlist changed
        if (
            this.props.playlistEntriesState !== prevProps.playlistEntriesState &&
            this.props.playlistQueuingState.status !== Status.pending
        ) {
            const queuingId = this.props
                .playlistEntriesState.data.playlistEntries.filter(
                    e => !e.was_played
                ).map(e => e.id)
            const prevQueuingId = prevProps
                .playlistEntriesState.data.playlistEntries.filter(
                    e => !e.was_played
                ).map(e => e.id)
            if (
                queuingId.length !== prevQueuingId.length ||
                !queuingId.every((e, i) => e === prevQueuingId[i])
            ) {
                this.setState({transitionsEnabled: true})
                this.refreshEntries()
            }
        }

        // if the page of entries could not be obtained, request the previous
        // page
        if (
            this.props.playlistQueuingState.status === Status.failed &&
            this.props.searchParams.get('page') > 1
        ) {
            const page = this.props.searchParams.get('page')
            this.props.searchParams.delete('page')
            this.props.searchParams.append('page', page - 1)
            this.props.setSearchParams(this.props.searchParams)
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

        return this.props.playlistQueuingState.data.queuing.findIndex(
            e => e.id === entryId
        )
    }

    /**
     * Fetch queuing playlist entries from server
     */
    refreshEntries = () => {
        this.props.loadPlaylistEntries('queuing', {
            page: this.props.searchParams.get('page'),
        })
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
        const { transitionsEnabled } = this.state
        const {
            queuing,
            count,
            pagination
        } = this.props.playlistQueuingState.data
        const { status } = this.props.playlistQueuingState
        const { playlistEntries } = this.props.playlistEntriesState.data
        const {
            removeEntryFromPlaylist: removeEntry,
            responseOfMultipleRemoveEntry,
            responseOfMultipleReorderPlaylistEntry
        } = this.props
        const reorderEntryPosition = this.getEntryPosition(this.state.reorderEntryId)

        const firstId = playlistEntries.find(e => e.will_play)?.id
        const lastId = findLast(playlistEntries, e => e.will_play)?.id
        const isFirstPage = !this.props.searchParams.get('page') ||
            +this.props.searchParams.get('page') === 1
        const isLastPage = !this.props.searchParams.get('page') ||
            +this.props.searchParams.get('page') === pagination.last

        const queuingComponents = queuing.map((entry, position) => (
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
                    positions={{
                        position,
                        firstId,
                        lastId,
                        isFirstPage,
                        isLastPage,
                    }}
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
                        className="listing"
                        component="ul"
                        enter={transitionsEnabled}
                        exit={transitionsEnabled}
                    >
                        {queuingComponents}
                    </TransitionGroup>
                </ListingFetchWrapper>
                <Navigator
                    count={count}
                    pagination={pagination}
                    names={{
                        singular: 'entry',
                        plural: 'entries'
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistEntriesState: state.playlist.live.entries,
    playlistQueuingState: state.playlist.queuing,
    // eslint-disable-next-line max-len
    responseOfMultipleRemoveEntry: state.alterationsResponse.multiple.removeEntryFromPlaylist || {},
    // eslint-disable-next-line max-len
    responseOfMultipleReorderPlaylistEntry: state.alterationsResponse.multiple.reorderPlaylistEntry || {},
})

Queueing = withSearchParams(connect(
    mapStateToProps,
    {
        clearAlteration,
        loadPlaylistEntries,
        removeEntryFromPlaylist,
        reorderPlaylistEntry,
    }
)(Queueing))

export default Queueing
