import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Navigator from 'components/generics/Navigator'
import PlayedEntry from 'components/playlist/played/Entry'
import { playlistPlayedEntriesStatePropType } from 'reducers/playlist'

class Played extends Component {
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
                <PlayedEntry entry={entry} />
            </CSSTransition>
        ))

        return (
            <div id="played">
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

Played = connect(
    mapStateToProps,
    {}
)(Played)

export default Played
