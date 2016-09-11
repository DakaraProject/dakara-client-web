var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var SongLibraryEntry = React.createClass({
    handleSearch: function() {
      this.props.setSongQuery("artist:\"" + this.props.artist.name + "\"");  
    },
    render: function() {
        return (
                <li>
                    <div className="artist-name">
                        {this.props.artist.name}
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

module.exports = SongLibraryEntry;
