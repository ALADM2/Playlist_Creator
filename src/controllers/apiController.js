const getToken = async (codeVerifier, code) => {
    const clientID = '4e3f37f14bf7476298ed0d9971c5d92d';
    const redirectUri = import.meta.env.MODE === 'development'
        ? 'http://localhost:5173/mainpage'
        : import.meta.env.VITE_REDIRECT;

    try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        })

        if (res.ok) {
            console.log('Token obtained correcly.');
            const data = await res.json();
            return data.access_token;
        } else {
            console.error('Failed to obtain token. Status:', res.status);
            console.log('Response:', await res.json());
            return res.status;
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const getGenres = async (token) => {
    try {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data.categories.items;
    } catch (error) {
        console.log(error.response.data)
    }

}

export { getToken, getGenres }
