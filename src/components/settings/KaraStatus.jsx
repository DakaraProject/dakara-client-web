import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { FormBlock, CheckboxField} from 'components/generics/Form'
import { Status } from 'reducers/alterationsResponse'
import { IsPlaylistManager} from 'components/permissions/Playlist'

class SettingsKaraStatus extends Component {

    render() {
        // render nothing if the kara status is being fetched
        if (this.props.playlistDigestStatus === Status.pending ||
            this.props.playlistDigestStatus === null) return null

        const { authenticatedUser, karaoke } = this.props
        const isManager = IsPlaylistManager.hasPermission(authenticatedUser)

        let karaStatusWidget
        if (isManager) {
            karaStatusWidget = (
                <FormBlock
                    title="Edit kara status"
                    action="playlist/karaoke/"
                    method="PUT"
                    submitText="Set"
                    alterationName="editKaraStatus"
                    successMessage="Kara status sucessfully updated!"
                    noClearOnSuccess
                >
                    <CheckboxField
                        id="ongoing"
                        defaultValue={karaoke.ongoing}
                        label="Ongoing"
                    />
                    <CheckboxField
                        id="can_add_to_playlist"
                        defaultValue={karaoke.can_add_to_playlist}
                        label="Can add to playlist"
                        disabledBy="ongoing"
                    />
                    <CheckboxField
                        id="player_play_next_song"
                        defaultValue={karaoke.player_play_next_song}
                        label="Player play next song"
                        disabledBy="ongoing"
                    />
                </FormBlock>
            )
        } else {
            if (!karaoke.ongoing) {
                karaStatusWidget = (
                    <p className="status-text">
                        Karaoke is not ongoing.
                        The player is stopped, the playlist is
                        empty and you can't add songs to it.
                    </p>
                )
            } else {
                karaStatusWidget = []
                if (karaoke.player_play_next_song) {
                    karaStatusWidget.push(
                        <p className="status-text">
                            The player plays songs in the playlist.
                        </p>
                    )
                } else {
                    karaStatusWidget.push(
                        <p className="status-text">
                            No additional song is played by the player,
                            which finishes playing its current song if any.
                        </p>
                    )
                }

                if (karaoke.can_add_to_playlist) {
                    karaStatusWidget.push(
                        <p className="status-text">
                            Songs can be added to the playlist.
                        </p>
                    )
                } else {
                    karaStatusWidget.push(
                        <p className="status-text">
                            Songs can't be added to the playlist.
                        </p>
                    )
                }
            
            }
        }

        return (
            <div className="box" id="kara-status">
                <SettingsTabList/>
                <div className="status-text-container">
                    {karaStatusWidget}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigestStatus: state.playlist.digest.status,
    karaoke: state.playlist.digest.data.karaoke,
    authenticatedUser: state.authenticatedUser,
})

SettingsKaraStatus = connect(
    mapStateToProps,
    {}
)(SettingsKaraStatus)

export default SettingsKaraStatus
