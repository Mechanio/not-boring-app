import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

export default function Registration() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',

    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChangeCreateUser = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmitCreateUser = async (event) => {
        event.preventDefault()
        try {
            const response = await authService.createUser(formData)
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

    return (
        <div className="login">
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form className="form-horizontal" onSubmit={handleSubmitCreateUser}>
                <div className="text-center">
                    <div className="form-group row">
                        <label className="control-label col-sm-5">Firstname: </label>
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name="firstname" value={formData.firstname}
                                   onChange={handleChangeCreateUser}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-5">Lastname: </label>
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name="lastname" value={formData.lastname}
                                   onChange={handleChangeCreateUser}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-5">Email: </label>
                        <div className="col-sm-2">
                            <input className="form-control" type="email" name="email" value={formData.email}
                                   onChange={handleChangeCreateUser}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-5">Password: </label>
                        <div className="col-sm-2">
                            <input className="form-control" type="password" name="password"  value={formData.password}
                                   onChange={handleChangeCreateUser}/>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">Sign up</button>
                </div>
            </form>
        </div>
    )
}