import React, {useState} from 'react'
import { play, pause, next, previous } from '../controllers/player'
import './CSS/Panel.css'

const Panel = (props) => {

    function handleResume() {
        if (device) {
            play(token, device)
            props.setPlayer(true);
            props.setPlaying(true);
        } else {
            alert("Please, select a device")
        }
    }

    function handlePause() {
        if (device) {
            pause(token, device);
            props.setPlaying(false);
        } else {
            alert("Please, select a device")
        }
    }

    function handleSkip(action) {
        action === 'next' ? next(token, device) : previous(token, device)
    }
    return (
        <div className='panel'>
            <div className='nextPrev'>
                <i onClick={() => { handleSkip('prev') }} className="fa-solid fa-backward-step fa-2xl"></i>
                {props.playing ? (
                    <i onClick={handlePause} className="fa-solid fa-circle-pause fa-2xl"></i>
                ) : (
                    <i onClick={handleResume} className="fa-solid fa-circle-play fa-2xl"></i>
                )}
                <i onClick={() => { handleSkip('next') }} className="fa-solid fa-forward-step fa-2xl"></i>
            </div>
        </div>
    )
}

export default Panel