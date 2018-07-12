import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formatDuration, formatHourTime, formatTime } from 'utils'
import PropTypes from 'prop-types'

class TimeIntervalPlayer extends Component {
    static propTypes = {
        player: PropTypes.object.isRequired,
        playerInterval: PropTypes.number.isRequired,
        paused: PropTypes.bool.isRequired,
        inTransition: PropTypes.bool.isRequired,
        refreshInterval: PropTypes.number.isRequired,
    }

    static defaultProps = {
        refreshInterval: 1000,
    }

    state = {
        timeInterval: 0,
    }

    componentDidMount() {
        this.timeout = setTimeout(this.update)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    update = () => {
        const { player, playerInterval, paused, refreshInterval, inTransition } = this.props

        if (inTransition) {
            this.setState({timeInterval: 0})
        } else {
            if (paused) {
                this.setState({timeInterval: playerInterval})
            } else {
                this.setState({timeInterval: (
                    Date.now() - player.getTime() + playerInterval * 1000
                ) / 1000})
            }
        }

        this.timeout = setTimeout(this.update, refreshInterval)
    }

    render() {
        const { timeInterval } = this.state

        return (
            <time>{formatTime(timeInterval)}</time>
        )
    }
}

const mapStateToPropsTimeIntervalPlayer = (state) => ({
    paused: state.playlist.playerStatus.data.paused,
    inTransition: state.playlist.playerStatus.data.inTransition,
    player: state.playlist.playerStatus.date,
    playerInterval: state.playlist.playerStatus.data.timing,
})

TimeIntervalPlayer = connect(
    mapStateToPropsTimeIntervalPlayer,
    {}
)(TimeIntervalPlayer)

export {TimeIntervalPlayer}

class TimePlaylist extends Component {
    static propTypes = {
        playlist: PropTypes.object.isRequired,
        playlistInterval: PropTypes.number.isRequired,
        player: PropTypes.object.isRequired,
        playerInterval: PropTypes.number.isRequired,
        paused: PropTypes.bool.isRequired,
        refreshInterval: PropTypes.number.isRequired,
    }

    static defaultProps = {
        refreshInterval: 1000,
    }

    state = {
        time: new Date(),
    }

    componentDidMount() {
        this.timeout = setTimeout(this.update)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    update = () => {
        const { playlist, player, playlistInterval, playerInterval,
            paused, refreshInterval } = this.props

        if (paused) {
            this.setState({time: new Date(
                2 * playlist.getTime() - 2 * player.getTime() + Date.now()
                + playlistInterval * 1000 + playerInterval * 1000
            )})
        } else {
            this.setState({time: new Date(
                2 * playlist.getTime() - player.getTime()
                + playlistInterval * 1000 + playerInterval * 1000
            )})
        }

        this.timeout = setTimeout(this.update, refreshInterval)
    }

    render() {
        const { time } = this.state

        return (
            <time datetime={formatHourTime(time.getTime())}>
                {formatHourTime(time.getTime())}
            </time>
        )
    }
}

const mapStateToPropsTimePlaylist = (state) => ({
    paused: state.playlist.playerStatus.data.paused,
    playlist: state.playlist.entries.data.date,
    player: state.playlist.playerStatus.date,
    playerInterval: state.playlist.playerStatus.data.timing,
})

TimePlaylist = connect(
    mapStateToPropsTimePlaylist,
    {}
)(TimePlaylist)

export {TimePlaylist}
