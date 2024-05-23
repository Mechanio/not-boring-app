import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';

import fetchservice from "../services/fetch.service";


const User = () => {
    const [users, setUsers] = useState([])
    // const {id} = useParams()
    const navigate = useNavigate()

    // const updateActor = async () => {
    //     try {
    //         const response = await fetchservice.updateActor(id, actor?.firstname, actor?.lastname)
    //         if (response && response.data && response.data.message === "Updated") {
    //             navigate("/actors")
    //
    //         } else {
    //             throw new Error(response.response.data.message)
    //         }
    //     } catch (err) {
    //         if (err.message === "Forbidden") {
    //             alert("Only admins can update actor")
    //         } else {
    //             alert(err)
    //         }
    //     }
    // }

    useEffect(() => {
        fetchservice.getUsersInfo()
            .then((response) => {
                    setUsers(response.data)
                }
            )
    }, [])

    return (
        <div className="users">
            <form className="form-horizontal">
                <div className="form-group row">
                    <table className='table table-striped table-bordered table-hover'>
                        <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Is active?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.is_active ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                </div>
            </form>
        </div>
    )
}

export default User