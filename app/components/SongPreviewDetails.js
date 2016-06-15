var React = require('react');
var Highlighter = require('react-highlight-words').default;

var SongPreviewDetails = React.createClass({
    render: function() {
        var song = this.props.song;
        var work;
        if (song.works.length > 0) {
            var w = song.works[0];
            var title;
            if (this.props.query != undefined) {
                title = (<span className="work-title">
                        <Highlighter
                            searchWords={this.props.query.works.concat(
                                    this.props.query.remaining
                                    )}
                            textToHighlight={w.work.title}
                        />
                    </span>);
            } else {
                title = w.work.title;
            }

            var subtitle;
            if (w.work.subtitle) {
                 subtitle = (<span className="work-subtitle">{w.work.subtitle}</span>);
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
                        {title}{subtitle}<span className="work-link">{link}{linkNb}</span><i className={work_icon}></i>
                    </div>
                );
        }

        var artists;
        if(song.artists.length > 0) {
            var displayArtist;
            if (this.props.query != undefined) {
                displayArtist = function(artist, query) {
                    return (
                        <Highlighter
                            searchWords={query.artists.concat(
                                    query.remaining
                                    )}
                            textToHighlight={artist.name}
                        />
                    );
                };
            } else {
                displayArtist = function(artist, query) {
                    return artist.name;
                };
            }

            var artistsList = song.artists.map(function(artist) {
                var artist;
                return (<span className="artist">
                        {displayArtist(artist, this.props.query)}
                    </span>);
            }.bind(this));
            artists = (<div className="artists">{artistsList}</div>);
        }

        return (
                <div className="song-preview-details">
                    {work}
                    {artists}
                </div>
            )
    }
});

module.exports = SongPreviewDetails;
