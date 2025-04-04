import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import HomePage from "./pages/HomePage/HomePage"
import SignUpPage from "./pages/SignUpPage/SignUpPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import SettingsPage from "./pages/SettingsPage/SettingsPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"


const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("AuthUser: ", authUser);

  return (
    <div >
      <Navbar/>
      <Routes>
        //HomePage
        <Route path="/" element={<HomePage/>} />
        //SignUpPage
        <Route path="/signup" element={<SignUpPage/>} />
        //LoginPage
        <Route path="/login" element={<LoginPage/>} />
        //SettingsPage
        <Route path="/settings" element={<SettingsPage/>} />
        //ProfilePage
        <Route path="/profile" element={<ProfilePage/>} />

      </Routes>

      <Footer/>

    </div>
  )
}

export default App