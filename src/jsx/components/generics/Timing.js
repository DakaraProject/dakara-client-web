import React, { Component } from 'react'
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import { formatDuration, formatHourTime, formatTime } from 'utils'
import PropTypes from 'prop-types'

class TimingPlayer extends Component {
    static propTypes = {
        playerDate: PropTypes.string.isRequired,
        playerTiming: PropTypes.number.isRequired,
        paused: PropTypes.bool.isRequired,
        inTransition: PropTypes.bool.isRequired,
        refreshInterval: PropTypes.number.isRequired,
    }

    static defaultProps = {
        refreshInterval: 1000,
    }

    state = {
        timing: 0,
    }

    componentDidMount() {
        this.timeout = setTimeout(this.update)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    update = () => {
        const { playerDate, playerTiming, paused, refreshInterval, inTransition } = this.props

        if (inTransition) {
            this.setState({timing: 0})
        } else {
            if (paused) {
                this.setState({timing: playerTiming})
            } else {
                this.setState({timing: dayjs().diff(playerDate, 'seconds') + playerTiming})
            }
        }

        this.timeout = setTimeout(this.update, refreshInterval)
    }

    render() {
        const { timing } = this.state

        return (
            <time>{formatTime(timing)}</time>
        )
    }
}

const mapStateToPropsTimingPlayer = (state) => ({
    paused: state.playlist.digest.data.player_status.paused,
    inTransition: state.playlist.digest.data.player_status.in_transition,
    playerDate: state.playlist.digest.data.player_status.date,
    playerTiming: state.playlist.digest.data.player_status.timing,
})

TimingPlayer = connect(
    mapStateToPropsTimingPlayer,
    {}
)(TimingPlayer)

export {TimingPlayer}

class TimePlaylist extends Component {
    static propTypes = {
        playlistDate: PropTypes.object.isRequired,
        playlistTiming: PropTypes.number.isRequired,
        playerDate: PropTypes.object.isRequired,
        playerTiming: PropTypes.number.isRequired,
        paused: PropTypes.bool.isRequired,
        refreshInterval: PropTypes.number.isRequired,
    }

    static defaultProps = {
        refreshInterval: 1000,
    }

    state = {
        date: new Date(),
    }

    componentDidMount() {
        this.timeout = setTimeout(this.update)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    update = () => {
        const { playlistDate, playerDate, playlistTiming, playerTiming,
            paused, refreshInterval } = this.props

        if (paused) {
            this.setState({date: dayjs().add(
                2 * dayjs(playlistDate).diff(playerDate, 'seconds')
                + playlistTiming + playerTiming,
                'seconds'
            )})
        } else {
            this.setState({date: dayjs(playlistDate).add(
                dayjs(playlistDate).diff(playerDate, 'seconds')
                + playerTiming + playerTiming,
                'seconds'
            )})
        }

        this.timeout = setTimeout(this.update, refreshInterval)
    }

    render() {
        const { date } = this.state

        return (
            <time datetime={date.format()}>
                {date.format('HH:mm')}
            </time>
        )
    }
}

const mapStateToPropsTimePlaylist = (state) => ({
    paused: state.playlist.digest.data.player_status.paused,
    playlistDate: state.playlist.entries.data.date, // ???
    playerDate: state.playlist.digest.data.player_status.date,
    playerTiming: state.playlist.digest.data.player_status.timing,
})

TimePlaylist = connect(
    mapStateToPropsTimePlaylist,
    {}
)(TimePlaylist)

export {TimePlaylist}
