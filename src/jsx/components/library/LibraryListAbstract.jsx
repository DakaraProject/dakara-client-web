import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { browserHistory } from 'react-router';

class LibraryListAbstract extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        // since there is only one `LibraryListWork` component, it is not unmounted
        // when navigating through work types, so we have to watch when the
        // component is updated wether we have jumped to another work type
        if (this.props.workType != prevProps.workType ||
            this.props.location.query.page != prevProps.location.query.page ||
            this.props.location.query.search != prevProps.location.query.search) {
            this.refreshEntries()
        }
    }

    /**
     * To be override by the child class
     * to return library name
     */
    getLibraryName() {
    }

    refreshEntries = () => {
        const workType = this.props.workType
        const workTypes = this.props.workTypes
        const pageNumber = this.props.location.query.page
        const query = this.props.location.query.search

        if (workType) {
            const workTypeMatched = workTypes.data.results.find(
                (workTypeObject) => workTypeObject.query_name == workType
            )

            if (!workTypeMatched) {
                browserHistory.push({
                    pathname: "/404",
                    query: {from: this.props.location.pathname}
                })
                return
            }

        }


        let args = {workType}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(this.getLibraryName(), args)
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
              <ul className="library-list listing">
                  {libraryEntryList}
              </ul>
        )
    }
}

export default LibraryListAbstract
