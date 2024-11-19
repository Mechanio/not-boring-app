import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import fetchservice from "../services/fetch.service";
import { HonestWeekPicker } from "../calendar/weekPicker";


const Activities = () => {
    const [activities, setActivities] = useState([])
    let lastDay = null
    const [sortBy, setSortBy] = useState("date")
    const [sortedActivities, setSortedActivities] = useState([]);
    const [week, setWeek] = useState({ firstDay: new Date()});

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

    useEffect(() => {
        fetchservice.getActivitiesInfo()
            .then((response) => {
                    const activitiesData = response.data.filter(activity => {
                        const startDate = new Date(activity.start)
                        const conditionDate = week.firstDay
                        return format(startDate, "II") === format(conditionDate, "II")
                    }).map(activity => ({
                    ...activity,
                    start: new Date(activity.start + 'Z'),
                    finish: activity.finish ? new Date(activity.finish + 'Z') : null
                }));
                setActivities(activitiesData);
                }
            )
    }, [week])

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
                    <div className="weekCalendar mt-3">
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

export default Activities