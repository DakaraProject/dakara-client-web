import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { FormBlock, RadioField} from 'components/generics/Form'
import { Status } from 'reducers/alterationsStatus'

class SettingsKaraStatus extends Component {

    render() {
        // render nothing if the kara status is being fetched
        if (this.props.playlistAppDigestStatus === Status.pending ||
            this.props.playlistAppDigestStatus === null) return null

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

        return (
            <div className="box" id="kara-status">
                <SettingsTabList/>
                <div className="box-header">
                    <h1>Kara status management</h1>
                </div>
                <FormBlock
                    title="Edit kara status"
                    action="playlist/kara-status/"
                    method="PUT"
                    submitText="Set"
                    formName="editKaraStatus"
                    successMessage="Kara status sucessfully updated!"
                    noClearOnSuccess
                >
                    <RadioField
                        id="status"
                        defaultValue={this.props.karaStatus.status}
                        options={statusOptions}
                        long
                    />
                </FormBlock>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistAppDigestStatus: state.playlistApp.digest.status,
    karaStatus: state.playlistApp.digest.data.kara_status,
})

SettingsKaraStatus = connect(
    mapStateToProps,
    {}
)(SettingsKaraStatus)

export default SettingsKaraStatus
