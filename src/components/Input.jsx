import './CSS/Input.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../contexts/login';
import { getArtists, getTopSongs, fetchSuggestions, getSongs, fetchSongSuggestions } from '../controllers/artists';
import { createPlaylist } from '../controllers/playlists';
import { ColorRing } from 'react-loader-spinner'
import { ListContext } from '../contexts/playlist';

const Input = (props) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [artistSelected, setArtistSelected] = useState(false);
    const [songSelected, setSongSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const { getPlayList } = useContext(ListContext);
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');
    const inputRef = useRef(null);
    const artist = props.artist;

    async function handleClick() {
        setLoading(true);
        if (props.data === 'playlist') {
            getPlayList(await createPlaylist(token, artist.genres, artist.name, artist.id, props.song));
        }
        if (props.data === 'artist') {
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
            if (props.data === 'artist') {
                setSuggestions(await fetchSuggestions(token, query));
            } else {
                setSuggestions(await fetchSongSuggestions(token, query, props.artist.name));
            }
        }

        // Only fetch suggestions if the query is not empty
        if (query.trim() !== '') {
            findSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const handleSuggestionClick = (value, type) => {
        setQuery(value.name);
        if (type === 'artist') {
            setArtistSelected(true);
            async function sendArtist() {
                props.setArtist(await getArtists(token, inputRef.current.value))
            }
            sendArtist();
        } else {
            setSongSelected(true);
            async function sendSong() {
                props.setSong(await getSongs(token, inputRef.current.value))
            }
            sendSong();
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        // Clear suggestions only when the input value changes
        setSuggestions([]);
        setArtistSelected(false);
        setSongSelected(false);
    };
    if (props.song) {
        console.log(props.song)
    }
    return (
        <div>
            <label htmlFor="artist" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.data === 'playlist' ? (
                    <p>Create playlist</p>
                ) : props.data === 'artist' ? (
                    <p>Select an Artist</p>
                ) : (
                    <p>Select first song for the playlist</p>
                )}
            </label>
            <div className='inputDiv'>
                {props.data === 'playlist' ? (
                    null) : props.data === 'songs' ? (
                        <div>
                            <input ref={inputRef} type="text" id="song" value={query} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for a song" required></input>
                            {suggestions.length > 0 && !songSelected ? (
                                <ul>
                                    {suggestions.slice(0, 5).map((song) => (
                                        <li key={song.id} onClick={() => handleSuggestionClick(song, 'song')}>{song.name}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ) : (
                    <div>
                        <input ref={inputRef} type="text" id="artist" value={query} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for artists" required></input>
                        {suggestions.length > 0 && !artistSelected ? (
                            <ul>
                                {suggestions.slice(0, 5).map((artist) => (
                                    <li key={artist.id} onClick={() => handleSuggestionClick(artist, 'artist')}>{artist.name}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )
                }
                {!loading && props.data === 'playlist' ? (
                    <button onClick={handleClick} type="submit">
                        <p>CREATE</p>
                    </button>
                ) : props.data === 'songs' || props.data === 'artist' ? (
                    <></>
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