var React = require('react');
var SongTagList = require('./SongTagList');
var WorkDisplay = require('./WorkDisplay');

var SongView = React.createClass({
    handleClose: function() {
        this.props.handleClose()
    },

    handleSearchWork: function(work) {
        this.props.setSearch('work:""' + work.title + '""');
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
                    <li>
                        <WorkDisplay work={work}/>
                        <div className="controls">
                            <div className="control primary">
                                <i className="fa fa-search"></i>
                            </div>
                        </div>
                    </li>
                    );
        }.bind(this));

        var works = (<ul className="works-list">{workList}</ul>);

        var artistList = song.artists.map(function(artist) {
            return (
                    <li>
                        <div className="artist-name">
                            {artist.name}
                        </div>
                        <div className="controls">
                            <div className="control primary">
                                <i className="fa fa-search"></i>
                            </div>
                        </div>
                    </li>
                    );
        }.bind(this));

        var artists = (<ul className="artists-list">{artistList}</ul>);

        return (
                <div className="song-view">
                    <div className="title-header">
                        {title}
                        {detail}
                    </div>
                    <div className="works">
                        {works}
                    </div>
                    <div className="artists">
                        {artists}
                    </div>
                    <div className="tags">
                        <SongTagList tags={song.tags} />
                    </div>
                    <div className="collapse" onClick={this.handleClose}>
                        <i className="fa fa-caret-up"></i>
                    </div>
                </div>
            )
    }
});

module.exports = SongView;
