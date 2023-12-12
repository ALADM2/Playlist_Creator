import React, { useContext, useEffect, useState } from 'react'
import './CSS/Playlist.css'
import { ListContext } from '../contexts/playlist';

const Playlist = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [elementIndex, setElementIndex] = useState();
    const { playList } = useContext(ListContext);
    console.log(playList)

    function handleIn(index) {
        setIsHovering(true);
        setElementIndex(index);
    }

    function handleOut() {
        setIsHovering(false);
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
                            {isHovering && index === elementIndex ? (
                                <>
                                    <img src={song.track.album.images[2].url} alt="" style={{opacity: 0.3}} />
                                    <i class="fa-solid fa-circle-play fa-2xl"></i>
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