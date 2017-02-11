import React from 'react';
import SongTagList from './SongTagList';
import WorkEntry from './WorkEntry';
import ArtistEntry from './ArtistEntry';

export default class SongExpandedDetails extends React.Component {
    handleClose = () => {
        this.props.handleClose()
    }

    static contextTypes = {
        navigator: React.PropTypes.object
    }

    render() {
        var song = this.props.song;

        var title = (<div className="title">{song.title}</div>);
        var detail;
        if(song.detail) {
            detail = (<div className="detail">{song.detail}</div>);
        }

        var workList = song.works.map(function(work) {
            return (
                    <WorkEntry work={work} setQuery={this.context.navigator.setQuerySong}/>
                    );
        }.bind(this));

        var works = (<ul className="works-list">{workList}</ul>);

        var artistList = song.artists.map(function(artist) {
            return (
                    <ArtistEntry artist={artist} setQuery={this.context.navigator.setQuerySong}/>
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
                        <SongTagList tags={song.tags} setQuery={this.context.navigator.setQuerySong}/>
                    </div>
                </div>
            )
    }
}
