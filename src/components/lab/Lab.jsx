import { Outlet } from 'react-router'

import { Tab, Tabs } from 'components/generics/Tab'

export default function Lab() {
  return (
    <div id="lab" className="box">
      <Tabs>
        <Tab to="/lab/colors" iconName="palette" name="Colors" />
        <Tab to="/lab/fields" iconName="pencil-ruler" name="Fields" />
      </Tabs>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
