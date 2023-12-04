import React, { createContext, useEffect, useState } from "react";
import { getToken } from "../controllers/apiController";

const TokenContext = createContext();

// Provides components with login state
const TokenProvider = (props) => {
    const [token, setToken] = useState(null);
    let codeVerifier = localStorage.getItem('code_verifier');
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    
    useEffect(() => {
        async function findToken(){
            setToken(await getToken(codeVerifier, code));
        }
        
        if(code){
            findToken();
        }
    }, [code])
    
    return (
        <TokenContext.Provider value={{ token }}>
            {props.children}
        </TokenContext.Provider>
    )  
}

export { TokenContext, TokenProvider }