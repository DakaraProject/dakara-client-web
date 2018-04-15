import React, { Component } from 'react'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import Song from 'components/song/Song'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import DisabledFeedback from 'components/song/DisabledFeedback'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

class PlaylistEntry extends Component {
    static propTypes = {
        entry: playlistEntryPropType.isRequired,
        statusRemoveEntry: PropTypes.object,
        removeEntry: PropTypes.func.isRequired,
        clearPlaylistEntryNotification: PropTypes.func.isRequired,
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
        this.props.clearPlaylistEntryNotification(this.props.entry.id)
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
        const { entry } = this.props
        const datePlay = Date.parse(entry.date_play)

        return (
            <li className={classNames(
                'listing-entry',
                'playlist-entry',
                'library-entry',
                'library-entry-song',
                'hoverizable',
                {delayed: this.props.statusRemoveEntry}
            )}>
                <div className="library-entry-song-compact notifiable">
                    <DisabledFeedback tags={entry.song.tags}/>
                    <Song
                        song={entry.song}
                        handleClick={this.handleSearch}
                    />
                    <PlayQueueInfo queueInfo={{timeOfPlay: datePlay, owner: entry.owner}}/>
                    <div className="controls">
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
                        alterationStatus={this.props.statusRemoveEntry}
                        pendingMessage="Removing…"
                        successfulMessage="Successfuly removed!"
                        successfulDuration={null}
                        failedMessage="Error attempting to remove song from playlist"
                    />
                </div>
            </li>
        )
    }
}

export default PlaylistEntry
