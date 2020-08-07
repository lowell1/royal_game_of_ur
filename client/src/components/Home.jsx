import React, {useState} from "react";
import {Link} from "react-router-dom";

function UsernameForm(props) {
    const [username, setUsername] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        document.cookie = username;
        setUsername("");
    }

    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <form className="form-inline" onSubmit={handleSubmit}>
            <label htmlFor="usernameInput">Set username:</label>
            <input 
                className="form-control mx-3" 
                type="text" 
                value={username} 
                onChange={handleChange}
            />
            <button className="btn btn-primary" type="submit">Submit</button>
        </form>
    );
}

export default function Home(props) {
    console.log(props.socket, props.userList);

    return (
        <div className="container pt-5">
            <UsernameForm/>
            <div className="d-flex p-2 flex-wrap">
            {
                props.userList.map(function(user, index) {
                    return (
                        <div key={index} className="w-25 p-2">
                            <div className="card text-center">
                                {/* <Link to={`/rooms/${room.roomId}`}> */}
                                    <div className="card-body">
                                        <h5 className="card-title overflow-hidden text-nowrap">{user.username}</h5>
                                    </div>
                                {/* </Link> */}
                            </div>
                        </div>
                    );
                })
            }
            </div>
        </div>
    );
}