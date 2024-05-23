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

const fetchservice = {
    getUsersInfo,
    getProfileInfo,
    getActivitiesInfo
}

export default fetchservice