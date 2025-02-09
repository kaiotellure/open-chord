import { render } from 'preact'
import './index.css'

function App() {
   return <div className="p-8">
      <h1 className="">Hello Preact Extension.</h1>
   </div>
}

render(<App />, document.getElementById('root')!)
