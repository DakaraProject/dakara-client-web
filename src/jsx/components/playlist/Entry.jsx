import React, { Component } from 'react'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import Song from 'components/song/Song'
import { IsPlaylistManager, IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

class PlaylistEntry extends Component {
    static propTypes = {
        entry: playlistEntryPropType.isRequired,
        responseOfRemoveEntry: PropTypes.object,
        responseOfMultipleReorderPlaylistEntry: PropTypes.object,
        position: PropTypes.number.isRequired,
        reorderEntryPosition: PropTypes.number,
        onReorderButtonClick: PropTypes.func.isRequired,
        removeEntry: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    state = {
        confirmDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearAlteration("removeEntryFromPlaylist", this.props.entry.id)
        this.props.clearAlteration("reorderPlaylistEntry", this.props.entry.id)
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
        this.context.router.history.push({
            pathname: "/library/song",
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const { entry, onReorderButtonClick, position, reorderEntryPosition } = this.props
        const datePlay = Date.parse(entry.date_play)

        let reorderIconName
        if (reorderEntryPosition !== null) {
            if (reorderEntryPosition > position) {
                reorderIconName = "arrow-up"
            } else if (reorderEntryPosition < position) {
                reorderIconName = "arrow-down"
            } else {
                reorderIconName = "ban"
            }
        } else {
            reorderIconName = "random"
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
                    <PlayQueueInfo queueInfo={{timeOfPlay: datePlay, owner: entry.owner}}/>
                    <div className="controls">
                        <IsPlaylistManager>
                            <button
                                className="control primary"
                                onClick={() => {onReorderButtonClick(entry.id, position)}}
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

export default PlaylistEntry
