import User from './components/User'
import MyNavbar  from './Navbar'
import { Route, Routes, useLocation, useNavigate, matchPath } from "react-router-dom"
import {useEffect} from "react";
import authService from "./services/auth.service"
import Login from "./components/Login";
import Activities from "./components/Activities";
import ListActivities from "./components/ListActivities";

function App() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const showNavbarRoutes = ["/user", "/activities", "/list_activities/:id"]
    // const showNavbar = showNavbarRoutes.includes(pathname)
    const showNavbar = showNavbarRoutes.some(route => matchPath(route, pathname));

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
            <Route exact path="/list_activities/:id" element={<ListActivities/>}/>
          </Routes>
    </div>
  );
}

export default App;
