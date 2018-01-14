import React, { Component } from 'react'
import { parse, stringify } from 'query-string'
import PropTypes from 'prop-types'

class SearchBox extends Component {
    state = {
        query: ""
    }

    componentDidMount() {
        this.updateQueryFromLocation()
    }

    componentDidUpdate(prevProps) {
        const newSearch = parse(this.props.location.search).search
        if (newSearch != parse(prevProps.location.search).search && newSearch ) {
            this.updateQueryFromLocation()
        }
    }

    updateQueryFromLocation = () => {
        const query = parse(this.props.location.search).search || ''
        this.setState({query})
    }

    render() {
        return (
            <form
                className="form inline library-searchbox"
                onSubmit={e => {
                    e.preventDefault()
                    this.context.router.history.push({
                        search: stringify({search: this.state.query})
                    })
                }}
            >
                <div className="set">
                    <div className="field">
                        <div className="text-input input fake" id="library-searchbox-fake">
                            <input
                                className="faked"
                                placeholder={this.props.placeholder}
                                value={this.state.query}
                                onChange={e => this.setState({query: e.target.value})}
                                onFocus={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.add(
                                        'focus'
                                    )
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.remove(
                                        'focus'
                                    )
                                }}
                            />
                            <div className="controls">
                                <div className="control" onClick={e => {
                                        this.setState({query: ""})
                                        // clear query string
                                        this.context.router.history.push({})
                                    }
                                }>
                                    <span className="icon">
                                        <i className="fa fa-times"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <button type="submit" className="control primary">
                        <span className="icon">
                            <i className="fa fa-search"></i>
                        </span>
                    </button>
                </div>
            </form>
        )
    }
}

SearchBox.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

export default SearchBox
