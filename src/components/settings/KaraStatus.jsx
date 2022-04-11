import React, { Component } from 'react'
import { connect } from 'react-redux'

import { CheckboxField, FormBlock} from 'components/generics/Form'
import { IsPlaylistManager} from 'components/permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { karaokeStatePropType } from 'reducers/playlist'
import { userPropType } from 'serverPropTypes/users'

class KaraStatus extends Component {
    static propTypes = {
        authenticatedUser: userPropType,
        karaokeState: karaokeStatePropType.isRequired,
    }

    render() {
        // render nothing if the kara status is being fetched
        if (this.props.karaokeState.status === Status.pending ||
            this.props.karaokeState.Status === null) return null

        const { authenticatedUser } = this.props
        const { data: karaoke } = this.props.karaokeState
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
                    <p>
                        Karaoke is not ongoing.
                        The player is stopped, the playlist is
                        empty and you can't add songs to it.
                    </p>
                )
            } else {
                karaStatusWidget = []
                if (karaoke.player_play_next_song) {
                    karaStatusWidget.push(
                        <p>
                            The player plays songs in the playlist.
                        </p>
                    )
                } else {
                    karaStatusWidget.push(
                        <p>
                            No additional song is played by the player,
                            which finishes playing its current song if any.
                        </p>
                    )
                }

                if (karaoke.can_add_to_playlist) {
                    karaStatusWidget.push(
                        <p>
                            Songs can be added to the playlist.
                        </p>
                    )
                } else {
                    karaStatusWidget.push(
                        <p>
                            Songs can't be added to the playlist.
                        </p>
                    )
                }
            }
        }

        return (
            <div id="kara-status" className="content">
                {karaStatusWidget}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    karaokeState: state.playlist.karaoke,
    authenticatedUser: state.authenticatedUser,
})

KaraStatus = connect(
    mapStateToProps,
    {}
)(KaraStatus)

export default KaraStatus
