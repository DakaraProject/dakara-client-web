const dependencies = [
  {
    name: 'Classnames',
    url: 'https://github.com/JedWatson/classnames',
  },
  {
    name: 'Color convert (dev)',
    url: 'https://github.com/Qix-/color-convert',
  },
  { name: 'Day.js', url: 'https://day.js.org' },
  {
    name: 'Embla Carousel',
    url: 'https://www.embla-carousel.com/',
  },
  {
    name: 'Line Awesome',
    url: 'https://icons8.com/line-awesome',
  },
  {
    name: 'Prop-types',
    url: 'https://github.com/facebook/prop-types',
  },
  {
    name: 'Query-string',
    url: 'https://github.com/sindresorhus/query-string',
  },
  { name: 'React', url: 'https://react.dev' },
  {
    name: 'React Highlight Words',
    url: 'https://github.com/bvaughn/react-highlight-words',
  },
  { name: 'React-Redux', url: 'https://react-redux.js.org' },
  { name: 'React-router', url: 'https://reactrouter.com' },
  {
    name: 'React-transitioning',
    url: 'https://fakundo.github.io/react-transitioning',
  },
  { name: 'Redux', url: 'https://redux.js.org' },
  {
    name: 'Redux-localstorage',
    url: 'https://github.com/elgerlambert/redux-localstorage',
  },
  {
    name: 'Redux-thunk',
    url: 'https://github.com/reduxjs/redux-thunk',
  },
  {
    name: 'Roboto',
    url: 'https://fonts.google.com/specimen/Roboto',
  },
  { name: 'Semver', url: 'https://github.com/npm/node-semver' },
  {
    name: 'WCAG Contrast utils (dev)',
    url: 'https://github.com/pavlogolovatyy/wcag-contrast-utils',
  },
]

export default function About() {
  return (
    <div id="about" className="flow">
      <h3>About the project</h3>
      <p>
        <a href="https://github.com/DakaraProject">Dakara</a> is an open-source,
        self-hosted Karaoke project.
      </p>
      <h3>About the dependencies</h3>
      <ul>
        {dependencies.map((item) => (
          <li key={item.name}>
            <a href={item.url}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
