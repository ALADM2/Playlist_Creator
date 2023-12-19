import React, { createContext, useEffect, useState, useContext } from "react";
import { getPlaybackState } from "../controllers/player";
import { TokenContext } from '../contexts/login'
import { useNavigate } from 'react-router-dom'

const DeviceContext = createContext();

// Provides components with login state
const DeviceProvider = (props) => {
    const [device, setDevice] = useState();
    const [deviceName, setDeviceName] = useState();
    const navigate = useNavigate();
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');

    useEffect(() => {
        async function findDevice(){
            try{          
                const data = await getPlaybackState(token);
                // if(data === 204 && device){
                //     navigate('/');
                // }
                if(device){
                    setDevice(data.device.id);
                }
            } catch(error){
                console.log(error)
            }
        }
        
        if(token){
            findDevice()
        }
    }, [device, token])

    async function saveDevice(deviceId, deviceName) {
        sessionStorage.setItem('device', deviceId);
        sessionStorage.setItem('deviceName', deviceName);
        setDevice(sessionStorage.getItem('device'));
        setDeviceName(sessionStorage.getItem('deviceName'));
    }

    return (
        <DeviceContext.Provider value={{ device, deviceName, saveDevice }}>
            {props.children}
        </DeviceContext.Provider>
    )
}

export { DeviceContext, DeviceProvider }