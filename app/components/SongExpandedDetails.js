var React = require('react');
var SongTagList = require('./SongTagList');
var WorkEntry = require('./WorkEntry');
var ArtistEntry = require('./ArtistEntry');

var SongExpandedDetails = React.createClass({
    handleClose: function() {
        this.props.handleClose()
    },

    contextTypes: {
        navigator: React.PropTypes.object
    },

    render: function() {
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
                        <WorkEntry work={work} setQuery={this.context.navigator.setQuerySong}/>
                        );
            }.bind(this));

            return (
                    <div className="group">
                        <h4 className="header">
                            <span className="icon">
                                <i className={"fa fa-" + workType.icon_name}></i>
                            </span>
                            <span className="name">{workType.name + 's'}</span>
                        </h4>
                        <ul className="list">{worksForTypeList}</ul>
                    </div>
                )
        }.bind(this))

        var artistList = song.artists.map(function(artist) {
            return (
                    <ArtistEntry artist={artist} setQuery={this.context.navigator.setQuerySong}/>
                    );
        }.bind(this));

        var artists;
        if (song.artists.length > 0) {
            artists = (
                    <div className="group">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-music"></i>
                            </span>
                            <span className="name">Artists</span>
                        </h4>
                        <ul className="list">{artistList}</ul>
                    </div>
                );
        }

        var detailSong;
        if (song.detail) {
            detailSong = (
                    <div className="group">
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
                    <div className="group">
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
                    <div className="group">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-tags"></i>
                            </span>
                            <span className="name">Tags</span>
                        </h4>
                        <SongTagList tags={song.tags} setQuery={this.context.navigator.setQuerySong}/>
                    </div>
                );
        }

        return (
                <div className="song-expanded-details">
                    {artists ? (
                        <div className="artists expanded-item">
                            {artists}
                        </div>
                    ) : null}
                    {worksRenderList ? (
                        <div className="works expanded-item">
                            {worksRenderList}
                        </div>
                    ) : null}
                    {detailSong ? (
                        <div className="detail-song expanded-detail">
                            {detailSong}
                        </div>
                    ) : null}
                    {detailVideo ? (
                        <div className="detail-video expanded-detail">
                            {detailVideo}
                        </div>
                    ) : null}
                    {tags ? (
                        <div className="tags expanded-detail">
                            {tags}
                        </div>
                    ) : null}
                </div>
            )
    }
});

module.exports = SongExpandedDetails;
