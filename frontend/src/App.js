import User from './components/User'
import MyNavbar  from './Navbar'
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import {useEffect} from "react";
import authService from "./services/auth.service"
import Login from "./components/Login";
import Activities from "./components/Activities";

function App() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const showNavbarRoutes = ["/user", "/activities"]
    const showNavbar = showNavbarRoutes.includes(pathname)

    useEffect(() => {
        authService.authGuard(pathname, navigate)
    }, [pathname])

  return (
    <div className="content d-flex">
      {showNavbar && <MyNavbar />}
          <Routes>
            <Route exact path="/auth/login" element={<Login/>}/>
            <Route exact path="/user" element={<User/>}/>
            <Route exact path="/activities" element={<Activities/>}/>
          </Routes>
    </div>
  );
}

export default App;
