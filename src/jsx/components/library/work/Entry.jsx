import React, { Component } from 'react'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'

class WorkEntry extends Component {
    static propTypes = {
        workType: PropTypes.string.isRequired,
        work: PropTypes.shape({
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string,
            song_count: PropTypes.number.isRequired,
        }).isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    handleSearch = () => {
        const query = `${this.props.workType}:""${this.props.work.title}""`
        this.context.router.history.push({
            pathname: "/library/song",
            search: stringify({query})
        })
    }

    render() {
        const { title, subtitle, song_count } = this.props.work
        return (
                <li className="library-entry listing-entry library-entry-work hoverizable">
                    <div className="library-entry-work-display">
                        <div className="header">
                            <span className="title">
                                {title}
                            </span>
                            <span className="subtitle">
                                {subtitle}
                            </span>
                        </div>
                        <div className="songs-amount">
                            {song_count}
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
        )
    }
}

export default WorkEntry
