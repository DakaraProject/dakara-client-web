import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryWork from './LibraryEntryWork'

class LibraryListWork extends LibraryListAbstract {
    getLibraryName() {
        return "works"
    }

    render() {
        const works = this.props.entries.results
        let libraryEntryWorkList
        if (this.props.entries.type === "works") {
            libraryEntryWorkList = works.map(work =>
                  <LibraryEntryWork
                    key={work.id}
                    work={work}
                    workType={this.props.workType}
                  />
            )
        }
        return (
              <ul id="library-entries" className="listing">
                {libraryEntryWorkList}
              </ul>
              )
    }
}

export default LibraryListWork
