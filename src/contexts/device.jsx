import React, { createContext, useEffect, useState, useContext } from "react";
import { getPlaybackState } from "../controllers/player";
import { TokenContext } from '../contexts/login'
import { Navigate } from 'react-router-dom'

const DeviceContext = createContext();

// Provides components with login state
const DeviceProvider = (props) => {
    const [device, setDevice] = useState();
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');

    useEffect(() => {
        async function findDevice(){
            try{          
                const data = await getPlaybackState(token);
                setDevice(data.device.id);
            } catch(error){
                console.log(error)
            }
        }
        
        if(!device && token){
            findDevice()
        }
    }, [device, token])
    
    async function saveDevice(deviceId) {
        sessionStorage.setItem('device', deviceId);
        setDevice(sessionStorage.getItem('device'));
    }

    return (
        <DeviceContext.Provider value={{ device, saveDevice }}>
            {props.children}
        </DeviceContext.Provider>
    )
}

export { DeviceContext, DeviceProvider }