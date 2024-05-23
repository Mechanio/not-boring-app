import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import { format } from 'date-fns';
import fetchservice from "../services/fetch.service";


const Activities = () => {
    const [activities, setActivities] = useState([])
    // const {id} = useParams()
    const navigate = useNavigate()

    // const updateActor = async () => {
    //     try {
    //         const response = await fetchservice.updateActor(id, actor?.firstname, actor?.lastname)
    //         if (response && response.data && response.data.message === "Updated") {
    //             navigate("/actors")
    //
    //         } else {
    //             throw new Error(response.response.data.message)
    //         }
    //     } catch (err) {
    //         if (err.message === "Forbidden") {
    //             alert("Only admins can update actor")
    //         } else {
    //             alert(err)
    //         }
    //     }
    // }

    useEffect(() => {
        fetchservice.getActivitiesInfo()
            .then((response) => {
                    const activitiesData = response.data.map(activity => ({
                    ...activity,
                    start: new Date(activity.start),
                    finish: activity.finish ? new Date(activity.finish) : null
                }));
                setActivities(activitiesData);
                }
            )
    }, [])

    return (
        <div className="activities" style={{ paddingLeft: "15px" }}>
            <div className="container-fluid">
                {activities.map((activity, index) => (
                    <div key={activity.id}>
                        {/*<h5 className="mt-4">{activity.start}</h5>*/}
                        <div
                            className="d-flex align-items-center justify-content-between border rounded p-2 my-2 activity">
                            <div className="d-flex align-items-center">
                                <div className="text-center" style={{minWidth: '60px'}}>
                                    <div>{format(activity.start, "HH:mm")}</div>
                                    {activity.finish && (
                                        <>
                                            <div className="border-bottom w-100 my-1"/>
                                            <div>{format(activity.finish, "HH:mm")}</div>
                                        </>
                                    )}
                                </div>
                                <div className="vertical-line"></div>

                                <div className="ms-3">
                                    <span>{activity.name}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="progress-circle me-3">
                                    <svg width="24" height="24" viewBox="0 0 36 36">
                                        <path
                                            className="circle-bg"
                                            d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#eee"
                                            strokeWidth="2.8"
                                        />
                                        <path
                                            className="circle"
                                            d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#4caf50"
                                            strokeWidth="2.8"
                                            strokeDasharray="75, 100"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <button className="btn btn-outline-secondary btn-sm">Done</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Activities