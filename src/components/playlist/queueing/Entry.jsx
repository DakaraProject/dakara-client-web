import classNames from 'classnames'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'

import { withNavigate } from 'components/adapted/ReactRouterDom'
import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import {
    IsPlaylistManager,
    IsPlaylistManagerOrOwner
} from 'components/permissions/Playlist'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import Song from 'components/song/Song'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

class Entry extends Component {
    static propTypes = {
        clearAlteration: PropTypes.func.isRequired,
        entry: playlistEntryPropType.isRequired,
        navigate: PropTypes.func.isRequired,
        onReorderButtonClick: PropTypes.func.isRequired,
        position: PropTypes.number.isRequired,
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
            position,
            reorderEntryPosition
        } = this.props
        const datePlay = Date.parse(entry.date_play)

        /**
         * Reorder button
         */
        let reorderIconName
        if (reorderEntryPosition !== null) {
            // if in reorder mode, display icon depending on the relative
            // position of the current entry and the entry to reorder
            if (reorderEntryPosition > position) {
                reorderIconName = 'arrow-up'
            } else if (reorderEntryPosition < position) {
                reorderIconName = 'arrow-down'
            } else {
                reorderIconName = 'ban'
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
                    <PlayQueueInfo
                        queueInfo={{timeOfPlay: datePlay, playlistEntry: entry}}
                    />
                    <div className="controls">
                        <IsPlaylistManager>
                            <button
                                className="control primary"
                                onClick={() => {
                                    onReorderButtonClick(entry.id, position)}
                                }
                            >
                                <span className="icon">
                                    <i className={`fa fa-${reorderIconName}`}></i>
                                </span>
                            </button>
                        </IsPlaylistManager>
                        <IsPlaylistManagerOrOwner object={entry} disable>
                            <button
                                className="control warning"
                                onClick={this.displayConfirm}
                            >
                                <span className="icon">
                                    <i className="fa fa-times"></i>
                                </span>
                            </button>
                        </IsPlaylistManagerOrOwner>
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

export default withNavigate(Entry)
