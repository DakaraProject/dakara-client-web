import { connect } from 'react-redux'
import Player from '../components/Player'
import { loadPlayerStatus } from '../actions'

const mapStateToProps = (state) => ({
    playerStatus: state.player.status
})

const PlayerPage = connect(
    mapStateToProps,
    { loadPlayerStatus }
)(Player)

export default PlayerPage
