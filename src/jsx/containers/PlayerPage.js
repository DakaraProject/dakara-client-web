import { connect } from 'react-redux'
import Player from '../components/Player'
import { loadPlayerStatus, sendPlayerCommands } from '../actions'

const mapStateToProps = (state) => ({
    playerStatus: state.player.status,
    commands: state.player.commands,
    errorNotification: state.player.errorNotification
})

const PlayerPage = connect(
    mapStateToProps,
    { loadPlayerStatus, sendPlayerCommands }
)(Player)

export default PlayerPage
