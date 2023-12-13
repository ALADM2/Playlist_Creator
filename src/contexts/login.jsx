import React, { createContext, useEffect, useState } from "react";
import { getToken } from "../controllers/apiController";

const TokenContext = createContext();

// Provides components with login state
const TokenProvider = (props) => {
    const [token, setToken] = useState(null);
    let codeVerifier = localStorage.getItem('code_verifier');
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const findToken = async () => {
        const theToken = await getToken(codeVerifier, code);
        setToken(theToken);
        if(theToken !== 400){
            sessionStorage.setItem('token', theToken)
        }
    }

    useEffect(() => {
        async function findToken() {
            const theToken = await getToken(codeVerifier, code);
            setToken(theToken);
            if(theToken !== 400){
                sessionStorage.setItem('token', theToken)
            }
        }

        if (!token) {
            findToken();
        }
    }, [code])

    return (
        <TokenContext.Provider value={{ token, findToken }}>
            {props.children}
        </TokenContext.Provider>
    )
}

export { TokenContext, TokenProvider }