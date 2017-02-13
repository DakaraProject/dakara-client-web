import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../dakara-utils';

export default class WorkLibraryEntry extends React.Component {
    handleSearch = () => {
      this.context.navigator.setQuerySong(this.props.queryName + ":\"\"" + this.props.work.title + "\"\"");
    }

    static contextTypes = {
        navigator: React.PropTypes.object
    }

    render() {
        return (
                <li className="library-entry listing-entry listing-entry-work hoverizable">
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
}
