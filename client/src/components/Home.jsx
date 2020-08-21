import React, {useState, useEffect} from "react";
// import {
//     challengeUser, 
//     challengeResponse,
//     userChallenged,
//     // challengeAccepted,
//     // challengeDeclined,
//     // acceptChallenge,
//     // declineChallenge
// } from "../common/event_aliases";
// import {Link} from "react-router-dom";
import socket from "../common/socket.js";

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

    useEffect(function() {
    //     socket.on(challengeUser, function({username, userId}) {
    //         socket.emit(challengeResponse, prompt(`you have been challenged by ${username}!`));
    //     });
    //     socket.on(challengeResponse, function(isChallengeAccepted) {
    //         alert(isChallengeAccepted ? "challenge accepted" : "challenge declined");
    //     });

        socket.on("updateUsers", function(users) {
            console.log(users)
            setUserList(users.filter(user => user.userId !== socket.id));
        });

        socket.on("userChallenged", function(user) {
            console.log(`you have been challenged by ${user.username}`)
            // console.log(window.confirm(`you have been challenged by ${user.username}`) ? "acceptChallenge" : "declineChallenge");
            socket.emit(window.confirm(`you have been challenged by ${user.username}`) ? "acceptChallenge" : "declineChallenge");
            // socket.emit("declineChallenge");
            // alert(`you have been challenged by ${user.username}`)
        })

        socket.on("challengeDeclined", function(message) {
            alert(message);
        });

        socket.on("challengeAccepted", function() {
            alert(`accepts your challenge`);
        });

        return function() {
            socket.removeAllListeners("updateUsers");
            socket.removeAllListeners("userChallenged");
            socket.removeAllListeners("challengeDeclined");
            socket.removeAllListeners("challengeAccepted");
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