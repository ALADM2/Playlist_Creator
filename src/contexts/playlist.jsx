import React, { createContext, useState } from "react";

const ListContext = createContext();

// Provides components with login state
const ListProvider = (props) => {
    const [playList, setPlaylist] = useState();

    function getPlayList(data) {
        setPlaylist(data)
    }

    return (
        <ListContext.Provider value={{ playList, getPlayList }}>
            {props.children}
        </ListContext.Provider>
    )
}

export { ListContext, ListProvider }