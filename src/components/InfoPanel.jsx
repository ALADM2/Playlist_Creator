import './CSS/InfoPanel.css'
import React, { useEffect, useState } from 'react'
import { getSongInfo } from '../controllers/infoController'
import { ColorRing } from 'react-loader-spinner'

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
        if (props.device) {
            findInfo();
        }

        // Check currently playing track every 10 seconds (adjust as needed)
        const intervalId = setInterval(findInfo, 5000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [props])

    useEffect(() => {
        if (songInfo && !songInfo.error) {
            setTrackName(songInfo.item.name)
            const artistArray = songInfo.item.artists.map(artist => artist.name).join(', ')
            setArtist(artistArray)
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
                        <div style={{ display: 'flex' }}><h2>Track Name:</h2><p>&nbsp;{trackName}</p></div>
                        <div style={{ display: 'flex' }}><h2>Artist:</h2><p>&nbsp;{artist}</p></div>
                    </div>
                </>
            ) : (
                <ColorRing
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />
            )}
        </div>
    )
}

export default InfoPanel