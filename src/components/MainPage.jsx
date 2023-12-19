import React, { useState, useContext, useEffect } from 'react'
import DropDown from './DropDown'
import Input from './Input'
import Panel from './Panel'
import { playPlaylist, pause, next, previous, getPlaybackState, play } from '../controllers/player'
import { findPlaylist } from '../controllers/playlists'
import { TokenContext } from '../contexts/login'
import { ListContext } from '../contexts/playlist'
import { DeviceContext, DeviceProvider } from '../contexts/device'
import InfoPanel from './InfoPanel'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import './CSS/MainPage.css'

const MainPage = () => {
    const [playState, setPlayState] = useState(); //Current play data
    const [topSongs, setTopSongs] = useState();
    const [song, setSong] = useState();
    const [artist, setArtist] = useState();
    const [player, setPlayer] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [dataModified, setDataModified] = useState(false);
    const [searchToggle, setSerachToggle] = useState(false);
    const [playButton, setPlayButton] = useState(false);
    const { getPlayList, playList } = useContext(ListContext);
    const { device } = useContext(DeviceContext);
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');
    const navigate = useNavigate();

    // if(playState){
    //     console.log(playState)
    // }

    //Check player state
    useEffect(() => {
        async function findState() {
            setPlayState(await getPlaybackState(token));
        }
        if (token) {
            findState();
        } 
        // else {
        //     tokenContextValue.findToken();
        // }
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
        if (playState && playState !== 'The access token expired' && playState !== 204) {
            setPlayingData()
        }
        // else{
        //     sessionStorage.removeItem('token')
        //     /navigate('/');
        // }
    }, [playState])

    //If artist is modified
    useEffect(() => {
        setDataModified(true);
    }, [artist, song])

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

    // function handleResume() {
    //     if (device) {
    //         play(token, device)
    //         setPlayer(true);
    //         setPlaying(true);
    //     } else {
    //         alert("Please, select a device")
    //     }
    // }

    // function handlePause() {
    //     if (device) {
    //         pause(token, device);
    //         setPlaying(false);
    //     } else {
    //         alert("Please, select a device")
    //     }
    // }

    // function handleSkip(action) {
    //     action === 'next' ? next(token, device) : previous(token, device)
    // }

    // if (playState === 'The access token expired' && token) {
    //     tokenContextValue.checkTokenState();
    // }

    return (
        <div className='player'>
            <div className='selectMenu'>
                <Input data={'artist'} setTopSongs={setTopSongs} setArtist={setArtist} artist={artist} />
                <div className='songDiv'>
                    {!searchToggle ? (
                        <DropDown setSong={setSong} topSongs={topSongs} data={'topSongs'} />
                    ) : (
                        <Input data={'songs'} artist={artist} setSong={setSong} song={song} />
                    )}
                    {searchToggle === true ? (
                        <i onClick={() => { setSerachToggle(!searchToggle) }} className="fa-solid fa-toggle-on fa-2xl"></i>
                    ) : (
                        <i onClick={() => { setSerachToggle(!searchToggle) }} className="fa-solid fa-toggle-off fa-2xl"></i>
                    )}
                </div>
                <DropDown data={'devices'} />
                {song && dataModified ? (
                    <Input data={'playlist'} artist={artist} song={song} />
                ) : playList ? (
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
                {device && playList ? (
                    <button onClick={handlePlay} type="button">
                        START CURRENT PLAYLIST
                    </button>
                ) : <></>}
                <Panel setPlayer={setPlayer} setPlaying={setPlaying}></Panel>
            </div>
            {player ? (
                <InfoPanel token={token} device={device} />
            ) : <></>}
        </div>
    )
}

export default MainPage