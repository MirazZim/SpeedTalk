import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import HomePage from "./pages/HomePage/HomePage"
import SignUpPage from "./pages/SignUpPage/SignUpPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import SettingsPage from "./pages/SettingsPage/SettingsPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("AuthUser: ", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10animate-spin"/>
      </div>
    );
  }

  return (
    <div >
      <Navbar/>
      <Routes>
        //HomePage
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />

        //SignUpPage
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>} />
        
        //LoginPage
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        
        //SettingsPage
        <Route path="/settings" element={<SettingsPage/>} />
        
        //ProfilePage
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />

      </Routes>

      <Toaster/>


      <Footer/>

    </div>
  )
}

export default App