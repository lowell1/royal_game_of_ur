import React, {useState} from "react";
import {Link} from "react-router-dom";

function UsernameForm(props) {
    const [username, setUsername] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        console.log(username);
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

// username of person in room
const fakeRooms = [
    {username: "ekjwlkj", roomId: 1},
    {username: "asdasdasd", roomId: 2},
    {username: "gdadsgasdg", roomId: 3},
    {username: "asdgsd", roomId: 4},
    {username: "werasdfawe", roomId: 5},
    {username: "el;fjawkj", roomId: 6},
    {username: ";lkfjealwkawssdasdasd", roomId: 7}
];

export default function Home(props) {
    return (
        <div className="container pt-5">
            <UsernameForm/>
            <div className="d-flex p-2 flex-wrap">
            {
                fakeRooms.map(function(room) {
                    return (
                        <div key={`room${room.roomId}`} className="w-25 p-2">
                            <div className="card text-center">
                                <Link to={`/rooms/${room.roomId}`}>
                                    <div className="card-body">
                                        <h5 className="card-title overflow-hidden text-nowrap">{room.username}</h5>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })
            }
            </div>
        </div>
    );
}