var React = require('react');
var SongTagList = require('./SongTagList');
var WorkEntry = require('./WorkEntry');
var ArtistEntry = require('./ArtistEntry');

var SongExpandedDetails = React.createClass({
    handleClose: function() {
        this.props.handleClose()
    },

    render: function() {
        var song = this.props.song;

        var title = (<div className="title">{song.title}</div>);
        var detail;
        if(song.detail) {
            detail = (<div className="detail">{song.detail}</div>);
        }

        var workList = song.works.map(function(work) {
            return (
                    <WorkEntry work={work} setSearch={this.props.setSearch}/> 
                    );
        }.bind(this));

        var works = (<ul className="works-list">{workList}</ul>);

        var artistList = song.artists.map(function(artist) {
            return (
                    <ArtistEntry artist={artist} setSearch={this.props.setSearch}/>
                    );
        }.bind(this));

        var artists = (<ul className="artists-list">{artistList}</ul>);

        return (
                <div className="song-expanded-details">
                    <div className="works">
                        {works}
                    </div>
                    <div className="artists">
                        {artists}
                    </div>
                    <div className="tags">
                        <SongTagList tags={song.tags} setSearch={this.props.setSearch}/>
                    </div>
                </div>
            )
    }
});

module.exports = SongExpandedDetails;
