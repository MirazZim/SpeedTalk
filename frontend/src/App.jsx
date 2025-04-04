import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import HomePage from "./pages/HomePage/HomePage"


const App = () => {
  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>

      <Footer/>

    </div>
  )
}

export default App