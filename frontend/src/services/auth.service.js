import axios from "axios";


// username-email
const login = (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return axios.post("http://localhost:8000/api/auth/login", params, {
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
};

const createUser = (formData) => {
    return axios.post("http://localhost:8000/api/auth/registration", formData)
}
// const logout = () => {
//     return axios
//         .post("http://localhost:5000/api/auth/logout-access", {data: "data"})
//         .then(() => {
//             localStorage.removeItem("user")
//             window.location.reload()
//         })
// }

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

const getAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.access_token) {
        return null
    }
    return user.access_token
};

const authGuard = (pathname, navigate) => {
    const accessToken = getAccessToken()
    const publicPaths = ['/auth/registration', '/auth/login'];

    // if (!accessToken && !['/'].includes(pathname)) {
    if (!accessToken && !publicPaths.includes(pathname)) {
        navigate('/auth/login')
    }
}

const authInterceptor = () => {
     axios.interceptors.request.use(
        (config) => {
            const accessToken = getAccessToken()

            if ((accessToken) && config.headers) {
                config.headers.Authorization = `Bearer ${accessToken}`
                config.headers["Access-Control-Allow-Origin"] = '*'
            }
            return config
        })

     axios.interceptors.response.use((response) => response,
         (error) => {
        //catches if the session ended!
         if (error.response && error.response.status === 401) {
             if (window.location !== 'http://localhost:3000/auth/login' || window.location!== 'http://localhost:3000/auth/registration') {
                 localStorage.removeItem("user")
                 window.location = '/auth/login'
             }
             return error
        }
        return error
    });
}

const authService = {
    login,
    // logout,
    getCurrentUser,
    getAccessToken,
    authGuard,
    authInterceptor,
    createUser
}

export default authService