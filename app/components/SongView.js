var React = require('react');
var SongTagList = require('./SongTagList');

var SongView = React.createClass({
    render: function() {
        var song = this.props.song;

        var title = song.title;

        var workList = song.works.map(function(work) {
            return (
                    <li>
                        <div className="work-title-subtitle">
                            <span className="work-title">
                                {work.work.title}
                            </span>
                            <span className="work-subtitle">
                                {work.work.subtitle}
                            </span>
                            <span className="work-link">
                                <span className="link-type">{work.link_type}</span>
                                <span className="link-nb">{work.link_type_number}</span>
                            </span>
                        </div>
                        <div className="work-type">
                            <i className={"fa fa-" + work.work.work_type.icon_name}></i> 
                        </div>
                        <div className="controls">
                            <div className="search control">
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
                </div>
            )
    }
});

module.exports = SongView;
