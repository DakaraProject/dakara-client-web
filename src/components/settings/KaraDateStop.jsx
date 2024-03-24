import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { CheckboxField, FormBlock, InputField } from 'components/generics/Form'
import { IsPlaylistManager} from 'components/permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { karaokeStatePropType } from 'reducers/playlist'
import { userPropType } from 'serverPropTypes/users'

dayjs.extend(customParseFormat)

class KaraDateStop extends Component {
    static propTypes = {
        authenticatedUser: userPropType,
        karaokeState: karaokeStatePropType.isRequired,
    }

    render() {
        // render nothing if the karaoke is being fetched
        if (this.props.karaokeState.status === Status.pending ||
            this.props.karaokeState.status === null) return null

        const { authenticatedUser } = this.props
        const { karaokeDateStop } = this.props.karaokeState.data
        const isManager = IsPlaylistManager.hasPermission(authenticatedUser)


        let karaDateStopWidget
        if (isManager) {
            const formatDateTime = values => {
                if (!values.enable_stop) {
                    return {
                        karaokeDateStop: null
                    }
                }
                // the form gives a time only, we parse it and add it to the
                // current day
                // if the created date is in the past, we add one day to it to
                // be in the future
                let date = dayjs(values.time_stop, 'HH:mm')
                if (date.isBefore()) {
                    date = date.add(1, 'days')
                }

                return {
                    karaokeDateStop: date.format()
                }
            }

            const validateTime = value => {
                if (/^\d{1,2}:\d{1,2}$/.test(value)) {
                    return []
                }

                return ['Invalid time, should be HH:mm.']
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
                        defaultValue={!!karaokeDateStop}
                        label="Enable stop time"
                    />
                    <InputField
                        id="time_stop"
                        defaultValue={
                            karaokeDateStop ?
                                dayjs(karaokeDateStop).format('HH:mm') :
                                ''
                        }
                        validate={validateTime}
                        type="time"
                        label="Set stop time"
                        disabledBy="enable_stop"
                    />
                </FormBlock>
            )
        } else {
            if (karaokeDateStop) {
                karaDateStopWidget = (
                    <p>Karaoke stop time: {
                        dayjs(karaokeDateStop).format('HH:mm')
                    }</p>
                )
            } else {
                karaDateStopWidget = (
                    <p>Karaoke stop time is not set.</p>
                )
            }
        }

        return (
            <div id="kara-date-stop" className="content">
                {karaDateStopWidget}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    karaokeState: state.playlist.karaoke,
    authenticatedUser: state.authenticatedUser,
})

KaraDateStop = connect(
    mapStateToProps,
    {}
)(KaraDateStop)

export default KaraDateStop
