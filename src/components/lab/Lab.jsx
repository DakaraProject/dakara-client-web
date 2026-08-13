import { Outlet } from 'react-router'

import { Tab, TabBar } from 'components/generics/TabBar'

export default function Lab() {
  return (
    <div id="lab" className="box neutral">
      <title>Dakara lab</title>
      <TabBar>
        <Tab to="/lab/colors" iconName="palette" name="Colors" isDefault />
        <Tab to="/lab/fields" iconName="pencil-ruler" name="Fields" />
        <Tab to="/lab/shapes" iconName="shapes" name="Shapes" />
      </TabBar>
      <Outlet />
    </div>
  )
}
