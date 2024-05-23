import React from "react"
// import {Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import fetchservice from "./services/fetch.service";
// import authService from "./services/auth.service";
// import DropdownMenu from "react-bootstrap/DropdownMenu";
import './style.css'

export default function MyNavbar() {
    const {pathname} = useLocation()
    const [profileInfo, setProfileInfo] = useState("");

    const fetchData = async () => {
        await fetchservice.getProfileInfo()
            .then((response) => {
                setProfileInfo(response.data)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (

          <div className="d-flex flex-column flex-shrink-0 p-3 bg-light " style={{
              width: '280px', height: '100vh',
              borderRightWidth: '2px', borderRightStyle: 'solid', borderColor: 'gray'
          }}>
              {profileInfo && <>
                  <h5>Welcome, {profileInfo.firstname} {profileInfo.lastname}</h5>
                  <small>{profileInfo.email}</small>
              </>}
              <hr/>
              <ul className="nav nav-pills flex-column mb-auto">
                  <li className="nav-item">
                      <Link to={'/activities'}>
                          <a className="nav-link active">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                   className="bi bi-table" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15
                          2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1
                          1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                              </svg>
                              Activities
                          </a>
                      </Link>

                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                               className="bi bi-gear" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                              <path
                                  d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                              <path
                                  d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                          </svg>
                          Settings
                      </a>
                  </li>
              </ul>
          </div>


  );
}