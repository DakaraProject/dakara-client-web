import React from 'react';
import { browserHistory } from 'react-router'
import SongTagList from './SongTagList';
import SongExpandedWorkEntry from './SongExpandedWorkEntry';
import SongExpandedArtistEntry from './SongExpandedArtistEntry';

export default class LibraryEntrySongExpanded extends React.Component {
    setQuery = (search) => {
        const { location } = this.props
        browserHistory.push({pathname: location.pathname, query: {search}})
    }

    render() {
        var song = this.props.song;

        var title = (<div className="title">{song.title}</div>);
        var detail;
        if(song.detail) {
            detail = (<div className="detail">{song.detail}</div>);
        }

        var worksByType = {};

        for(var workItem of song.works) {
            var workType = workItem.work.work_type.query_name;
            var list = worksByType[workType];
            if(!list) {
                list = [];
                worksByType[workType] = list;
            }
            list.push(workItem);
        }

        var worksRenderList = Object.keys(worksByType).map(function(key){
            var worksList = worksByType[key];
            var workType = worksList[0].work.work_type;

            var worksForTypeList = worksList.map(function(work) {
                return (
                        <SongExpandedWorkEntry
                            key={work.work.id}
                            work={work}
                            setQuery={this.setQuery}
                        />
                        );
            }.bind(this));

            return (
                    <div key={workType.query_name} className="works expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className={"fa fa-" + workType.icon_name}></i>
                            </span>
                            <span className="name">{workType.name + (worksForTypeList.length > 1 ? 's' : '')}</span>
                        </h4>
                        <ul className="sublisting">{worksForTypeList}</ul>
                    </div>
                )
        }.bind(this))

        var artistList = song.artists.map(function(artist) {
            return (
                    <SongExpandedArtistEntry
                        key={artist.id}
                        artist={artist}
                        setQuery={this.setQuery}
                    />
                    );
        }.bind(this));

        var artists;
        if (song.artists.length > 0) {
            artists = (
                    <div className="artists expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-music"></i>
                            </span>
                            <span className="name">Artist{song.artists.length > 1 ? 's' : ''}</span>
                        </h4>
                        <ul className="sublisting">{artistList}</ul>
                    </div>
                );
        }

        var detailSong;
        if (song.detail) {
            detailSong = (
                    <div className="detail-song expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-file-text"></i>
                            </span>
                            <span className="name">Music details</span>
                        </h4>
                        <div className="text">{song.detail}</div>
                    </div>
                );
        }

        var detailVideo;
        if (song.detail_video) {
            detailVideo = (
                    <div className="detail_video expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-file-text"></i>
                            </span>
                            <span className="name">Video details</span>
                        </h4>
                        <div className="text">{song.detail_video}</div>
                    </div>
                );
        }

        var tags;
        if (song.tags.length > 0) {
            tags = (
                    <div className="tags expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-tags"></i>
                            </span>
                            <span className="name">Tags</span>
                        </h4>
                        <SongTagList tags={song.tags} setQuery={this.setQuery}/>
                    </div>
                );
        }

        return (
                <div className="song-expanded-details-container">
                    <div className="song-expanded-details">
                        {artists}
                        {worksRenderList}
                        {detailSong}
                        {detailVideo}
                        {tags}
                    </div>
                </div>
            )
    }
}
