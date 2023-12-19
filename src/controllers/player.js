const getPlaybackState = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(result.status === 204){
            console.log("No devices found")
            return result.status
        }
        const data = await result.json();

        if(!result.ok){
            if(data.error.message === 'The access token expired'){
                return data.error.message;
            }
        }else{
            console.log("Playback On")
            return data;
        }

    } catch (error) {
        console.log(error)
    }
}

const getDevices = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        
        const data = await result.json();

        // if(data.error.message === 'The access token expired'){
        //     console.log("hiii")
        //     return data.error.message;
        // }
        if(!result.ok){
            return data.error.message
        }
        return data.devices;
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
}

const playSong = async (token, playlistURI, songUri, device) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context_uri: playlistURI,
                offset: {
                    uri: songUri,
                },
            }),
        })

        if (result.status === 204) {
            console.log('Song played successfully');
        } else {
            console.log('Failed to play song. Status:', result.status);
            console.log('Response:', await result.json());
        }

    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
    }
}

export { getPlaybackState, getDevices, play, pause, next, previous, playSong, playPlaylist }