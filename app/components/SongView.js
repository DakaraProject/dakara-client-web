var React = require('react');
var SongTagList = require('./SongTagList');
var WorkDisplay = require('./WorkDisplay');

var SongView = React.createClass({
    handleClose: function() {
        this.props.handleClose()
    },

    render: function() {
        var song = this.props.song;

        var title = song.title;

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
        });

        var works = (<ul className="works-list">{workList}</ul>);

        var artists;

        return (
                <div className="song-view">
                    <div className="title">
                        {title}
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
