import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryWork from './LibraryEntryWork'

class LibraryListWork extends LibraryListAbstract {
    getLibraryName() {
        return "works"
    }

    getLibraryEntryList = () => {
        const works = this.props.entries.data.results
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

        return libraryEntryWorkList
    }
}

export default LibraryListWork
