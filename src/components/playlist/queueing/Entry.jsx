import classNames from 'classnames'
import {
    IsPlaylistManager,
    IsPlaylistManagerOrOwner
} from 'permissions/Playlist'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'
import { withNavigate,withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification from 'components/generics/Notification'
import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
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
        responseOfRemoveEntry: alterationResponsePropType,
        responseOfReorderPlaylistEntry: alterationResponsePropType,
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
            search: queryString.stringify({
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
        const createReorderButton = (id, iconName, extraClassName = '') => (
            <button
                className="control primary"
                onClick={() => {
                    onReorderButtonClick(id)}
                }
            >
                <span className="icon">
                    <i className={`las la-${iconName} ${extraClassName}`}></i>
                </span>
            </button>
        )
        let reorderButton
        let reorderExtraButtons
        if (reorderEntryPosition !== null) {
            // if in reorder mode, display icon depending on the relative
            // position of the current entry and the entry to reorder
            if (reorderEntryPosition > positions.position) {
                reorderButton = createReorderButton(entry.id, 'arrow-up')
            } else if (reorderEntryPosition < positions.position) {
                reorderButton = createReorderButton(entry.id, 'arrow-down')
            } else {
                reorderButton = createReorderButton(entry.id, 'ban')
                reorderExtraButtons = (
                    <>
                        {createReorderButton(positions.firstId, 'arrow-up', 'overbar')}
                        {createReorderButton(
                            positions.lastId, 'arrow-down', 'underbar')}
                    </>
                )
            }
        } else {
            // if not in reorder mode, display reorder icon
            reorderButton = createReorderButton(entry.id, 'arrows-alt-v')
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
                        <div className="controls main">
                            <IsPlaylistManager>
                                <CSSTransitionLazy
                                    in={!!reorderExtraButtons}
                                    classNames="displayed"
                                    timeout={{
                                        enter: 3000,
                                        exit: 1500
                                    }}
                                >
                                    <div className="subcontrols">
                                        {reorderExtraButtons}
                                    </div>
                                </CSSTransitionLazy>
                                {reorderButton}
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
    playlistEntries: state.playlist.digest.entries.data.playlistEntries,
})

Entry = withSearchParams(withNavigate(connect(
    mapStateToProps,
    {}
)(Entry)))

export default Entry
