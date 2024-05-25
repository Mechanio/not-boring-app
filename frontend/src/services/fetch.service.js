import axios from "axios"

const getUsersInfo = async () => {
    return await axios.get("http://localhost:8000/api/users/")
}

const getProfileInfo = async() => {
    return await axios.get("http://localhost:8000/api/users/me")
}

const getActivitiesInfo = async() => {
    return await axios.get("http://localhost:8000/api/activities")
}

const createActivity = (formData) => {
    return axios.post("http://localhost:8000/api/activities/", formData)
}

const patchActivity = (item_id, done) => {
    return axios.patch(`http://localhost:8000/api/activities/${item_id}`, {done})
}

const fetchservice = {
    getUsersInfo,
    getProfileInfo,
    getActivitiesInfo,
    createActivity,
    patchActivity
}

export default fetchservice