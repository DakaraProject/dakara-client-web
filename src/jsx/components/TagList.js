import React, { Component } from 'react'
import Paginator from './Paginator'
import TagListEntry from './TagListEntry'

class TagList extends Component {
    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.query.page != prevProps.location.query.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const pageNumber = this.props.location.query.page
        this.props.getTagList(pageNumber)
    }

    render() {
        const { entries, notifications, location } = this.props
        const { current, last } = entries.data

        const tagList = entries.data.results.map((tag) => {
            let notification = notifications[tag.name]

            return (
                <TagListEntry
                    key={tag.name}
                    tag={tag}
                    notification={notification}
                />
            )
        })

        return (
            <div className="box" id="tag-list">
                <div className="header">
                    <h1>Song tags management</h1>
                </div>
                <div className="listing-table-container">
                    <table className="listing notifiable">
                        <thead>
                            <tr className="listing-header">
                                <th className="name">Name</th>
                                <th className="color">Color</th>
                                <th className="enabled">Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagList}
                        </tbody>
                    </table>
                </div>
                <div className="navigator">
                    <Paginator
                        location={location}
                        current={current}
                        last={last}
                    />
                </div>
            </div>
        )
    }
}

export default TagList
