import './CSS/Input.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../contexts/login';
import { getArtists, getTopSongs } from '../controllers/artists';
import { createPlaylist } from '../controllers/apiController';

const Input = (props) => {
    const { token } = useContext(TokenContext);
    const inputRef = useRef(null);
    const artist = props.artist;

    async function handleClick() {
        if (props.data === 'playlist') {
            props.setPlaylist(await createPlaylist(token, artist.genres, artist.name, artist.id));
        } else {
            props.setArtist(await getArtists(token, inputRef.current.value))
        }
    }

    useEffect(() => {
        async function findTopSongs() {
            if (artist && props.data!=='playlist') {
                props.setTopSongs(await getTopSongs(token, artist.id))
                props.setGenres(artist.genres)
            }
        }
        findTopSongs();
    }, [artist])

    return (
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.data === 'playlist' ? (<p>Create playlist</p>) : (<p>Select an Artist</p>)}
            </label>
            <div className='inputDiv'>
                {props.data === 'playlist' ? (
                    null) : (
                    <input ref={inputRef} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pink Floyd" required></input>
                )
                }
                <button onClick={handleClick} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {props.data === 'playlist' ? (<p>Create</p>) : (<p>Find</p>)}
                </button>
            </div>
        </div>
    )
}

export default Input