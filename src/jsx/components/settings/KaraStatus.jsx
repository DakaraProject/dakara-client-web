import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { FormBlock, RadioField} from 'components/generics/Form'
import { Status } from 'reducers/alterationsResponse'
import { IsPlaylistManager} from 'components/permissions/Playlist'

class SettingsKaraStatus extends Component {

    render() {
        // render nothing if the kara status is being fetched
        if (this.props.playlistDigestStatus === Status.pending ||
            this.props.playlistDigestStatus === null) return null

        const { authenticatedUser, karaStatus } = this.props
        const isManager = IsPlaylistManager.hasPermission(authenticatedUser)

        const statusOptions = [
            {
                value: 'play',
                name: "Playing: the player plays songs in the playlist, you \
                can add songs to it."
            },
            {
                value: 'pause',
                name: "Paused: no additional song is played by the player, \
                which finishes playing its current song. You can add songs \
                to the playlist."
            },
            {
                value: 'stop',
                name: "Stopped: the player stops playing, the playlist is \
                emptied and you can't add songs to it."
            },
        ]

        let karaStatusWidget
        if (isManager) {
            karaStatusWidget = (
                <FormBlock
                    title="Edit kara status"
                    action="playlist/kara-status/"
                    method="PUT"
                    submitText="Set"
                    alterationName="editKaraStatus"
                    successMessage="Kara status sucessfully updated!"
                    noClearOnSuccess
                >
                    <RadioField
                        id="status"
                        defaultValue={karaStatus.status}
                        options={statusOptions}
                        long
                    />
                </FormBlock>
            )
        } else {
            const status = statusOptions.find(e => (e.value == karaStatus.status))
            karaStatusWidget = (
                <p className="status-text">{status.name}</p>
            )
        }

        return (
            <div className="box" id="kara-status">
                <SettingsTabList/>
                {karaStatusWidget}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigestStatus: state.playlist.digest.status,
    karaStatus: state.playlist.digest.data.kara_status,
    authenticatedUser: state.authenticatedUser,
})

SettingsKaraStatus = connect(
    mapStateToProps,
    {}
)(SettingsKaraStatus)

export default SettingsKaraStatus
