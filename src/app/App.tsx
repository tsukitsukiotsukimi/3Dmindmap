import { TopBar } from '../components/layout/TopBar'
import { LeftPanel } from '../components/layout/LeftPanel'
import { RightPanel } from '../components/layout/RightPanel'
import { StatusBar } from '../components/layout/StatusBar'
import { MindMapScene } from '../scene/MindMapScene'
import './styles.css'

export function App() {
  return (
    <div className="app">
      <TopBar />
      <div className="main-content">
        <LeftPanel />
        <div className="canvas-container">
          <MindMapScene />
        </div>
        <RightPanel />
      </div>
      <StatusBar />
    </div>
  )
}
