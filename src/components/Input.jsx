import './CSS/Input.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../contexts/login';
import { getArtists, getTopSongs, fetchSuggestions } from '../controllers/artists';
import { createPlaylist } from '../controllers/apiController';
import { ColorRing } from 'react-loader-spinner'

const Input = (props) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [artistSelected, setArtistSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');
    const inputRef = useRef(null);
    const artist = props.artist;

    async function handleClick() {
        setLoading(true);
        if (props.data === 'playlist') {
            props.setPlaylist(await createPlaylist(token, artist.genres, artist.name, artist.id, props.song));
        } else {
            props.setArtist(await getArtists(token, inputRef.current.value))
        }
        setLoading(false);
    }

    useEffect(() => {
        async function findTopSongs() {
            if (artist && props.data !== 'playlist') {
                props.setTopSongs(await getTopSongs(token, artist.id))
            }
        }
        findTopSongs();
    }, [artist])

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // Adjust the delay as needed (e.g., 300 milliseconds)

        return () => {
            clearTimeout(timerId);
        };
    }, [query]);

    useEffect(() => {
        // Fetch artist suggestions when the query changes
        async function findSuggestions() {
            setSuggestions(await fetchSuggestions(token, query));
        }

        // Only fetch suggestions if the query is not empty
        if (query.trim() !== '') {
            findSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const handleSuggestionClick = (artist) => {
        setQuery(artist.name);
        setArtistSelected(true);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        // Clear suggestions only when the input value changes
        setSuggestions([]);
        setArtistSelected(false);
    };

    return (
        <div>
            <label htmlFor="artist" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.data === 'playlist' ? (
                    <p>Create playlist</p>
                ) : (
                    <p>Select an Artist</p>
                )}
            </label>
            <div className='inputDiv'>
                {props.data === 'playlist' ? (
                    null) : (
                    <div>
                        <input ref={inputRef} type="text" id="artist" value={query} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for artists" required></input>
                        {suggestions.length > 0 && !artistSelected ? (
                            <ul>
                                {suggestions.slice(0, 5).map((artist) => (
                                    <li key={artist.id} onClick={() => handleSuggestionClick(artist)}>{artist.name}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )
                }
                {!loading ? (
                    <button onClick={handleClick} type="submit">
                        {props.data === 'playlist' ? (
                            <p>CREATE</p>
                        ) : (
                            <p>FIND</p>
                        )}
                    </button>
                ) : (
                    <ColorRing
                        visible={true}
                        height="60"
                        width="60"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                )}
            </div>
        </div>
    )
}

export default Input