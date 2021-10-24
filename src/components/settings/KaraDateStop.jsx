import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { CheckboxField, FormBlock, InputField } from 'components/generics/Form'
import { IsPlaylistManager} from 'components/permissions/Playlist'
import SettingsTabList from 'components/settings/TabList'
import { Status } from 'reducers/alterationsResponse'

dayjs.extend(customParseFormat)

class SettingsKaraDateStop extends Component {

    render() {
        // render nothing if the karaoke is being fetched
        if (this.props.playlistDigestStatus === Status.pending ||
            this.props.playlistDigestStatus === null) return null

        const { authenticatedUser, karaoke } = this.props
        const { date_stop } = karaoke
        const isManager = IsPlaylistManager.hasPermission(authenticatedUser)


        let karaDateStopWidget
        if (isManager) {
            const formatDateTime = values => {
                if (!values.enable_stop) {
                    return {
                        date_stop: null
                    }
                }
                // the form gives a time only, we parse it and add it to the
                // current day
                // if the created date is in the past, we add one day to it to
                // be in the future
                let date = dayjs(values.time_stop, "HH:mm")
                if (date.isBefore()) {
                    date = date.add(1, 'days')
                }

                return {
                    date_stop: date.format()
                }
            }

            const validateTime = value => {
                if (/^\d{1,2}:\d{1,2}$/.test(value)) {
                    return []
                }

                return ["Invalid time, should be HH:mm."]
            }

            karaDateStopWidget = (
                <FormBlock
                    title="Edit kara stop time"
                    action="playlist/karaoke/"
                    method="PUT"
                    submitText="Set"
                    alterationName="editKaraDateStop"
                    successMessage="Kara stop time sucessfully updated!"
                    noClearOnSuccess
                    formatValues={formatDateTime}
                >
                    <CheckboxField
                        id="enable_stop"
                        defaultValue={!!date_stop}
                        label="Enable stop time"
                    />
                    <InputField
                        id="time_stop"
                        defaultValue={date_stop? dayjs(date_stop).format("HH:mm") : ""}
                        validate={validateTime}
                        type="time"
                        label="Set stop time"
                        disabledBy="enable_stop"
                    />
                </FormBlock>
            )
        } else {
            if (date_stop) {
                karaDateStopWidget = (
                    <p>Karaoke stop time: {dayjs(date_stop).format("HH:mm")}</p>
                )
            } else {
                karaDateStopWidget = (
                    <p>Karaoke stop time is not set.</p>
                )
            }
        }

        return (
            <div id="kara-date-stop" className="box">
                <SettingsTabList/>
                <div className="content">
                    {karaDateStopWidget}
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

SettingsKaraDateStop = connect(
    mapStateToProps,
    {}
)(SettingsKaraDateStop)

export default SettingsKaraDateStop
