import { connect } from 'react-redux'
import TagList from '../components/TagList'
import { getTagList, editSongTag } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.library.songTags.entries,
    notifications: state.library.songTags.notifications,
    forms: state.forms
})

const TagListPage = connect(
    mapStateToProps,
    {
        getTagList,
        editSongTag,
    }
)(TagList)

export default TagListPage
