import React, { useContext, useEffect, useState } from 'react'
import './CSS/Playlist.css'
import { ListContext } from '../contexts/playlist';
import { TokenContext } from '../contexts/login'
import { Navigate } from 'react-router-dom';
import { getPlaybackState } from '../controllers/player';
import { Audio } from 'react-loader-spinner'

const Playlist = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [elementIndex, setElementIndex] = useState();
    const [playState, setPlayState] = useState(); //Current play data
    const [currentUri, setCurrentUri] = useState();
    const { playList } = useContext(ListContext);
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');

    //Check player state
    useEffect(() => {
        async function findState() {
            setPlayState(await getPlaybackState(token));
        }
        if (token) {
            findState();
        }
    }, [token])

    useEffect(() => {
        if (playState) {
            setCurrentUri(playState.item.uri)
        }
    }, [playState])

    function handleIn(index) {
        setIsHovering(true);
        setElementIndex(index);
    }

    function handleOut() {
        setIsHovering(false);
    }

    function handleClick() {

    }

    if (!playList) {
        return <Navigate to="/mainpage" />;
    }

    return (
        <div className='listbox'>
            <ul className='list'>
                <h2 className='name'>{playList.name}</h2>
                <hr className='bar'></hr>
                {playList.tracks.items.map((song, index) => (
                    <li onMouseEnter={() => { handleIn(index) }} onMouseLeave={handleOut} className='element' key={song.track.id}>
                        <div className='text'>
                            <p>Track Name: {song.track.name}</p>
                            <p>Artist: {song.track.artists.map(artist => artist.name).join(', ')}</p>
                        </div>
                        <div className='imgContainer'>
                            {isHovering && index === elementIndex && song.track.uri !== currentUri ? (
                                <>
                                    <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.3 }} />
                                    <i onClick={handleClick} class="fa-solid fa-circle-play fa-2xl"></i>
                                </>
                            ) : song.track.uri === currentUri && isHovering && index === elementIndex ? (
                                <>
                                    <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.3 }} />
                                    <i className="fa-solid fa-circle-pause fa-2xl"></i>
                                </>
                            ) : song.track.uri === currentUri ? (
                                <>
                                    <img src={song.track.album.images[2].url} alt="" style={{ opacity: 0.7 }} />
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
    )
}

export default Playlist