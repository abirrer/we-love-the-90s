import React from "react";

export default function ProfilePic(props) {
    console.log(props);
    return (
        <div id="profilepic__outer-box">
            <img
                src={props.profilepic}
                alt={`${props.first} ${props.last}`}
                onClick={props.toggleUploadModal}
            />
        </div>
    );
}

// <button onClick={props.toggleUploadModal}>Toggle Upload Modal</button>;
