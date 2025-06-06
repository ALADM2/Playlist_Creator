import React, { createContext, useEffect, useState } from "react";
import { getToken, checkTokenExpired, getRefreshToken } from "../controllers/apiController";
import { Navigate } from "react-router-dom";

const TokenContext = createContext();

// Provides components with login state
const TokenProvider = (props) => {
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [tokenStatus, setTokenStatus] = useState();
    let codeVerifier = localStorage.getItem('code_verifier');
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const findToken = async () => {
        const theToken = await getToken(codeVerifier, code);
        setToken(theToken);
        if (theToken !== 400) {
            sessionStorage.setItem('token', theToken)
        }
    }

    const checkTokenState = async () => {
        const tokenState = await checkTokenExpired(token);
        console.log(tokenState);
        if (tokenState === 'Invalid') {
            setToken(sessionStorage.getItem('refresh_token'));
        }
    }

    // useEffect(() => {
    //     if(token)
    // }, [token])

    useEffect(() => {
        async function findToken() {
            const theToken = await getToken(codeVerifier, code);
            setToken(theToken);
            if (theToken !== 400) {
                sessionStorage.setItem('token', theToken)
            }
        }
        //Find token if there is no token and there is hashed code
        if (!token && code) {
            findToken();
        }
    }, [code])

    useEffect(() => {
        async function checkToken() {
            setTokenStatus(await checkTokenExpired(token));
        }

        // Check currently playing track every 5 seconds
        const intervalId = setInterval(checkToken, 300000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [token])

    useEffect(() => {
        if(tokenStatus === 401){
            console.log("Aqui estamos en login.jsx")
            sessionStorage.removeItem('token')
            // return <Navigate to="/" />
            window.location.reload();
        }
    }, [tokenStatus])

    console.log(token)

    return (
        <TokenContext.Provider value={{ token, findToken, checkTokenState }}>
            {props.children}
        </TokenContext.Provider>
    )
}

export { TokenContext, TokenProvider }