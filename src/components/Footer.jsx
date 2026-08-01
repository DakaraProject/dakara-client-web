export default function Footer() {
  const version = import.meta.env.DAKARA_VERSION
  const bugtracker = import.meta.env.DAKARA_BUGTRACKER
  const projectHomepage = import.meta.env.DAKARA_PROJECT_HOMEPAGE

  return (
    <footer id="footer" className="box">
      <div className="flow">
        <h2>
          Dakara client <span className="version">{version}</span>
        </h2>
        <p className="contact text">
          Visit the <a href={projectHomepage}>project page</a>
          <br />
          Report a <a href={bugtracker}>bug</a>
        </p>
      </div>
    </footer>
  )
}
