import React from "react";

export default function Game({location: {state: {roomId}}}) {
    return (
        <div>
            {roomId}
        </div>
    )
}