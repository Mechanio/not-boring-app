import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import fetchservice from "../services/fetch.service";
import { HonestWeekPicker } from "../calendar/weekPicker";


const ListActivities = () => {
    const [activities, setActivities] = useState([])
    let lastDay = null
    const {id} = useParams()
    const [showPopup, setShowPopup] = useState(false)
    const [sortBy, setSortBy] = useState("date")
    const [sortedActivities, setSortedActivities] = useState([]);
    const [week, setWeek] = useState({ firstDay: new Date()});
    const [formData, setFormData] = useState({
        name: '',
        one_time_only: false,
        repeat: '',
        start: '',
        finish: '',
        activity_list_id: '',
    })

    const onChangeChooseWeek = (week) => {
        setWeek(week);
      };


    const handleSortChange = (option) => {
        setSortBy(option);
    };


    const handleClickPatchActivity = async (event, activityId, isDone) => {
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

    const handleChangeCreateActivity = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmitCreateActivity = (e) => {
        e.preventDefault();
        try {
            formData.start = new Date(formData.start)
            formData.finish = new Date(formData.finish)
            formData.activity_list_id = id

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
            finish: '',
            activity_list_id: ''
    });
    setShowPopup(false)
  }

    useEffect(() => {
        fetchservice.getListActivitiesInfo(id)
            .then((response) => {
                    const activitiesData = response.data.filter(activity => {
                        const startDate = new Date(activity.start)
                        const conditionDate = week.firstDay
                        return format(startDate, "II") === format(conditionDate, "II")
                    }).map(activity => ({
                    ...activity,
                    start: new Date(activity.start),
                    finish: activity.finish ? new Date(activity.finish) : null
                }));
                setActivities(activitiesData);
                }
            )
    }, [week, id])

    useEffect(() => {
        let sorted = [...activities];

        if (sortBy === "date") {
            sorted.sort((a, b) => a.start - b.start);
        } else if (sortBy === "status") {
            sorted.sort((a, b) => {
                if (a.done !== b.done) {
                    return a.done - b.done;
                }
                // If `done` status is the same, sort by start date
                return a.start - b.start;
            })
        }

        setSortedActivities(sorted);
    }, [sortBy, activities])


    return (
        <div className="activities" style={{ paddingLeft: "15px" }}>
            <div className="container-fluid">
                <div>
                    <button className="btn btn-primary" onClick={() => setShowPopup(true)}>Create Activity</button>
                    {showPopup && (
                        <div className="modal d-block modal-container">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add new activity</h5>
                                        <button type="button" className="btn-close"
                                                onClick={() => setShowPopup(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmitCreateActivity}>
                                            <div className="mb-3">
                                                <label className="form-label">Name:</label>
                                                <input type="text" className="form-control" name="name"
                                                       value={formData.name} onChange={handleChangeCreateActivity}/>
                                            </div>
                                            <div className="mb-3 form-check">
                                                <input type="checkbox" className="form-check-input" name="one_time_only"
                                                       checked={formData.one_time_only}
                                                       onChange={handleChangeCreateActivity}/>
                                                <label className="form-check-label">Disposable</label>
                                            </div>
                                            {!formData.one_time_only && (
                                                <div className="mb-3">
                                                    <label className="form-label">Repeat:</label>
                                                    <input type="text" className="form-control" name="repeat"
                                                           value={formData.repeat}
                                                           onChange={handleChangeCreateActivity}/>
                                                </div>
                                            )}
                                            <div className="mb-3">
                                                <label className="form-label">Date and time:</label>
                                                <input type="datetime-local" className="form-control" name="start"
                                                       value={formData.start} onChange={handleChangeCreateActivity}/>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Finish:</label>
                                                <input type="datetime-local" className="form-control" name="finish"
                                                       value={formData.finish} onChange={handleChangeCreateActivity}/>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="weekCalendar mt-3 px-4">
                        <HonestWeekPicker onChange={onChangeChooseWeek}/>
                    </div>

                    <div className="dropdown mt-3">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false"> Sort By
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item" onClick={() => handleSortChange("date")}>Date</a></li>
                            <li><a className="dropdown-item" onClick={() => handleSortChange("status")}>Status</a></li>
                        </ul>
                    </div>

                </div>
                {sortedActivities.map((activity, index) => {
                    const curDay = format(activity.start, "EEEE")
                    const showDayHeader = curDay !== lastDay
                    if (showDayHeader) {
                        lastDay = curDay
                    }
                    return (
                        <Fragment key={activity.id}>
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
                                            {activity.done ? (
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
                                        <form onSubmit={(e) => handleClickPatchActivity(e, activity.id, !activity.done)}>
                                            {!activity.done ? (
                                                <button className="btn btn-outline-secondary" type="submit">Not
                                                    Done</button>
                                            ) : (
                                                <button className="btn btn-success" style={{minWidth: "96.2px"}}
                                                        type="submit">Done</button>
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

export default ListActivities