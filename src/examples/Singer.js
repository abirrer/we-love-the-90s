import React from 'react'

export default function Singer(props) {
    return (
        <div className="singer">
            <h2>Name: {props.name}</h2>
            <h3>Band: {props.band}</h3>
        </div>
    )
}
