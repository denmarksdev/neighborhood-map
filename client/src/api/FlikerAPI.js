const API_KEY = 'e927d480e80b4b87614631c0143290a6';
const USER_ID = '157827400%40N05';
const BASE_URL = 'https://api.flickr.com/services/rest'

export default class FlikerAPI {

    FlikerException(message, name = 'PhotoException') {
        this.message = message;
        this.name = name;
    }

    getFoto(text) {

        const url = `${BASE_URL}/?method=flickr.photos.search&api_key=${API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1&format=json&text=${text}`

        return fetch(url)
            .then((response) =>
                response.json().then(json => {

                    if (json.photos.total === "0") throw this.FlikerException("Photo not found")

                    /* See the flicker documentation to form the image url
                        https://www.flickr.com/services/api/misc.urls.html
                    */
                    const { id, farm, server, secret } = json.photos.photo[0];
                    const imageURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;

                    return imageURL;
                }))
    }

}