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
                    <h1 style={{ color: '#73BBC9', fontFamily: 'Agbalumo', letterSpacing:5, WebkitTextStrokeWidth: 1.5, WebkitTextStrokeColor: 'black', margin: 0 }}>PLAYLIST</h1>
                    <span style={{ fontSize: '10px', margin: '0 5px' }}></span>
                    <h1 style={{ color: '#080202', fontFamily: 'Agbalumo', letterSpacing:5, margin: 0 }}>🎵 CREATOR</h1>
                </div>
            </div>
            <button onClick={handleClick}>LOG IN</button>
        </>
    )
}

export default LogPage