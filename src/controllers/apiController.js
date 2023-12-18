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
            console.log('Token obtained correctly.');
            const data = await res.json();
            sessionStorage.setItem('token', data.access_token);
            sessionStorage.setItem('refresh_token', data.refresh_token);
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

const getRefreshToken = async () => {
    const clientID = '4e3f37f14bf7476298ed0d9971c5d92d';
    const refreshToken = sessionStorage.getItem('refresh_token');
    console.log(refreshToken)
    try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientID,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        })

        if (res.ok) {
            console.log('Refresh Token obtained correctly.');
            const data = await res.json();
            //sessionStorage.setItem('token', data.access_token);
            sessionStorage.setItem('token', data.refresh_token);
        } else {
            console.error('Failed to obtain refresh token. Status:', res.status);
            console.log('Response:', await res.json());
            return res.status;
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const checkTokenExpired = async (token) => {
    try {
        const res = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

        if (!res.ok) {
            return 'Invalid';
        }
        console.log(await res.json())

    } catch (error) {
        console.log(error)
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

export { getToken, getGenres, getRefreshToken, checkTokenExpired }
