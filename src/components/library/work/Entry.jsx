import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { withNavigate } from 'components/generics/Router'
import { workPropType } from 'serverPropTypes/library'

class WorkEntry extends Component {
    static propTypes = {
        navigate: PropTypes.func.isRequired,
        query: PropTypes.object,
        work: workPropType.isRequired,
        workType: PropTypes.string.isRequired,
    }

    /**
     * Search songs associated with the work
     */
    handleSearch = () => {
        const query = `${this.props.workType}:""${this.props.work.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({query})
        })
    }

    render() {
        const { title, subtitle, song_count } = this.props.work
        return (
            <li
                className="library-entry listing-entry library-entry-work hoverizable"
            >
                <div className="library-entry-work-artist-display">
                    <div className="header">
                        <HighlighterQuery
                            query={this.props.query}
                            className="title"
                            searchWords={(q) => (q.remaining)}
                            textToHighlight={title}
                        />
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

export default withNavigate(WorkEntry)
