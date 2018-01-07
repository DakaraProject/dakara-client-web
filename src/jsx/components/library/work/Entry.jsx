import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'

class WorkEntry extends Component {
    handleSearch = () => {
        const newSearch = `${this.props.workType}:""${this.props.work.title}""`
        this.context.router.history.push({
            pathname: "/library/song",
            search: stringify({search: newSearch})
        })
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
                        <button className="control primary" onClick={this.handleSearch}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                </li>
        );
    }
}

WorkEntry.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

export default WorkEntry
