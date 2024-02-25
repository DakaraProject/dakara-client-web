import classNames from 'classnames'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withNavigate,withSearchParams } from 'components/adapted/ReactRouterDom'
import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import {
    IsPlaylistManager,
    IsPlaylistManagerOrOwner
} from 'components/permissions/Playlist'
import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

class Entry extends Component {
    static propTypes = {
        clearAlteration: PropTypes.func.isRequired,
        entry: playlistEntryPropType.isRequired,
        navigate: PropTypes.func.isRequired,
        onReorderButtonClick: PropTypes.func.isRequired,
        playlistEntries: PropTypes.arrayOf(
            playlistEntryPropType
        ).isRequired,
        positions: PropTypes.shape({
            position: PropTypes.number.isRequired,
            firstId: PropTypes.number,
            lastId: PropTypes.number,
            isFirstPage: PropTypes.bool,
            isLastPage: PropTypes.bool,
        }).isRequired,
        removeEntry: PropTypes.func.isRequired,
        reorderEntryPosition: PropTypes.number,
        responseOfMultipleReorderPlaylistEntry: PropTypes.object,
        responseOfRemoveEntry: PropTypes.object,
    }

    state = {
        confirmDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearAlteration('removeEntryFromPlaylist', this.props.entry.id)
        this.props.clearAlteration('reorderPlaylistEntry', this.props.entry.id)
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    handleSearch = () => {
        const song = this.props.entry.song
        const query = `title:""${song.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const {
            entry,
            onReorderButtonClick,
            positions,
            reorderEntryPosition,
            playlistEntries,
        } = this.props

        /**
         * Reorder buttons
         */
        let reorderIconName
        let reorderFirstButton
        let reorderLastButton
        if (reorderEntryPosition !== null) {
            // if in reorder mode, display icon depending on the relative
            // position of the current entry and the entry to reorder
            if (reorderEntryPosition > positions.position) {
                reorderIconName = 'arrow-up'
            } else if (reorderEntryPosition < positions.position) {
                reorderIconName = 'arrow-down'
            } else {
                reorderIconName = 'ban'

                // display reorder first button if not on first page
                if (!positions.isFirstPage) {
                    reorderFirstButton = (
                        <button
                            className="control primary"
                            onClick={() => {
                                onReorderButtonClick(positions.firstId)}
                            }
                        >
                            <span className="icon double">
                                <i className={'las la-arrow-up'}></i>
                                <i className={'las la-arrow-up'}></i>
                            </span>
                        </button>
                    )
                }

                // display reorder last button if not on last page
                if (!positions.isLastPage) {
                    reorderLastButton = (
                        <button
                            className="control primary"
                            onClick={() => {
                                onReorderButtonClick(positions.lastId)}
                            }
                        >
                            <span className="icon double">
                                <i className={'las la-arrow-down'}></i>
                                <i className={'las la-arrow-down'}></i>
                            </span>
                        </button>
                    )
                }
            }
        } else {
            // if not in reorder mode, display reorder icon
            reorderIconName = 'random'
        }

        return (
            <li className={classNames(
                'listing-entry',
                'playlist-entry',
                'library-entry',
                'library-entry-song',
                'hoverizable',
                {delayed: this.props.responseOfRemoveEntry}
            )}>
                <div className="library-entry-song-compact notifiable">
                    <Song
                        song={entry.song}
                        handleClick={this.handleSearch}
                    />
                    <div className="extra">
                        <PlaylistPositionInfo
                            entryQueuing={playlistEntries.find(e => e.id === entry.id)}
                        />
                        <div className="controls">
                            <IsPlaylistManager>
                                {reorderFirstButton}
                                {reorderLastButton}
                                <button
                                    className="control primary"
                                    onClick={() => {
                                        onReorderButtonClick(entry.id)
                                    }}
                                >
                                    <span className="icon">
                                        <i className={`las la-${reorderIconName}`}></i>
                                    </span>
                                </button>
                            </IsPlaylistManager>
                            <IsPlaylistManagerOrOwner object={entry} disable>
                                <button
                                    className="control warning"
                                    onClick={this.displayConfirm}
                                >
                                    <span className="icon">
                                        <i className="las la-times"></i>
                                    </span>
                                </button>
                            </IsPlaylistManagerOrOwner>
                        </div>
                    </div>
                    <CSSTransitionLazy
                        in={this.state.confirmDisplayed}
                        classNames="notified"
                        timeout={{
                            enter: 300,
                            exit: 150
                        }}
                    >
                        <ConfirmationBar
                            onConfirm={() => {this.props.removeEntry(entry.id)}}
                            onCancel={this.clearConfirm}
                        />
                    </CSSTransitionLazy>
                    <Notification
                        alterationResponse={this.props.responseOfRemoveEntry}
                        pendingMessage="Removing…"
                        successfulMessage="Successfuly removed!"
                        successfulDuration={null}
                        failedMessage="Error attempting to remove song from playlist"
                    />
                    <Notification
                        alterationResponse={this.props.responseOfReorderPlaylistEntry}
                        pendingMessage={false}
                        successfulMessage={false}
                        failedMessage="Error attempting to reorder playlist"
                    />
                </div>
            </li>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    playlistEntries: state.playlist.entries.data.playlistEntries,
})

Entry = withSearchParams(withNavigate(connect(
    mapStateToProps,
    {}
)(Entry)))

export default Entry
