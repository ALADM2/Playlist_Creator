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

export { getArtists, getTopSongs }