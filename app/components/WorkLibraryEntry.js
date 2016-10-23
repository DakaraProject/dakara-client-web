var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

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
                            <div className="work-name">
                                {this.props.work.title}
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
