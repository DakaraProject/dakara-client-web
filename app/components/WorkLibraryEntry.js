import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../dakara-utils';

var WorkLibraryEntry = React.createClass({
    handleSearch: function() {
      this.context.navigator.setQuerySong(this.props.queryName + ":\"\"" + this.props.work.title + "\"\"");
    },

    contextTypes: {
        navigator: React.PropTypes.object
    },

    render: function() {
        return (
                <li className="library-entry listing-entry">
                    <div className="entry-info">
                        <div className="work-view">
                            <div className="work-header">
                                <div className="work-title">
                                    {this.props.work.title}
                                </div>
                                <div className="work-subtitle">
                                    {this.props.work.subtitle}
                                </div>
                            </div>
                            <div className="count">
                                {this.props.work.song_count}
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

module.exports = WorkLibraryEntry;
