import React, { useContext, useEffect, useState } from 'react'
import './CSS/Playlist.css'
import { TokenContext } from '../contexts/login'
import { ListContext } from '../contexts/playlist';

const Playlist = () => {
    const { playList } = useContext(ListContext);
    console.log(playList)

    return (
        <div className='listbox'>
            <ul className='list'>
                <h2 className='name'>{playList.name}</h2>
                <hr className='bar'></hr>
                {playList.tracks.items.map((song) => (
                    <li className='element' key={song.track.id}>
                        <div className='text'>
                            <p>Track Name: {song.track.name}</p>
                            <p>Artist: {song.track.artists.map(artist => artist.name).join(', ')}</p>
                        </div>
                        <div className='imgContainer'>
                            <img src={song.track.album.images[2].url} alt="" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Playlist