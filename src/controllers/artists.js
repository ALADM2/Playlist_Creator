const fetchSuggestions = async (token, query) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        const data = await response.json();
        // Extract relevant artist information from the response
        const artists = data.artists?.items || [];
        return artists;
    } catch (error) {
        console.error('Error fetching artist suggestions:', error);
    }
};

const fetchSongSuggestions = async (token, query, artist) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=track:${query}+artist:${artist}&type=track`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        const data = await response.json();
        // Extract relevant artist information from the response
        const songs = data.tracks?.items || [];
        return songs;
    } catch (error) {
        console.error('Error fetching artist suggestions:', error);
    }
};

const getArtists = async (token, artistName) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(result.ok){
            const data = await result.json();
            return data.artists.items[0];
        } else {
            console.error('Error searching for artists:', result.status, result.statusText);
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const getSongs = async (token, songName) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(result.ok){
            const data = await result.json();
            return data.tracks.items[0].uri;
        } else {
            console.error('Error searching for tracks:', result.status, result.statusText);
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

const getTopSongs = async (token, artistID) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(result.ok){
            const data = await result.json();
            //console.log(data)
            return data.tracks;
        } else {
            console.error('Error searching for artists:', result.status, result.statusText);
        }

    } catch (error) {
        console.log(error.response.data)
    }
}

export { getArtists, getTopSongs, fetchSuggestions, getSongs, fetchSongSuggestions }