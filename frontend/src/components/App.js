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
  const [token, setToken] = React.useState('');
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


  const checkToken = React.useCallback(
    () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      setToken(token);

    auth.checkToken(token)
    .then((res) => {
      if (res) {
        setLoggedIn(true);
        setAuthorizationEmail(res.email);
        history.push("/");
      }
    })
      .catch((err) => {
        console.log(err);
      });
    }
  }, 
  [history]
  );

  useEffect(() => {
    checkToken();
  }, [checkToken])

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      api.getData(token)
        .then((res) => {
          const [userData, cardsData] = res;
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn])
  
  function handleUpdateUser(data) { //ok
    api
      .setUserInfo(data, token)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(data) { //ok
    api
      .setUserAvatar(data, token)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     api.getCards(token)
//     .then((data) => {
//       setCards(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     api.getUserInfo(token)
//     .then((data) => {
//       setCurrentUser(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, []);


  function handleCardLike(card) {
   
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.find((i) => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    
    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });   //ok
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards((state) => state.filter((c) => c !== card));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });  //ok
  }
  function handleAddPlaceSubmit(data) {
    api
      .createCard(data, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }  //ok

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
        })  //ok
  }

  function login(data) {
    auth.autorize(data).then(
      (res) => {
        setLoggedIn(true);
        localStorage.setItem("jwt", res.token);
        setToken(res.token);
        setAuthorizationEmail(data.email)
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      })  //ok
  }

  function handleSignOut() {  //проверено
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    setToken('');
    history.push("/sign-in");
  }

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

  //   useEffect(() => {
  //     const token = localStorage.getItem("jwt");
  //   if (token) {
  //     checkToken();
  //   }
  // }, [checkToken]);


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
