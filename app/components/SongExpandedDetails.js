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

        return (
                <div className="song-expanded-details">
                    {artists ? (
                        <div className="artists">
                            {artists}
                        </div>
                    ) : null}
                    {worksRenderList ? (
                        <div className="works">
                            {worksRenderList}
                        </div>
                    ) : null}
                    {song.tags.length > 0 ? (
                        <div className="tags">
                            <SongTagList tags={song.tags} setQuery={this.context.navigator.setQuerySong}/>
                        </div>
                    ) : null}
                </div>
            )
    }
});

module.exports = SongExpandedDetails;
