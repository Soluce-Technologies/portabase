import './App.css'
import {Route, Routes} from "react-router-dom"
import Page2 from "@/ui/pages/Page2/Page2.tsx";
import Home from "@/ui/pages/Home/MainHome/Home.tsx"

function App() {
  return (
          <Routes>
              <Route path="/" >
                  <Route index element={<Home/>}/>
                  <Route path="dashboard" element={<Page2/>}/>
              </Route>
          </Routes>
  )
}

export default App
