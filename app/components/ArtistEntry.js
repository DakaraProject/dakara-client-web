import React from 'react';

export default class ArtistEntry extends React.Component {
    handleSearchArtist = () => {
        this.props.setQuery('artist:""' + this.props.artist.name + '""');
    }

    render() {

        var artist = this.props.artist;
        return (
                <li>
                    <div className="artist">
                        <div className="artist-name">
                            {artist.name}
                        </div>
                    </div>
                    <div className="controls">
                        <div className="control primary" onClick={this.handleSearchArtist}>
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                </li>
                );
    }
}
