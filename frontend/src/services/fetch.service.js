import axios from "axios"

const getUsersInfo = async () => {
    return await axios.get("http://localhost:8000/api/user/")
}

const getProfileInfo = async() => {
    // return await axios.get("http://localhost:8000/api/users/me")
    return await axios.get("http://localhost:8000/api/user/me")
}

const getActivitiesInfo = async() => {
    // return await axios.get("http://localhost:8000/api/activities")
    return await axios.get("http://localhost:8000/api/activities/me")
}

const createActivity = (formData) => {
    return axios.post("http://localhost:8000/api/activities/", formData)
}

const patchActivity = async(item_id, done) => {
    return await axios.patch(`http://localhost:8000/api/activities/${item_id}`, {done})
}

const fetchservice = {
    getUsersInfo,
    getProfileInfo,
    getActivitiesInfo,
    createActivity,
    patchActivity
}

export default fetchservice