import { Outlet } from 'react-router'

import Tab from 'components/generics/Tab'

export default function Lab() {
  return (
    <div id="lab" className="box">
      <nav className="tab-bar">
        <Tab to="/lab/colors" iconName="palette" name="Colors" />
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
