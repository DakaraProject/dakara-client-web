import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import utils from '../utils'
import LibraryEntrySongDisplay from './LibraryEntrySongDisplay'
// import SongExpandedDetails from './SongExpandedDetails'

export default class LibraryEntrySong extends Component {
    render() {
        let notification
        if (this.props.notification){
            notification = (
                <div className="notified">
                    <div className={"notification " + this.props.notification.type}>
                        {this.props.notification.message}
                    </div>
                </div>
            )
        }

        // var timeOfPlay
        // if (this.props.isPlaying) {
        //     timeOfPlay = (
        //         <div className="playlist-info-content" key="playing">
        //             <div className="playing">
        //                 <i className="fa fa-play"></i>
        //             </div>
        //         </div>
        //     )
        // } else if (this.props.timeOfPlay) {
        //     timeOfPlay = (
        //         <div className="playlist-info-content" key="queueing">
        //             <div className="play-time">
        //                 <i className="fa fa-clock-o"></i>
        //                 {utils.formatHourTime(this.props.timeOfPlay)}
        //             </div>
        //         </div>
        //     )
        // }

        // var songExpandedDetails
        // if (this.props.expanded){
        //     songExpandedDetails = (<SongExpandedDetails song={this.props.song} />)
        // }

        return (
                <li className="library-entry listing-entry listing-entry-song">
                    <div className="song-compact hoverizable">
                        <LibraryEntrySongDisplay
                            song={this.props.song}
                            query={this.props.query}
                        />
                            {/* handleExpand={this.handleExpand} */}
                            {/* expanded={this.props.expanded} */}

                        {/* <ReactCSSTransitionGroup */}
                        {/*     component="div" */}
                        {/*     className="playlist-info" */}
                        {/*     transitionName="playlist-info" */}
                        {/*     transitionEnterTimeout={300} */}
                        {/*     transitionLeaveTimeout={150} */}
                        {/* > */}
                        {/*     {timeOfPlay} */}
                        {/* </ReactCSSTransitionGroup> */}

                        <div className="controls" id={"song-" + this.props.song.id}>
                            <button
                                className="add control primary"
                                onClick={() => {
                                    this.props.addSongToPlaylist(this.props.song.id)
                                }}
                            >
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>

                        <ReactCSSTransitionGroup
                            transitionName="notified"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={150}
                        >
                            {notification}
                        </ReactCSSTransitionGroup>
                    </div>
                    {/* <ReactCSSTransitionGroup */}
                    {/*     component="div" */}
                    {/*     transitionName="expand-view" */}
                    {/*     transitionEnterTimeout={600} */}
                    {/*     transitionLeaveTimeout={300} */}
                    {/* > */}
                    {/*     {songExpandedDetails} */}
                    {/* </ReactCSSTransitionGroup> */}
                </li>
        )
    }
}
