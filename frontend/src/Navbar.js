import React, {Fragment} from "react"
import {Link, useLocation, NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import fetchservice from "./services/fetch.service";
import './style.css'
import {format} from "date-fns";

export default function MyNavbar() {
    const [profileInfo, setProfileInfo] = useState({});
    const [activityLists, setActivityLists] = useState([]);
    const [isAddingNewList, setIsAddingNewList] = useState(false);
    const [newListName, setNewListName] = useState({name: ""});

    useEffect(() => {
        fetchservice.getProfileInfo()
            .then((response) => {
                setProfileInfo(response.data)
                console.log(profileInfo)
                setActivityLists(response.data.activity_lists)
            })
    }, [])


      // Handle input submission
    const handleNewListSubmit = async () => {
        if (newListName.name.trim() === "") return;
        try {
            const response = await fetchservice.createListActivities(newListName);
            if (response) {
                window.location.reload()
            }
        } catch (error) {
            console.error("Error adding new list:", error);
        }
    };

  return (
      <div className="my-navbar d-flex flex-column flex-shrink-0 p-3 " style={{
          width: '280px', height: '100vh', background: '#f5f5f5',
          borderRightWidth: '2px', borderRightStyle: 'solid', borderColor: 'gray'
      }}>
          {profileInfo && <>
              <h5>Welcome, {profileInfo.firstname} {profileInfo.lastname}</h5>
              <small>{profileInfo.email}</small>
          </>}
          <hr/>
          <ul className="nav nav-pills flex-column">
              {activityLists.map((activity_list, index) => {
                      return (
                          <Fragment key={activity_list.id}>
                              <div key={activity_list.id}>
                                  <li className="nav-item">
                                      <NavLink to={'/list_activities/' + activity_list.id}
                                               className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                               className="bi bi-list" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                                              <path fill-rule="evenodd"
                                                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                                          </svg>
                                          {activity_list.name}
                                      </NavLink>
                                  </li>
                              </div>
                          </Fragment>
                      )
                  }
              )}
              <div key="new-list">
                  <li className="nav-item">
                      {isAddingNewList ? (
                          <input type="text" className="form-control" placeholder="Enter list name" value={newListName.name}
                            onChange={(e) => setNewListName({name: e.target.value})}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleNewListSubmit();
                            }}
                            onBlur={() => setIsAddingNewList(false)} // Close input when focus is lost
                            autoFocus
                          />
                      ) : (
                          <a className="nav-link" href="#" onClick={() => setIsAddingNewList(true)}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="#7B7C7C"
                                   xmlns="http://www.w3.org/2000/svg" style={{marginRight: '5px'}}>
                                  <path
                                      d="M10.8036 9.19643V3.61607C10.8036 3.32007 10.686 3.03619 10.4767 2.82689C10.2674 2.61759 9.9835 2.5 9.6875 2.5C9.3915 2.5 9.10762 2.61759 8.89832 2.82689C8.68901 3.03619 8.57143 3.32007 8.57143 3.61607V9.19643H2.99107C2.69507 9.19643 2.41119 9.31401 2.20189 9.52332C1.99259 9.73262 1.875 10.0165 1.875 10.3125C1.875 10.6085 1.99259 10.8924 2.20189 11.1017C2.41119 11.311 2.69507 11.4286 2.99107 11.4286H8.57143V17.0089C8.57143 17.3049 8.68901 17.5888 8.89832 17.7981C9.10762 18.0074 9.3915 18.125 9.6875 18.125C9.9835 18.125 10.2674 18.0074 10.4767 17.7981C10.686 17.5888 10.8036 17.3049 10.8036 17.0089V11.4286H16.3839C16.6799 11.4286 16.9638 11.311 17.1731 11.1017C17.3824 10.8924 17.5 10.6085 17.5 10.3125C17.5 10.0165 17.3824 9.73262 17.1731 9.52332C16.9638 9.31401 16.6799 9.19643 16.3839 9.19643H10.8036Z"
                                      fill="#7B7C7C"></path>
                              </svg>
                              New List
                          </a>
                      )}
                  </li>
              </div>
          </ul>
          <hr/>
          <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                  <NavLink to={'/activities'}
                           className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                           className="bi bi-table" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15
                          2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1
                          1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                      </svg>
                      All Activities
                  </NavLink>

              </li>
              <li className="nav-item">
                  <a className="nav-link" href="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                               className="bi bi-gear" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                          </svg>
                          Settings
                      </a>
                  </li>
              </ul>
      </div>
);
}