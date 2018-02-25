import React, { Component } from 'react'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import utils from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'

class PlaylistEntry extends Component {
    static propTypes = {
        entry: PropTypes.shape({
            id: PropTypes.any.isRequired,
            song: PropTypes.shape({
                id: PropTypes.any.isRequired,
                title: PropTypes.string.isRequired,
            }).isRequired,
            owner: PropTypes.object.isRequired,
        }).isRequired,
        timeOfPlay: PropTypes.number.isRequired,
        removeEntryStatus: PropTypes.object,
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
        let message
        const playlistEntryClass = [
            'playlist-entry',
            'listing-entry',
            'library-entry',
            'library-entry-song',
            'hoverizable'
        ]

        if (this.props.removeEntryStatus) {
            playlistEntryClass.push('delayed')
        }

        return (
            <li className={classNames(playlistEntryClass)}>
                <div className="library-entry-song-compact notifiable">
                    <Song
                        song={this.props.entry.song}
                        handleClick={this.handleSearch}
                    />
                    <div className="playlist-info">
                        <UserWidget
                            className="owner"
                            user={this.props.entry.owner}
                        />
                        <div className="queueing">
                            <span className="icon">
                                <i className="fa fa-clock-o"></i>
                            </span>
                            {utils.formatHourTime(this.props.timeOfPlay)}
                        </div>
                    </div>
                    <div className="controls">
                        <IsPlaylistManagerOrOwner object={this.props.entry} disable>
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
                            onConfirm={() => {this.props.removeEntry(this.props.entry.id)}}
                            onCancel={this.clearConfirm}
                        />
                    </CSSTransitionLazy>
                    <Notification
                        alterationStatus={this.props.removeEntryStatus}
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
