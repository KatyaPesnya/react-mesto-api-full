import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ConfirmPopup from "./ConfirmPopup";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoToolTip from "./InfoTooltip";

import api from "../utils/api";
import * as auth from "../utils/auth";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const [authorizationEmail, setAuthorizationEmail] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const history = useHistory();

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c !== card));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleAddPlaceSubmit(data) {
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

    useEffect(() => {
    api
      .getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

    useEffect(() => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoToolTipOpen() {
    setIsInfoToolTipOpen(!isInfoToolTipOpen);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
  }
  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function register(data) {
    auth.register(data).then(
      (data) => {
        setIsSuccess(true);
        handleInfoToolTipOpen();
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        setIsSuccess(false);
        handleInfoToolTipOpen();
        })
  }

  function login(data) {
    auth.autorize(data).then(
      (data) => {
        setLoggedIn(true);
        localStorage.setItem("jwt", data.token);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/sign-in");
  }

  const checkToken = React.useCallback(() => {
    
    const token = localStorage.getItem("jwt");

    auth.checkToken(token).then(
      (data) => {
        setLoggedIn(true);
        setAuthorizationEmail(data.data.email);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      }
    );
  }, [history]);

    useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken();
    }
  }, [checkToken]);


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="root">
          <div className="page">
            <Header
              loggedIn={loggedIn}
              onSignOut={handleSignOut}
              authorizationEmail={authorizationEmail}
            />
            <Switch>
              <Route path="/sign-up">
                <Register onRegister={register} />
              </Route>
              <Route path="/sign-in">
                <Login onLogin={login} onCheckToken={checkToken} />
              </Route>

              <ProtectedRoute
                path exact="/"
                component={Main}
                loggedIn={loggedIn}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
              />
              <Route>
                {loggedIn ? <Redirect to="/sign-in" /> : <Redirect to="/" />}
              </Route>
            </Switch>
            <Footer />
          </div>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
              <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleCardDelete}
        title="Вы уверены?"
        submitText="Да"
      />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
      <InfoToolTip
        isOpen={isInfoToolTipOpen}
        onClose={closeAllPopups}
        isSuccess={isSuccess}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
