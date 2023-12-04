import './CSS/InfoPanel.css'
import React, { useEffect, useState } from 'react'
import { getSongInfo } from '../controllers/infoController'


const InfoPanel = (props) => {
    const [songInfo, setSongInfo] = useState(false);
    const [trackName, setTrackName] = useState(false);
    const [artist, setArtist] = useState(false);
    const [image, setImage] = useState(false);

    useEffect(() => {
        const findInfo = async () => {
            const response = await getSongInfo(props.token, props.device)
            if (!songInfo || response.item.id !== songInfo.item.id) {
                console.log('Track has changed:', response.item.name);
                // Do something when the track changes
                // For example, update the current track state
                setSongInfo(response);
            }
        }
        if(props.device){
            findInfo();
        }

        // Check currently playing track every 10 seconds (adjust as needed)
        const intervalId = setInterval(findInfo, 5000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [props])

    useEffect(() => {
        if (songInfo && !songInfo.error) {
            // console.log(songInfo)
            setTrackName(songInfo.item.name)
            setArtist(songInfo.item.artists[0].name)
            setImage(songInfo.item.album.images[1].url)
        }
    }, [songInfo])

    return (
        <div className='infoPanel'>
            {songInfo.item ? (
                <>
                    <div className='albumImg'>
                        <img src={image ? image : undefined} alt="" />
                    </div>
                    <div className='info'>
                        <div style={{display: 'flex'}}><h2>Track Name:</h2><p>&nbsp;{trackName}</p></div>
                        <div style={{display: 'flex'}}><h2>Artist:</h2><p>&nbsp;{artist}</p></div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

export default InfoPanel