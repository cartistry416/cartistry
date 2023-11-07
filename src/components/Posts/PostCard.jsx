
import React from "react";


function PostCard(props) {

    const {title, ownerUsername, textContent, owner, likes, forks, tags} = props
    return (
        <li>
            <h1> {title}</h1>
            <h2> posted by {ownerUsername}</h2>
            <p>
                {textContent}
            </p>
        </li>
    )
}

export default PostCard