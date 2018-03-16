import React from "react";

export default function Bio(props) {
    return (
        <div>
            <p> {props.bio} </p>
            <button onClick={props.toggleBioModal}>Edit Bio</button>
        </div>
    );
}
