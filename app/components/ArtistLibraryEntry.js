import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../dakara-utils';

export default class ArtistLibraryEntry extends React.Component {
    handleSearch = () => {
      this.context.navigator.setQuerySong("artist:\"\"" + this.props.artist.name + "\"\"");
    }

    static contextTypes = {
        navigator: React.PropTypes.object
    }

    render() {
        return (
                <li className="library-entry listing-entry listing-entry-artist hoverizable">
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
}
