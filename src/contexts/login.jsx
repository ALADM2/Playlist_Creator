import React, { createContext, useEffect, useState } from "react";
import { getToken, checkTokenExpired, getRefreshToken } from "../controllers/apiController";

const TokenContext = createContext();

// Provides components with login state
const TokenProvider = (props) => {
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    let codeVerifier = localStorage.getItem('code_verifier');
    //console.log(codeVerifier)
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const findToken = async () => {
        const theToken = await getToken(codeVerifier, code);
        setToken(theToken);
        if(theToken !== 400){
            sessionStorage.setItem('token', theToken)
        }
    }

    const checkTokenState = async () => {
        const tokenState = await checkTokenExpired(token);
        console.log(tokenState);
        if(tokenState === 'Invalid'){
            setToken(await getRefreshToken(token));
        }
    }

    // useEffect(() => {
    //     if(token)
    // }, [token])

    useEffect(() => {
        async function findToken() {
            const theToken = await getToken(codeVerifier, code);
            setToken(theToken);
            if(theToken !== 400){
                sessionStorage.setItem('token', theToken)
            }
        }
        //Find token if there is no token and there is hashed code
        if (!token && code) {
            findToken();
        }
    }, [code])

    //Check if token is expired
    // useEffect(() => {
    //     async function checkTokenState(){
    //         const tokenState = await checkTokenExpired();
    //         console.log(tokenState);
    //     }

    //     if(token !== null){
    //         checkTokenState();
    //     }
    // }, [])

    return (
        <TokenContext.Provider value={{ token, findToken, checkTokenState }}>
            {props.children}
        </TokenContext.Provider>
    )
}

export { TokenContext, TokenProvider }