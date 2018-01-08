import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { parse } from 'query-string'
import Library from './Library'

class ListAbstract extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const query = parse(this.props.location.search)
        const prevQuery = parse(prevProps.location.search)
        // since there is only one `LibraryListWork` component, it is not unmounted
        // when navigating through work types, so we have to watch when the
        // component is updated wether we have jumped to another work type
        if (this.props.workType != prevProps.workType ||
            query.page != prevQuery.page ||
            query.search != prevQuery.search) {
            this.refreshEntries()
        }
    }

    /**
     * To be override by the child class
     * to return library type
     */
    getLibraryType() {
    }

    refreshEntries = () => {
        const workType = this.props.workType
        const workTypes = this.props.workTypes
        const queryObj = parse(this.props.location.search)
        const { page: pageNumber, search: query } = queryObj

        if (workType) {
            const workTypeMatched = workTypes.data.results.find(
                (workTypeObject) => workTypeObject.query_name == workType
            )

            /*
            if (!workTypeMatched) {
                this.context.router.history.push({
                    pathname: "/404",
                    query: {from: this.props.location.pathname}
                })
                return
            }
            */

        }


        let args = {workType}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(this.getLibraryType(), args)
    }


    /**
     * To be override by the child class
     * to return the list of library entries
     */
    getLibraryEntryList() {
    }

    render() {
        const libraryEntryList = this.getLibraryEntryList()
        return (
            <Library
                location={this.props.location}
                match={this.props.match}
                nameInfo={this.getLibraryNameInfo()}
                entries={this.props.entries}
            >
                <ul className="library-list listing">
                    {libraryEntryList}
                </ul>
            </Library>
        )
    }
}

export default ListAbstract
