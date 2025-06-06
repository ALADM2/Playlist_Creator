const getSongInfo = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        // console.log(result.status)
        if (result.status === 401){
            return result.status
        }
        
        const data = await result.json();
        if(result.ok){
            return data;
        } else {
            return data.error.message;
        }

    } catch (error) {
        console.log(error.message)
    }
}

export { getSongInfo }