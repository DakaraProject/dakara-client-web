import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'

/**
 * Add the location prop to a component
 */
// eslint-disable-next-line react/display-name
export const withLocation = (Component) => (props) => (
  <Component location={useLocation()} {...props} />
)

/**
 * Add the params prop to a component
 */
// eslint-disable-next-line react/display-name
export const withParams = (Component) => (props) => (
  <Component params={useParams()} {...props} />
)

/**
 * Add the navigate prop to a component
 */
// eslint-disable-next-line react/display-name
export const withNavigate = (Component) => (props) => (
  <Component navigate={useNavigate()} {...props} />
)

/**
 * Add the searchParams and setSearchParams props to a component
 */
// eslint-disable-next-line react/display-name
export const withSearchParams = (Component) => (props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Component
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      {...props}
    />
  )
}
