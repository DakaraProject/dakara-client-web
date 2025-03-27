import { Outlet } from 'react-router'

import Tab from 'components/generics/Tab'

export default function Lab() {
  return (
    <div id="lab" className="box">
      <nav className="tab-bar">
        <Tab to="/lab/colors" iconName="palette" name="Colors" />
        <Tab to="/lab/fields" iconName="pencil-ruler" name="Fields" />
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
