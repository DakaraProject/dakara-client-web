import PropTypes from 'prop-types'

export default function Marked({ marked }) {
    if (!marked) {
        return null
    }

    return (
        <span className="icon">
            <i className="las la-check"></i>
        </span>
    )
}
Marked.propTypes = {
    marked: PropTypes.bool
}
