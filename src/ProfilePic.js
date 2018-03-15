import React from "react";

export default function ProfilePic(props) {
    return (
        <div>
            <img src={props.profilepic} alt={`${props.first} ${props.last}`} />
            <button onClick={props.toggleUploadModal}>
                Toggle Upload Modal
            </button>
        </div>
    );
}
