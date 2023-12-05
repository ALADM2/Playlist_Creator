import React, { useState, useContext } from 'react'
import DropDown from './DropDown'
import Input from './Input'
import { play, playPlaylist, pause, next, previous } from '../controllers/player'
import { TokenContext } from '../contexts/login'
import InfoPanel from './InfoPanel'
import { Navigate } from 'react-router-dom'
import './CSS/MainPage.css'

const MainPage = () => {
    const [topSongs, setTopSongs] = useState();
    const [song, setSong] = useState();
    const [artist, setArtist] = useState();
    const [playList, setPlaylist] = useState();
    const [device, setDevice] = useState();
    const [player, setPlayer] = useState(false);
    const [playing, setPlaying] = useState(false);
    const { token } = useContext(TokenContext)

    function handlePlay() {
        playPlaylist(token, playList[0].uri, device)
        setPlayer(true);
        setPlaying(true);
    }

    function handlePause() {
        pause(token, device);
        setPlaying(false);
    }

    function handleSkip(action) {
        action === 'next' ? next(token, device) : previous(token, device)
    }

    if(token === 400){
        return <Navigate to="/" />;
    } 

    return (
        <div className='player'>
            <div className='selectMenu'>
                <Input setTopSongs={setTopSongs} setArtist={setArtist} artist={artist} />
                <DropDown setSong={setSong} topSongs={topSongs} data={'topSongs'} />
                {song ? (
                    <Input data={'playlist'} setPlaylist={setPlaylist} artist={artist} song={song} />
                    ) : <></>}
                <DropDown setDevice={setDevice} data={'devices'} />
                <div className='panel'>
                    <div className='nextPrev'>
                        <i onClick={() => { handleSkip('prev') }} className="fa-solid fa-backward-step fa-2xl"></i>
                        {playing ? (
                            <i onClick={handlePause} class="fa-solid fa-circle-pause fa-2xl"></i>
                        ) : (
                            <i onClick={handlePlay} class="fa-solid fa-circle-play fa-2xl"></i>
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