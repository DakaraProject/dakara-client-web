import React, { Component } from 'react'
import Work from './Work'

class WorksList extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if(this.props.workType != prevProps.workType) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const workTypeSingular = this.props.workType.slice(0, -1);
        this.props.loadWorks("works", workTypeSingular)
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
