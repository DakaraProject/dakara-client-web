import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'

import { withNavigate, withSearchParams } from 'components/adapted/ReactRouterDom'
import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'
import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { playerErrorPropType } from 'serverPropTypes/playlist'

dayjs.extend(localizedFormat)

class PlayerErrorsEntry extends Component {
    static propTypes = {
        playerError: playerErrorPropType.isRequired,
        navigate: PropTypes.func.isRequired,
    }

    /**
     * Search song associated to error playlist
     */
    handleSearch = () => {
        const { song } = this.props.playerError.playlist_entry
        const query = `title:""${song.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    /**
     * Toggle expanded view of error
     */
    setExpanded = (expanded) => {
        if (expanded) {
            this.props.searchParams.delete('expanded')
            this.props.searchParams.append('expanded', expanded)
        } else {
            this.props.searchParams.delete('expanded')
        }

        this.props.setSearchParams(this.props.searchParams)
    }

    render() {
        const { playerError } = this.props
        const {
            playlist_entry: entry,
            error_message: message,
            date_created: date
        } = playerError
        const expanded = +this.props.searchParams.get('expanded') === playerError.id

        return (
            <li
                className={
                    'listing-entry ' +
                    'library-entry library-entry-song ' +
                    'player-error-entry'
                }
            >
                <div
                    className={
                        'library-entry-song-compact player-errors-entry-song ' +
                        'hoverizable'
                    }
                >
                    <Song
                        song={entry.song}
                        handleClick={
                            () => {
                                expanded ?
                                    this.setExpanded() :
                                    this.setExpanded(playerError.id)
                            }
                        }
                    />
                    <div className="extra">
                        <PlaylistPositionInfo
                            entryPlayed={entry}
                        />
                    </div>
                </div>
                <CSSTransitionLazy
                    in={expanded}
                    classNames="expand-view"
                    timeout={{
                        enter: 600,
                        exit: 300
                    }}
                >
                    <div className='library-entry-song-expanded-wrapper'>
                        <div className="library-entry-song-expanded-subcontainer">
                            <div className="listing-details">
                                <div className="date entry">
                                    <h4 className="header">
                                        <span className="icon">
                                            <i className="las la-clock"></i>
                                        </span>
                                        <span className="name">Date</span>
                                    </h4>
                                    <div className="content">
                                        <div className="text">
                                            {dayjs(date).format('L LTS')}
                                        </div>
                                    </div>
                                </div>
                                <div className="date entry">
                                    <h4 className="header">
                                        <span className="icon">
                                            <i className="las la-file-alt"></i>
                                        </span>
                                        <span className="name">Error message</span>
                                    </h4>
                                    <div className="content">
                                        <div className="text">
                                            {message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransitionLazy>
            </li>
        )
    }
}

export default withNavigate(withSearchParams(PlayerErrorsEntry))
