import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import Work from './Work'

class LibraryListWork extends LibraryListAbstract {
    getLibraryName() {
        return "works"
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

export default LibraryListWork
