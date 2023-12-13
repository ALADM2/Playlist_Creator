import React, { createContext, useEffect, useState, useContext } from "react";
import { getPlaybackState } from "../controllers/player";
import { TokenContext } from '../contexts/login'

const DeviceContext = createContext();

// Provides components with login state
const DeviceProvider = (props) => {
    const [device, setDevice] = useState();
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');

    useEffect(() => {
        async function findDevice(){
            const data = await getPlaybackState(token);
            console.log(data)
            setDevice(data.device.id)
        }

        if(!device){
            findDevice()
        }
    }, [device, token])

    async function saveDevice(deviceId) {
        sessionStorage.setItem('device', deviceId);
        setDevice(sessionStorage.getItem('device'));
    }
    console.log(device)
    return (
        <DeviceContext.Provider value={{ device, saveDevice }}>
            {props.children}
        </DeviceContext.Provider>
    )
}

export { DeviceContext, DeviceProvider }