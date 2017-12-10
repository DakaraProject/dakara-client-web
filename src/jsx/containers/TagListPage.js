import { connect } from 'react-redux'
import TagList from '../components/TagList'
import { getTagList } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.library.songTags.entries,
    notifications: state.library.songTags.notifications
})

const TagListPage = connect(
    mapStateToProps,
    { getTagList }
)(TagList)

export default TagListPage
