import React, { Component } from 'react'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import { workPropType } from 'serverPropTypes/library'

class WorkEntry extends Component {
    static propTypes = {
        workType: PropTypes.string.isRequired,
        work: workPropType.isRequired,
        query: PropTypes.object,
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
	const { title, subtitle, alternative_titles, song_count } = this.props.work

	const alternativeTitlesList = alternative_titles.map((alt_title, index) => {

	    let separator = (index === alternative_titles.length - 1) ? "" : ", ";

	    return (
		<span className="alternative_title">
		    <HighlighterQuery
		        query={this.props.query}
		        key={alt_title.title}
		        searchWords={(q) => (q.remaining)}
		        textToHighlight={alt_title.title}
		    />
		    {separator}
	    	</span>
	    );
	})

        return(
                <li className="library-entry listing-entry library-entry-work hoverizable">
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
			    <div className="alternative_titles">
				{alternativeTitlesList}
			    </div>
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
