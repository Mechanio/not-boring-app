import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import fetchservice from "../services/fetch.service";


const Activities = () => {
    const [activities, setActivities] = useState([])
    let lastDay = null
    const [showPopup, setShowPopup] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        one_time_only: false,
        repeat: '',
        start: '',
        finish: ''
    })


    const handleClick = async (event, activityId, isDone) => {
        event.preventDefault()

        try {
           const response = await fetchservice.patchActivity(activityId, isDone)
            if (response.data.id) {
                setActivities(prevActivities => prevActivities.map(activity =>
                    activity.id === activityId ? { ...activity, done: isDone } : activity
                ));
            } else {
                throw new Error(response.response.data.message)
            }
        } catch(err) {
            console.log(err.message)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            formData.start = new Date(formData.start)
            formData.finish = new Date(formData.finish)
            console.log(formData)

            const response = fetchservice.createActivity(formData)
            if (response) {
                window.location.reload()

            } else {
                throw new Error(response.response.data.message)
            }
        } catch (err) {
            if (err.message === "Forbidden") {
                alert("Something went wrong")
            } else {
                alert(err)
            }
        }

        setFormData({
            name: '',
            one_time_only: false,
            repeat: '',
            start: '',
            finish: ''
    });
    setShowPopup(false)
  }

    useEffect(() => {
        fetchservice.getActivitiesInfo()
            .then((response) => {
                    const activitiesData = response.data.filter(activity => {
                        const startDate = new Date(activity.start)
                        const conditionDate = new Date()
                        return format(startDate, "II") === format(conditionDate, "II")
                    }).map(activity => ({
                    ...activity,
                    start: new Date(activity.start),
                    finish: activity.finish ? new Date(activity.finish) : null
                })).sort((a, b) => a.start - b.start);
                setActivities(activitiesData);
                }
            )
    }, [])

    return (
        <div className="activities" style={{ paddingLeft: "15px" }}>
            <div className="container-fluid">
                <button className="btn btn-primary mt-3" onClick={() => setShowPopup(true)}>Create Activity</button>
                {showPopup && (
                    <div className="modal d-block modal-container">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Input Form</h5>
                                    <button type="button" className="btn-close"
                                            onClick={() => setShowPopup(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Name:</label>
                                            <input type="text" className="form-control" name="name"
                                                   value={formData.name} onChange={handleChange}/>
                                        </div>
                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" name="one_time_only"
                                                   checked={formData.one_time_only} onChange={handleChange}/>
                                            <label className="form-check-label">Disposable</label>
                                        </div>
                                        {!formData.one_time_only && (
                                            <div className="mb-3">
                                                <label className="form-label">Repeat:</label>
                                                <input type="text" className="form-control" name="repeat"
                                                       value={formData.repeat} onChange={handleChange}/>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="form-label">Date and time:</label>
                                            <input type="datetime-local" className="form-control" name="start"
                                                   value={formData.start} onChange={handleChange}/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Finish:</label>
                                            <input type="datetime-local" className="form-control" name="finish"
                                                   value={formData.finish} onChange={handleChange}/>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activities.map((activity, index) => {
                    const curDay = format(activity.start, "EEEE")
                    const showDayHeader = curDay !== lastDay
                    if (showDayHeader) {
                        lastDay = curDay
                    }
                    return (
                        <Fragment>
                            {showDayHeader &&
                                <h5 className="mt-4">{curDay} ({format(activity.start, "dd.MM.yyyy")})</h5>}
                            <div key={activity.id}>
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
                                            {activity.done ?(
                                                <span className="crossed-text">{activity.name}</span>
                                                ) : (
                                                    <span>{activity.name}</span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                      {/*                  <div className="progress-circle me-3">*/}
                      {/*                      <svg width="24" height="24" viewBox="0 0 36 36">*/}
                      {/*                          <path*/}
                      {/*                              className="circle-bg"*/}
                      {/*                              d="M18 2.0845*/}
                      {/*a 15.9155 15.9155 0 0 1 0 31.831*/}
                      {/*a 15.9155 15.9155 0 0 1 0 -31.831"*/}
                      {/*                              fill="none"*/}
                      {/*                              stroke="#eee"*/}
                      {/*                              strokeWidth="2.8"*/}
                      {/*                          />*/}
                      {/*                          <path*/}
                      {/*                              className="circle"*/}
                      {/*                              d="M18 2.0845*/}
                      {/*a 15.9155 15.9155 0 0 1 0 31.831*/}
                      {/*a 15.9155 15.9155 0 0 1 0 -31.831"*/}
                      {/*                              fill="none"*/}
                      {/*                              stroke="#4caf50"*/}
                      {/*                              strokeWidth="2.8"*/}
                      {/*                              strokeDasharray="75, 100"*/}
                      {/*                              strokeLinecap="round"*/}
                      {/*                          />*/}
                      {/*                      </svg>*/}
                      {/*                  </div>*/}
                                        <form onSubmit={(e) =>handleClick(e, activity.id, !activity.done)}>
                                            {!activity.done ? (
                                                <button className="btn btn-outline-secondary" type="submit">Not Done</button>
                                            ) : (
                                                <button className="btn btn-success" style={{ minWidth: "96.2px"}} type="submit">Done</button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default Activities