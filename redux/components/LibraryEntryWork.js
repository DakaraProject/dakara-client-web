import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router'

export default class LibraryEntryWork extends Component {
    handleSearch = () => {
        const newSearch = this.props.workType + ":\"\"" + this.props.work.title + "\"\""
        browserHistory.push({pathname: "/library/song", query: { search: newSearch}})
    }

    render() {
        return (
                <li className="library-entry listing-entry library-entry-work hoverizable">
                    <div className="library-entry-work-display">
                        <div className="header">
                            <span className="title">
                                {this.props.work.title}
                            </span>
                            <span className="subtitle">
                                {this.props.work.subtitle}
                            </span>
                        </div>
                        <div className="songs-amount">
                            {this.props.work.song_count}
                        </div>
                    </div>
                    <div className="controls"> 
                        <button className="search control primary" onClick={this.handleSearch}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                </li>
        );
    }
}
