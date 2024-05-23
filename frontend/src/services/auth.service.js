import axios from "axios";

// const signup = (email, password) => {
//   return axios
//     .post(API_URL + "/signup", {
//       email,
//       password,
//     })
//     .then((response) => {
//       if (response.data.accessToken) {
//         localStorage.setItem("user", JSON.stringify(response.data));
//       }
//
//       return response.data;
//     });
// };

// username-email
const login = (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return axios.post("http://localhost:8000/api/login", params, {
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
};

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

    if (!accessToken && !['/'].includes(pathname)) {
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
             if (window.location !== 'http://localhost:3000/auth/login') {
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
    authInterceptor
}

export default authService