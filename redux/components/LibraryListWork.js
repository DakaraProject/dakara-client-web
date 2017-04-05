import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryWork from './LibraryEntryWork'

class LibraryListWork extends LibraryListAbstract {
    getLibraryName() {
        return "works"
    }

    render() {
        const works = this.props.works
        return (
              <ul id="library-entries" className="listing">
                {works.map(work =>
                  <LibraryEntryWork
                    key={work.id}
                    work={work}
                    workType={this.props.workType}
                  />
                )}
              </ul>
              )
    }
}

export default LibraryListWork
