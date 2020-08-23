import React, {useEffect, useState} from "react";
import {useImmer} from "use-immer";
import socket from "../common/socket";

function ChatBox({roomId}) {
    const [chatMessages, setChatMessages] = useImmer([]);
    const [inputVal, setInputVal] = useState("");

    function handleChange(event) {
        setInputVal(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit("chatMessage", {roomId, message: inputVal});
        setInputVal("");
    }

    useEffect(function(){
        console.log("game.jsx useeffect");
        socket.on("chatMessage", function(data) {
            setChatMessages(function(draft) {
                draft.push(data);
            });
        });
        
        return function() {
            socket.removeAllListeners("chatMessage");
        }
    }, [setChatMessages]);

    return (
        <div>
            <div>
                {
                    chatMessages.map(function({message, username}, idx) {
                        return <p key={idx}>{username}: {message}</p>;
                    })
                }
            </div>
            <form className="form-inline" onSubmit={handleSubmit}>
                <input 
                    className="form-control mx-3" 
                    type="text" 
                    value={inputVal} 
                    onChange={handleChange}
                />
                <button className="btn btn-primary" type="submit">Send</button>
            </form>
        </div>
    );
}

export default function Game({location: {state: {roomId}}}) {
    return (
         <div className="container">
             <div className="row">
                <div className="col-7 border">
                    alwdjalwdjalwkdjalwkjdlakwjd
                </div>
                <div className="col border">
                    <ChatBox roomId={roomId}/>
                </div>
             </div>
        </div>
    );
}