const getPlaybackState = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error.response.data)
    }
}

const getDevices = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data.devices;
    } catch (error) {
        console.log(error.response.data)
    }
}

const play = async (token, device) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        })

        if (result.status === 204) {
            console.log('Playback resumed successfully');
        } else {
            console.log('Failed to resume playback. Status:', result.status);
            console.log('Response:', await result.json());
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const playPlaylist = async (token, playlistURI, device) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context_uri: playlistURI,
            }),
        })

        if (result.status === 204) {
            console.log('Playback resumed successfully');
        } else {
            console.log('Failed to resume playback. Status:', result.status);
            console.log('Response:', await result.json());
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const pause = async (token, device) => {

    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

    } catch (error) {
        console.log(error.response.data)
    }
}

const next = async (token, device) => {

    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${device}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

    } catch (error) {
        console.log(error.response.data)
    }
}

const previous = async (token, device) => {

    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${device}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

    } catch (error) {
        console.log(error.response.data)
    }
}

export {getPlaybackState, getDevices, play, pause, next, previous, playPlaylist}