import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
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

        if (this.props.notification){
            playlistEntryClass.push('delayed')
        }

        let confirmation
        if (this.state.confirmDisplayed) {
            confirmation = (
                <ConfirmationBar
                    onConfirm={() => {this.props.removeEntry(this.props.entry.id)}}
                    onCancel={this.clearConfirm}
                />
            )
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
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {confirmation}
                    </ReactCSSTransitionGroup>
                    <Notification notification={this.props.notification}/>
                </div>
            </li>
        )
    }
}

PlaylistEntry.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

export default PlaylistEntry
