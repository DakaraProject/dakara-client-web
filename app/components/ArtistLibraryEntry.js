var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var ArtistLibraryEntry = React.createClass({
    handleSearch: function() {
      this.context.navigator.setQuerySong("artist:\"\"" + this.props.artist.name + "\"\"");
    },

    contextTypes: {
        navigator: React.PropTypes.object
    },

    render: function() {
        return (
                <li className="library-entry listing-entry listing-entry-artist">
                    <div className="entry-info">
                        <div className="artist-view">
                            <div className="artist-name">
                                {this.props.artist.name}
                            </div>
                            <div className="count">
                                {this.props.artist.song_count}
                            </div>
                        </div>
                    </div>
                    <div className="controls"> 
                        <div className="search control primary" onClick={this.handleSearch}>
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                </li>
        );
    }
});

module.exports = ArtistLibraryEntry;
