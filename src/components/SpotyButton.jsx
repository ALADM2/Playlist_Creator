import './CSS/Dropdown.css'
import React, { useContext } from 'react'
import { ListContext } from '../contexts/playlist'

const SpotyButton = (props) => {
    const { playList } = useContext(ListContext);

    const openSpotifyApp = () => {
        // Replace with the specific URI you want to open in Spotify
        let spotifyUri;
        if(playList){
            spotifyUri = playList.uri;
        } else {
            spotifyUri = 'spotify:';
        }

        props.setSpotyClicked(true);

        // Try to open the Spotify app using deep linking
        window.location.href = spotifyUri;
    };

    return (
        <>
            <button className='spoty' onClick={openSpotifyApp}><i className="fa-brands fa-spotify fa-2xl"></i></button>
        </>
    )
}

export default SpotyButton