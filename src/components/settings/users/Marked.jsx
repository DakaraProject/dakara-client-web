import PropTypes from 'prop-types'

export default function Marked({ marked }) {
    if (!marked) {
        return null
    }

    return (
        <i className="las la-check"></i>
    )
}
Marked.propTypes = {
    marked: PropTypes.bool
}
