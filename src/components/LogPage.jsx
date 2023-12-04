import React from 'react'
import { getAuth } from '../utils/authorization.js'
import './CSS/LogPage.css'

const LogPage = () => {

    function handleClick() {
        getAuth();
    }

    return (
        <div className='login'>
            <button onClick={handleClick}>Log In</button>
        </div>
    )
}

export default LogPage