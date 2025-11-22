import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { storeSearchBox } from 'actions/library'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

class SearchBox extends Component {
  static propTypes = {
    help: PropTypes.element,
    placeholder: PropTypes.string.isRequired,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
    searchBox: PropTypes.object.isRequired,
    storeSearchBox: PropTypes.func.isRequired,
  }

  state = {
    query: '',
    displayHelp: false,
  }

  componentDidMount() {
    this.updateQueryFromStore()
    this.updateQueryFromSearchParams()
  }

  componentDidUpdate(prevProps) {
    // update query if the stored query changed
    const { query } = this.props.searchBox
    const { query: prevQuery } = prevProps.searchBox
    if (query !== prevQuery) {
      this.updateQueryFromStore()
    }

    // update query if the URL query changed
    const { searchParams } = this.props
    const { searchParams: prevSearchParams } = prevProps
    const queryUrl = searchParams.get('query')
    const prevQueryUrl = prevSearchParams.get('query')
    if (queryUrl !== prevQueryUrl) {
      this.updateQueryFromSearchParams()
    }
  }

  componentWillUnmount() {
    this.props.storeSearchBox(this.state)
  }

  updateQueryFromSearchParams = () => {
    const { searchParams } = this.props
    const query = searchParams.get('query')
    if (query && query.length > 0) {
      this.setState({ query })
    }
  }

  updateQueryFromStore = () => {
    const query = this.props.searchBox.query
    if (query && query.length > 0) {
      this.setState({ query })
    }
  }

  toggleHelp = () => {
    this.setState({ displayHelp: !this.state.displayHelp })
  }

  render() {
    const { help } = this.props
    const { displayHelp } = this.state

    /**
     * Help message
     */
    let helpButton
    let helpBox
    if (help) {
      helpButton = (
        <button
          className="control square transparent"
          type="button"
          onClick={() => {
            this.toggleHelp()
          }}
        >
          <span className="icon">
            <i className="las la-question-circle"></i>
          </span>
        </button>
      )

      helpBox = (
        <CSSTransitionLazy
          in={displayHelp}
          classNames="help"
          timeout={{
            enter: 300,
            exit: 150,
          }}
        >
          <div className="help">{help}</div>
        </CSSTransitionLazy>
      )
    }

    return (
      <div className="searchbox primary flow">
        <form
          className="form inline"
          onSubmit={(e) => {
            e.preventDefault()
            this.props.setSearchParams({ query: this.state.query })
          }}
        >
          <div className="set">
            <div className="field">
              <div
                className="text-input input fake"
                id="library-searchbox-fake"
              >
                <input
                  className="faked"
                  placeholder={this.props.placeholder}
                  value={this.state.query}
                  onChange={(e) =>
                    this.setState({
                      query: e.target.value,
                    })
                  }
                  onFocus={() => {
                    document
                      .getElementById('library-searchbox-fake')
                      .classList.add('focus')
                  }}
                  onBlur={() => {
                    document
                      .getElementById('library-searchbox-fake')
                      .classList.remove('focus')
                  }}
                />
                <div className="controls compact">
                  {helpButton}
                  <button
                    className="control square transparent"
                    type="button"
                    onClick={() => {
                      this.setState({ query: '' })
                      // clear query string
                      this.props.setSearchParams({})
                    }}
                  >
                    <span className="icon">
                      <i className="las la-times"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="controls">
            <button type="submit" className="control square primary">
              <span className="icon">
                <i className="las la-search"></i>
              </span>
            </button>
          </div>
        </form>
        {helpBox}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  searchBox: state.library.searchBox,
})

SearchBox = withSearchParams(
  connect(mapStateToProps, { storeSearchBox })(SearchBox)
)

export default SearchBox
