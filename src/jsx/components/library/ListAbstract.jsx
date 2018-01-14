import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { parse } from 'query-string'
import Library from './Library'
import NotFound from 'components/navigation/NotFound'

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
            this.props.workTypes.hasFetched != prevProps.workTypes.hasFetched ||
            query.page != prevQuery.page ||
            query.search != prevQuery.search) {
            this.refreshEntries()
        }
    }

    checkWorkTypesHasFetched = () => {
        return this.props.workTypes.hasFetched
    }

    /**
     * Check work type exists in worktypes
     */
    checkWorkTypeExists = () => {
        const { workType, workTypes } = this.props

        // always true for libraries with no worktype
        if (!workType) {
            return true
        }

        const workTypeMatched = workTypes.data.results.find(
            (workTypeObject) => workTypeObject.query_name == workType
        )

        return !!workTypeMatched
    }

    /**
     * Get a dict with the following:
     * - singular: library singular name
     * - plural: library plural name
     * - placeholder: library search placeholder
     * - serverName: server side library name
     */
    getLibraryNameInfo() {
    }

    refreshEntries = () => {
        const workType = this.props.workType
        const queryObj = parse(this.props.location.search)
        const { page: pageNumber, search: query } = queryObj

        if (!this.checkWorkTypesHasFetched() || !this.checkWorkTypeExists()) {
            return
        }

        let args = {workType}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(this.getLibraryNameInfo().serverName, args)
    }


    /**
     * To be override by the child class
     * to return the list of library entries
     */
    getLibraryEntryList() {
    }

    render() {
        const { workTypes, location } = this.props

        if (!this.checkWorkTypesHasFetched()) {
            return null
        }

        if (!this.checkWorkTypeExists()) {
            return (
                <NotFound location={location}/>
            )
        }

        const libraryEntryList = this.getLibraryEntryList()
        return (
            <Library
                location={this.props.location}
                match={this.props.match}
                nameInfo={this.getLibraryNameInfo()}
                entries={this.props.entries}
                workTypes={workTypes}
            >
                <ul className="library-list listing">
                    {libraryEntryList}
                </ul>
            </Library>
        )
    }
}

export default ListAbstract
