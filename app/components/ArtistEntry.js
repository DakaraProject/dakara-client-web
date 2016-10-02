var React = require('react');

var ArtistEntry = React.createClass({
    handleSearchArtist: function() {
        this.props.setQuery('artist:""' + this.props.artist.name + '""');
    },

    render: function() {

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
});

module.exports = ArtistEntry;
