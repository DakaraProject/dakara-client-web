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
                        <button className="search control primary" onClick={this.handleSearch}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </li>
        );
    }
}
