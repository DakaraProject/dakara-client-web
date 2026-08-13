import PropTypes from 'prop-types'
import queryString from 'query-string'
import { useNavigate } from 'react-router'

import { ListingEntry } from 'components/generics/listing/Entry'
import WorkWidget from 'components/library/widgets/Work'
import { workPropType } from 'serverPropTypes/library'

export default function WorkEntry({ work, workType, query, ...rest }) {
  const navigate = useNavigate()

  const controls = (
    <button
      className="control square primary"
      onClick={() => {
        navigate({
          pathname: '/library/song',
          search: queryString.stringify({
            query: `${workType}:""${work.title}""`,
          }),
        })
      }}
    >
      <span className="icon">
        <i className="las la-search"></i>
      </span>
    </button>
  )

  return (
    <ListingEntry id={work.id} controls={controls} {...rest}>
      <WorkWidget work={work} query={query} noIcon truncatable />
    </ListingEntry>
  )
}

WorkEntry.propTypes = {
  work: workPropType.isRequired,
  workType: PropTypes.string.isRequired,
  query: PropTypes.object,
}
