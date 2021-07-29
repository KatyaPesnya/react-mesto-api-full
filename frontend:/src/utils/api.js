
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
    getData() {
        return Promise.all([this.getUserInfo(), this.getCards()]);
    }
    getCards() {
        return fetch(`${this._url}/cards`, {
             headers: this._headers })
            .then(this._checkResponse)
    }
    createCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
            .then(this._checkResponse)
    }
    deleteCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(this._checkResponse)
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            headers: this._headers,
        })
            .then(this._checkResponse)
    }
   changeLikeCardStatus(id, isLiked) {
     if (isLiked) {
       return this.setLike(id);
     } else {
       return this.deleteLike(id);
     }
   }

    setUserInfo(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._checkResponse)
    }
    setUserAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar
              })
            })
            .then(this._checkResponse)
    }

    setLike(id) {
        return fetch(`${this._url}/cards/likes/${id}`, {
            method: 'PUT',
            headers: this._headers,
        })
            .then(this._checkResponse)
    }
    deleteLike(id) {
        return fetch(`${this._url}/cards/likes/${id}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(this._checkResponse)
    }
}

 const api = new Api({
     url: 'https://mesto.nomoreparties.co/v1/cohort-21',
     headers: {
     Authorization: '8bc2b522-b2e5-4475-a3df-8cf1760d3928',
        'Content-Type': 'application/json'
    }
  }
)
 export default  api;