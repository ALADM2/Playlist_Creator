import React, { useState, useContext, useEffect } from 'react'
import DropDown from './DropDown'
import Input from './Input'
import { playPlaylist, pause, next, previous, getPlaybackState, play } from '../controllers/player'
import { findPlaylist } from '../controllers/playlists'
import { TokenContext } from '../contexts/login'
import { ListContext } from '../contexts/playlist'
import InfoPanel from './InfoPanel'
import { Navigate, Link } from 'react-router-dom'
import './CSS/MainPage.css'

const MainPage = () => {
    const [playState, setPlayState] = useState(); //Current play data
    const [topSongs, setTopSongs] = useState();
    const [song, setSong] = useState();
    const [artist, setArtist] = useState();
    const [device, setDevice] = useState();
    const [player, setPlayer] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [dataModified, setDataModified] = useState(false);
    const [playButton, setPlayButton] = useState(false);
    const { getPlayList, playList } = useContext(ListContext);
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

    //Get song data if something is playing
    useEffect(() => {
        async function setPlayingData() {
            getPlayList(await findPlaylist(token, playState.context.uri))
            if (playState.is_playing === true) {
                setPlaying(true);
                setPlayer(true);
            }
        }
        if (playState) {
            setPlayingData()
        }
    }, [playState])

    //If artist is modified
    useEffect(() => {
        setDataModified(true);
    }, [artist])

    useEffect(() => {
        setDataModified(false);
    }, [playList])

    useEffect(() => {
        setPlayButton(true);
    }, [device])

    function handlePlay() {
        playPlaylist(token, playList.uri, device)
        setPlayer(true);
        setPlaying(true);
        setPlayButton(false);
    }

    function handleResume() {
        if (device) {
            play(token, device)
            setPlayer(true);
            setPlaying(true);
        } else {
            alert("Please, select a device")
        }
    }

    function handlePause() {
        if (device) {
            pause(token, device);
            setPlaying(false);
        } else {
            alert("Please, select a device")
        }
    }

    function handleSkip(action) {
        action === 'next' ? next(token, device) : previous(token, device)
    }

    if (tokenContextValue.token === null && !sessionStorage.getItem('token')) {
        return <Navigate to="/" />;
    }

    return (
        <div className='player'>
            <div className='selectMenu'>
                <Input setTopSongs={setTopSongs} setArtist={setArtist} artist={artist} />
                <DropDown setSong={setSong} topSongs={topSongs} data={'topSongs'} />
                {song && dataModified ? (
                    <Input data={'playlist'} artist={artist} song={song} />
                ) : playList && !dataModified ? (
                    <div className='current'>
                        <label htmlFor="artist" style={{ marginBottom: 0 }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Playlist</label>
                        {playList.tracks.items.length > 0 ? (
                        <Link to='/playlist' style={{ textDecoration: 'none' }}>
                            <button className='currentButton' id="artist" >
                                {playList.name}
                            </button>
                        </Link>
                        ) : <></>}
                    </div>
                ) : <></>}
                <DropDown setDevice={setDevice} data={'devices'} />
                {device && playList ? (
                    <button onClick={handlePlay} type="button">
                        START CURRENT PLAYLIST
                    </button>
                ) : <></>}
                <div className='panel'>
                    <div className='nextPrev'>
                        <i onClick={() => { handleSkip('prev') }} className="fa-solid fa-backward-step fa-2xl"></i>
                        {playing ? (
                            <i onClick={handlePause} className="fa-solid fa-circle-pause fa-2xl"></i>
                        ) : (
                            <i onClick={handleResume} className="fa-solid fa-circle-play fa-2xl"></i>
                        )}
                        <i onClick={() => { handleSkip('next') }} className="fa-solid fa-forward-step fa-2xl"></i>
                    </div>
                </div>
            </div>
            {player ? (
                <InfoPanel token={token} device={device} />
            ) : <></>}
        </div>
    )
}

export default MainPage