import { SideBar } from './components/Sidebar'
import { FormBar } from './components/Formbar'
import './App.css'

function App() {
  return (
    <>
      <div className='row'>
        <div className='column-left'>
          <SideBar />
        </div>
        <div className='column-right'>
          <FormBar />
        </div>
      </div>
    </>
  )
}

export default App
