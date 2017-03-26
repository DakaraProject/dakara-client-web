import React, { Component } from 'react'

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
        const pageNumber = this.props.location.query.page
        const query = this.props.location.query.search
        let args = {workType}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(this.getLibraryName(), args)
    }
}

export default LibraryListAbstract
