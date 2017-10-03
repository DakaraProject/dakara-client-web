import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryWork from './LibraryEntryWork'

class LibraryListWork extends LibraryListAbstract {
    static getName() {
        return "LibraryListWork"
    }

    getLibraryName() {
        return "works"
    }

    getLibraryEntryList = () => {
        if (!this.props.entries) {
            return null
        }

        const works = this.props.entries.data.results
        const libraryEntryWorkList = works.map(work =>
              <LibraryEntryWork
                key={work.id}
                work={work}
                workType={this.props.workType}
              />
        )

        return libraryEntryWorkList
    }
}

export default LibraryListWork
