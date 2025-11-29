import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Lab() {
  return (
    <div id="lab" className="box neutral">
      <TabBar>
        <Tab to="/lab/colors" iconName="palette" name="Colors" defaultRoute />
        <Tab to="/lab/fields" iconName="pencil-ruler" name="Fields" />
      </TabBar>
      <Outlet />
    </div>
  )
}
