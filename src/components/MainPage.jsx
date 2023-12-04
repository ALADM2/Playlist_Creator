import React, { useState, useContext } from 'react'
import DropDown from './DropDown'
import Input from './Input'
import { play, playPlaylist, pause, next, previous } from '../controllers/player'
import { TokenContext } from '../contexts/login'
import InfoPanel from './InfoPanel'
import './CSS/MainPage.css'

const MainPage = () => {
    const [topSongs, setTopSongs] = useState();
    const [song, setSong] = useState();
    const [genres, setGenres] = useState();
    const [artist, setArtist] = useState();
    const [playList, setPlaylist] = useState();
    const [device, setDevice] = useState();
    const [player, setPlayer] = useState(false);
    const { token } = useContext(TokenContext)

    function handlePlay(type) {
        type === 'song' ? play(token, song, device) : playPlaylist(token, playList[0].uri, device)
        setPlayer(true);
    }

    function handlePause() {
        pause(token, device)
    }

    function handleSkip(action) {
        action === 'next' ? next(token, device) : previous(token, device)
    }

    return (
        <div className='player'>
            <div className='selectMenu'>
                <Input setTopSongs={setTopSongs} setGenres={setGenres} setArtist={setArtist} artist={artist} />
                <DropDown setSong={setSong} topSongs={topSongs} data={'topSongs'} />
                <DropDown setDevice={setDevice} data={'devices'} />
                {player ? (
                    <Input data={'playlist'} setPlaylist={setPlaylist} artist={artist} />
                ) : <></>}
                <div className='panel'>
                    <div className='playPause'>
                        <button onClick={() => { handlePlay('song') }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Play Song</button>
                        {playList ? (
                            <button onClick={() =>{handlePlay('list')}} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Play Playlist</button>
                        ) : null}
                        <button onClick={handlePause} type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Pause</button>
                    </div>
                    <div className='nextPrev'>
                        <i onClick={() => { handleSkip('prev') }} className="fa-solid fa-backward-step fa-2xl"></i>
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