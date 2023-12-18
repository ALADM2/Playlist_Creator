import React, { useContext, useEffect, useState } from 'react'
import './CSS/Playlist.css'
import { ListContext } from '../contexts/playlist';
import { TokenContext } from '../contexts/login'
import { DeviceContext } from '../contexts/device';
import { Navigate } from 'react-router-dom';
import { getSongInfo } from '../controllers/infoController';
import { findPlaylist } from '../controllers/playlists'
import { playSong, pause, play } from '../controllers/player';
import { Audio, ColorRing } from 'react-loader-spinner'
import Backarrow from './Backarrow';

const Playlist = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elementIndex, setElementIndex] = useState();
    const [currentSongInfo, setCurrentSongInfo] = useState(); //Current song data
    const [currentUri, setCurrentUri] = useState();
    const { getPlayList, playList } = useContext(ListContext);
    const deviceContextValue = useContext(DeviceContext);
    const device = deviceContextValue.device ? deviceContextValue.device : sessionStorage.getItem('device')
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');

    useEffect(() => {
        async function findState() {
            setCurrentSongInfo(await getSongInfo(token));
        }
        if (token) {
            findState();
        } else {
            tokenContextValue.findToken();
        }

        // Check currently playing track every 5 seconds
        if (token) {
            const intervalId = setInterval(findState, 5000);
            // Cleanup the interval on component unmount
            return () => clearInterval(intervalId);
        }

    }, [token])

    useEffect(() => {
        if (currentSongInfo) {
            setCurrentUri(currentSongInfo.item.uri)
            if (currentSongInfo.is_playing === true) {
                setIsPlaying(true);
            }
        }

        async function newPlaylist() {
            getPlayList(await findPlaylist(token, currentSongInfo.context.uri, device))
        }

        if (!playList && currentSongInfo) {
            newPlaylist()
        }
    }, [currentSongInfo])


    function handleIn(index) {
        setIsHovering(true);
        setElementIndex(index);
    }

    function handleOut() {
        setIsHovering(false);
    }

    function handlePlay(song) {
        const playListURI = currentSongInfo.context.uri;
        const songUri = song.track.uri;
        playSong(token, playListURI, songUri, device);
        setIsPlaying(true);
    }

    function handlePause() {
        pause(token, device)
        setIsPlaying(false);
    }

    if (!playList) {
        tokenContextValue.checkTokenState();
    }

    return (
        <>
            {playList ? (
                <div className='listbox'>
                    <Backarrow/>
                    <ul className='list'>
                        <h1 className='name'>{playList.name}</h1>
                        <hr className='bar'></hr>
                        {playList.tracks.items.map((song, index) => (
                            <li onMouseEnter={() => { handleIn(index) }} onMouseLeave={handleOut} className='element' key={song.track.id}>
                                <div className='text'>
                                    <p style={{ fontWeight: 'bold' }}>{song.track.name}</p>
                                    <p>{song.track.artists.map(artist => artist.name).join(', ')}</p>
                                </div>
                                <div className='imgContainer'>
                                    {isHovering && index === elementIndex && song.track.uri !== currentUri ? (
                                        <>
                                            <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.3 }} />
                                            <i onClick={() => { handlePlay(song) }} className="fa-solid fa-circle-play fa-2xl"></i>
                                        </>
                                    ) : isHovering && index === elementIndex && song.track.uri === currentUri && isPlaying ? (
                                        <>
                                            <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.3 }} />
                                            <i onClick={() => { handlePause() }} className="fa-solid fa-circle-pause fa-2xl"></i>
                                        </>
                                    ) : isHovering && index === elementIndex && song.track.uri === currentUri && !isPlaying ? (
                                        <>
                                            <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.3 }} />
                                            <i onClick={() => { play(token, device) }} className="fa-solid fa-circle-play fa-2xl"></i>
                                        </>
                                    ) : song.track.uri === currentUri ? (
                                        <>
                                            <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.6 }} />
                                            <Audio
                                                height="60"
                                                width="80"
                                                color="#4fa94d"
                                                ariaLabel="audio-loading"
                                                wrapperStyle={{}}
                                                wrapperClass="wrapper-class"
                                                visible={true}
                                            />
                                        </>
                                    ) : (
                                        <img src={song.track.album.images[2].url} alt="" />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <ColorRing
                    visible={true}
                    height="150"
                    width="150"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />
            )}
        </>
    )
}

export default Playlist