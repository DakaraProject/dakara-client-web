import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Lab() {
  return (
    <div id="lab" className="box">
      <TabBar>
        <Tab to="/lab/colors" iconName="palette" name="Colors" />
        <Tab to="/lab/fields" iconName="pencil-ruler" name="Fields" />
      </TabBar>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
