
 class Api {
    constructor(options) {
        this._url = options.url;
        this._headers = options.headers;
    }
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`);
    }
    getData(token) {
        return Promise.all([this.getUserInfo(token), this.getCards(token)]);
    }
    getCards(token) {
        return fetch(`${this._url}/cards`, {
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              }, })
            .then(this._checkResponse)
    }
    createCard(data, token) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
            .then(this._checkResponse)
    }
    deleteCard(id, token) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
        })
            .then(this._checkResponse)
    }

    getUserInfo(token) {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
        })
            .then(this._checkResponse)
    }
   changeLikeCardStatus(id, isLiked, token) {
     if (isLiked) {
       return this.setLike(id, token);
     } else {
       return this.deleteLike(id, token);
     }
   }

    setUserInfo(data, token) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._checkResponse)
    }
    setUserAvatar(data, token) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
            body: JSON.stringify({
                avatar: data.avatar
              })
            })
            .then(this._checkResponse)
    }

    setLike(id, token) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: 'PUT',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
        })
            .then(this._checkResponse)
    }
    deleteLike(id, token) {
        console.log('DELETE')
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
              },
                
        })
            .then(this._checkResponse)
    }
}

 const api = new Api({
     url: 'https://api.mesto.pesnya.nomoredomains.club',
     headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  }
)
 export default  api;
