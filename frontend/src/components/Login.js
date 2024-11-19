import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

export default function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleClick = async (event) => {
        event.preventDefault()
        try {
           const response = await authService.login(username, password)
            if (response && response.data && response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate('/activities')
                return response.data;
            } else {
                throw new Error(response.response.data.message)
            }
        } catch(err) {
            setError(err.message)
        }
    }

    const handleRegistrationClick = () => {
        navigate('/auth/registration'); // Navigate to the registration page
    };

    return (
        <div className="login-bg">
            <div className="login-page">
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="login-form">


                <form className="form-signin" onSubmit={handleClick}>
                    <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                    <input type="email" className="form-control" placeholder="Email address" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" className="form-control mt-2" placeholder="Password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <button class="btn btn-primary mt-2" type="submit">Sign in</button>
                    <button className="btn btn-secondary mt-2 " onClick={handleRegistrationClick}>Registration</button>
                </form>



                    {/*<form className="form-horizontal" onSubmit={handleClick}>*/}
                    {/*    <div className="text-center">*/}
                    {/*        <div className="form-group row">*/}
                    {/*            <label className="control-label col-sm-5">Email: </label>*/}
                    {/*            <div className="col-sm-2">*/}
                    {/*                <input className="form-control" type="email" value={username}*/}
                    {/*                       onChange={(e) => setUsername(e.target.value)}/>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="form-group row">*/}
                    {/*            <label className="control-label col-sm-5">Password: </label>*/}
                    {/*            <div className="col-sm-2">*/}
                    {/*                <input className="form-control" type="password" value={password}*/}
                    {/*                       onChange={(e) => setPassword(e.target.value)}/>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <button className="btn btn-primary mt-2" type="submit">Login</button>*/}
                    {/*    </div>*/}
                    {/*</form>*/}
                    {/*<div className="text-center mt-2">*/}
                    {/*    <button className="btn btn-secondary" onClick={handleRegistrationClick}>Registration</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
)
}