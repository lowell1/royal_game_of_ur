import React, {useState, useEffect} from "react";
import socket from "../common/socket.js";
import {useHistory} from "react-router-dom";

function UsernameForm() {
    const [username, setUsername] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        document.cookie = `username=${username}`;
        socket.emit("updateUsername", username);
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


export default function Home() {
    const [userList, setUserList] = useState([]);
    const history = useHistory();

    useEffect(function() {
        socket.on("updateUsers", function(users) {
            console.log(users)
            setUserList(users.filter(user => user.userId !== socket.id));
        });

        socket.on("userChallenged", function(user) {
            if(window.confirm(`you have been challenged by ${user.username}`)) 
                socket.emit("acceptChallenge", user.userId)
            else 
                socket.emit("declineChallenge", user.userId);
        })

        socket.on("challengeDeclined", function(message) {
            alert(message);
        });

        socket.on("joinRoom", function(roomId) {
            console.log(`joining ${roomId}`)
            history.push("/play", {roomId});
        });

        return function() {
            socket.removeAllListeners("updateUsers");
            socket.removeAllListeners("userChallenged");
            socket.removeAllListeners("challengeDeclined");
            socket.removeAllListeners("challengeAccepted");
            socket.removeAllListeners("joinRoom");
        }
    }, []);

    function handleChallengeButtonClick(userId) {
        socket.emit("challengeUser", userId);
        console.log("challenguser",userId)
    }

    return (
        <div className="container pt-5">
            <UsernameForm/>
            {userList.length === 0 && <p>no one's here :(</p>}
            <div className="d-flex p-2 flex-wrap">
            {
                userList.map(function(user, index) {
                    return (
                        <div key={index} className="w-25 p-2">
                            <div className="card text-center">
                                {/* <Link to={`/rooms/${room.roomId}`}> */}
                                    <div className="card-body">
                                        <h5 className="card-title overflow-hidden text-nowrap">{user.username}</h5>
                                        <button onClick={() => handleChallengeButtonClick(user.userId)} type="button" className="btn btn-primary">Challenge</button>
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