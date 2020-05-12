import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import PlaylistPlayedEntry from './PlayedEntry'
import PlaylistTabList from './TabList'
import Navigator from 'components/generics/Navigator'
import { playlistPlayedEntriesStatePropType } from 'reducers/playlist'

class PlaylistPlayed extends Component {
    static propTypes = {
        playlistPlayedEntriesState: playlistPlayedEntriesStatePropType.isRequired,
    }

    render() {
        const { playlistPlayedEntries } = this.props.playlistPlayedEntriesState.data

        const playlistPlayedEntriesComponent = playlistPlayedEntries.map( entry => (
            <CSSTransition
                classNames='add-remove'
                timeout={{
                    enter: 300,
                    exit: 650
                }}
                key={entry.id}
            >
                <PlaylistPlayedEntry entry={entry} />
            </CSSTransition>
        ))

        return (
            <div id="playlist-played" className="box">
                <PlaylistTabList/>
                <TransitionGroup
                    component="ul"
                    className="listing"
                >
                    {playlistPlayedEntriesComponent}
                </TransitionGroup>
                <Navigator
                    count={playlistPlayedEntries.length}
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
    playlistPlayedEntriesState: state.playlist.playedEntries,
})

PlaylistPlayed = withRouter(connect(
    mapStateToProps,
    {}
)(PlaylistPlayed))

export default PlaylistPlayed
