import React from 'react'
import { getAuth } from '../utils/authorization.js'
import './CSS/LogPage.css'

const LogPage = () => {

    function handleClick() {
        getAuth();
    }

    return (
        <>
            <div className='login'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{ color: '#228B22', fontFamily: 'Cursive', fontWeight:'bold', margin: 0 }}>🎵 Playlist</h1>
                    <span style={{ fontSize: '10px', margin: '0 5px' }}></span>
                    <h1 style={{ color: '#4C218B', fontFamily: 'Cursive', fontWeight:'bold', margin: 0 }}>Creator</h1>
                </div>
            </div>
            <button onClick={handleClick}>Log In</button>
        </>
    )
}

export default LogPage