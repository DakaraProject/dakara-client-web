var React = require('react');
var utils = require('../dakara-utils');

var SongPreview = React.createClass({
    render: function() {
        var song = this.props.song;
        var work;
        if (song.works.length > 0) {
            var w = song.works[0];
            var title = (<span className="title">{w.work.title}</span>);
            var subtitle;
            if (w.work.subtitle) {
                 subtitle = (<span className="subtitle">{w.work.subtitle}</span>);
            }
            var link = (<span className="link-type">{w.link_type}</span>);
            var linkNb;
            if (w.link_type_number) {
                linkNb = (<span className="link-nb">{w.link_type_number}</span>);
            }
            var work_icon;
            if (w.work.work_type && w.work.work_type.icon_name) {
                work_icon = "fa fa-" + w.work.work_type.icon_name;
            } else {
                work_icon = "fa fa-picture-o";
            }
            work = (
                    <div className="work">
                        <i className={work_icon}></i><span className="link">{link}{linkNb}</span>{title}{subtitle}
                    </div>
                );
        }

        var artists;
        if(song.artists.length > 0) {
            artistsList = song.artists.map(function(artist) {
                return (<span className="artist">{artist.name}</span>);
            });
            artists = (<div className="artists">{artistsList}</div>);
        }

        return (
                <div className="data">
                    <div className="song-details">
                        <div className="top">
                            <div className="title">
                                {song.title}
                            </div>
                        </div>
                        <div className="bottom">
                            {artists}
                            {work}
                        </div>
                    </div>
                    <div className="song-duration">
                        {utils.formatTime(this.props.song.duration)}
                    </div>
                </div>
            )
    }
});

module.exports = SongPreview;
