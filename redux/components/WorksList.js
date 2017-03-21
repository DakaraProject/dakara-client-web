import React, { Component } from 'react'
import Work from './Work'

class WorksList extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        // since there is only one `WorksList` component, it is not unmounted
        // when navigating through work types, so we have to watch when the
        // component is updated wether we have jumped to another work type
        if (this.props.workType != prevProps.workType ||
            this.props.location.query.page != prevProps.location.query.page ||
            this.props.location.query.search != prevProps.location.query.search) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        // we have to get the singular form of the new work type
        // the plural form is given by the URL as a parameter
        const workType = this.props.workType.slice(0, -1);

        const pageNumber = this.props.location.query.page
        const query = this.props.location.query.search
        let args = {workType}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadWorks("works", args)
    }

    render() {
        const works = this.props.works
        return (
              <ul>
                {works.map(work =>
                  <Work
                    key={work.id}
                    work={work}
                  />
                )}
              </ul>
              )
    }
}

export default WorksList
