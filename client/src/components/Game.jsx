import React from "react";

export default function Game(props) {
    return (
        <div>
            game {props.match.params.roomId}
        </div>
    )
}