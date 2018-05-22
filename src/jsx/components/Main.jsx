import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { loadCurrentUser } from 'actions/authenticatedUser'
import Header from './Header'
import Footer from './Footer'
import PlaylistApp from './playlistApp/PlaylistApp'
import { IsAuthenticated } from './permissions/Base'
import { loadWorkTypes } from 'actions/library'

class Main extends Component {
    playlistAppWrapperRef = React.createRef()

    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        loadCurrentUser: PropTypes.func.isRequired,
        loadWorkTypes: PropTypes.func.isRequired,
    }

    componentWillMount() {
        if (this.props.isLoggedIn) {
            this.props.loadCurrentUser()
            this.props.loadWorkTypes()
        }
    }

    componentWillUpdate(nextProps) {
        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.props.loadCurrentUser()
            this.props.loadWorkTypes()
        }
    }

    render() {
        return (
            <div id="main">
                <Header/>
                <div id="playlist-app-wrapper" ref={this.playlistAppWrapperRef}>
                    <IsAuthenticated>
                        <PlaylistApp/>
                    </IsAuthenticated>
                </div>
                <div id="content">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
})

Main = withRouter(connect(
    mapStateToProps,
    {
        loadCurrentUser,
        loadWorkTypes
    }
)(Main))

export default Main


/**
 * Content component
 *
 * This component needs some rework to be used.
 *
 * This component bahaves like a magnet for the scrollbar. When the user scrolls
 * passed to a certain thresold arount its top berder, the window is attracted to
 * it and scrolls smoothly to its position. To avoid a "scroll trap", the window
 * scrolls only if the user is scrolling in the appropriate way (approaching the
 * top border, not going away from it).
 */
class Content extends Component {
    elementRef = React.createRef()

    state = {
        latestPosition: 0,
    }

    static propTypes = {
        thresold: PropTypes.number.isRequired,
        playlistAppWrapperRef: PropTypes.shape({
            current: PropTypes.any
        }).isRequired
    }

    static defaultProps = {
        thresold: 10,
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false)
    }

    onScroll = (e) => {
        const { thresold, playlistAppWrapperRef } = this.props
        const { latestPosition, latestTime } = this.state
        const element = this.elementRef.current
        const playlistAppWrapper = playlistAppWrapperRef.current
        const currentPosition = window.pageYOffset

        // save position
        this.setState({latestPosition: currentPosition})

        // if the playlist app wrapper is unreachable, do nothing
        if (!playlistAppWrapper) return

        // direction of scroll
        const deltaPosition = currentPosition - latestPosition

        // height of the playlist app wrapper, which offsets the location of the
        // component
        const playlistAppWrapperHeight = playlistAppWrapper.clientHeight
        const location = element.offsetTop - playlistAppWrapperHeight

        // if we descend to the top border of the component and are within the
        // upper thresold, do scroll
        if (currentPosition > location - thresold &&
            currentPosition < location &&
            deltaPosition > 0) {

            window.scroll({
                top: location,
                behavior: 'smooth',
            })

            return
        }

        // if we ascend to the top border of the component and are within the
        // lower thresold, do scroll
        if (currentPosition > location &&
            currentPosition < location + thresold &&
            deltaPosition < 0) {

            window.scroll({
                top: location,
                behavior: 'smooth',
            })

            return
        }
    }

    render() {
        return (
            <div id="content" ref={this.elementRef}>
                {this.props.children}
            </div>
        )
    }
}
